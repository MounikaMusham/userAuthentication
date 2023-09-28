"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authModel_1 = __importDefault(require("../models/authModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var transport = nodemailer_1.default.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    auth: {
        user: 'mounika.m@tynybay.io',
        pass: 'Mouni@vinay9487'
    }
});
const emailVerificationTokens = {};
let invalidAttempts = 0;
function userSignup(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, gender, DOB, email, mobileNumber } = body;
        try {
            //checking whether the user already exists or nor before signUP with email
            const existingUser = yield authModel_1.default.findOne({ email: body.email });
            if (existingUser) {
                // if user already exists throwing error
                return Promise.reject({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: "Email is already registered",
                    error: "Bad Request",
                });
            }
            const token = Math.random().toString(36).substr(2);
            emailVerificationTokens[email] = token;
            //converting password to hashed password in order to avoid storing actual password in database
            const salt = yield bcryptjs_1.default.genSalt(10);
            const modifiedPassword = yield bcryptjs_1.default.hash(body.password, salt);
            // creating user object with user details
            const userDetails = new authModel_1.default({
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                DOB: body.DOB,
                mobileNumber: body.mobileNumber,
                email: body.email,
                password: modifiedPassword,
                isEmailVerified: false
            });
            const verificationLink = `http://localhost:8001/app/verifyEmail/${token}`;
            var mailOptions = {
                from: 'mounika.m@tynybay.io',
                to: 'mounika.musham11@gmail.com',
                subject: 'user Sign up- Mounika Musham',
                html: `<p>click the below link to verify your email <a href='${verificationLink}'>verify</a></p>`
            };
            transport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('nodemailer error', error);
                }
                else {
                    console.log('Email sent' + info.response);
                }
            });
            // returning user details to API response
            return userDetails;
        }
        catch (error) {
        }
    });
}
function verifyEmail(requestedToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = requestedToken;
        const email = Object.keys(emailVerificationTokens).find((key) => emailVerificationTokens[key] === token);
        if (email) {
            console.log('email', email);
            delete emailVerificationTokens[email];
            try {
                const user = yield authModel_1.default.findOneAndUpdate({ email }, { isEmailVerified: true });
                console.log('user', user);
                if (!user) {
                    return Promise.reject({
                        statusCode: 400,
                        status: false,
                        data: {},
                        message: "user not found",
                    });
                }
                return Promise.resolve({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: "email verified successfully",
                });
            }
            catch (error) {
                console.error(error);
                return Promise.reject({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: error,
                });
            }
        }
        else {
            return Promise.reject({
                statusCode: 400,
                status: false,
                data: {},
                message: 'Invalid or Token expired',
            });
        }
    });
}
function userSignIn(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield authModel_1.default.findOne({ email: body.email });
            if (!user) {
                //if not found sending message as not registered
                return Promise.reject({
                    statusCode: 401,
                    status: false,
                    data: {},
                    msgs: "User not registered, please signup",
                    err: "Bad Request",
                });
            }
            //if user exists checking the password match
            const isPasswordValid = yield bcryptjs_1.default.compare(body.password, user.password);
            if (!isPasswordValid) {
                //if password not matched sending message as invalid password
                invalidAttempts++;
                console.log('invalidAttempts', invalidAttempts);
                if (invalidAttempts >= 3) {
                    return Promise.reject({
                        statusCode: 401,
                        status: false,
                        data: {},
                        message: "Account blocked , Please rest the password and try login again",
                        error: "Bad Request",
                    });
                }
                return Promise.reject({
                    statusCode: 401,
                    status: false,
                    data: {},
                    message: "Invalid  password",
                    error: "Bad Request",
                });
            }
            if (isPasswordValid && invalidAttempts < 3) {
                //if password matches generating jwt token
                const token = jsonwebtoken_1.default.sign({ userId: user._id, email: body.email }, "#MMM@vvvv@AAA@AAA#", {
                    expiresIn: "1d",
                });
                invalidAttempts = 0;
                //sending token in response
                return token;
            }
            else {
                return Promise.reject({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: "Crossed invalid attempts limit",
                });
            }
        }
        catch (error) {
            return Promise.reject({
                statusCode: 500,
                status: false,
                data: {},
                message: "Bad Request",
                error: error,
            });
        }
    });
}
function forgotPassword(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = body;
            const user = yield authModel_1.default.findOne({ email });
            if (!user) {
                return Promise.reject({
                    statusCode: 500,
                    status: false,
                    data: {},
                    message: "User not found",
                });
            }
            const token = Math.random().toString(36).substr(2);
            emailVerificationTokens[email] = token;
            const verificationLink = `http://localhost:8001/app/verifyResetPassword/${token}`;
            var mailOptions = {
                from: 'mounika.m@tynybay.io',
                to: 'mounika.musham11@gmail.com',
                subject: 'Reset password- Mounika Musham',
                html: `<p>click the below link to verify your email <a href='${verificationLink}'>verify</a></p>`
            };
            transport.sendMail(mailOptions, function (error, info) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log('nodemailer error', error);
                    }
                    else {
                        const user = yield authModel_1.default.updateOne({ email }, { $set: { isEmailVerifiedForForgotPassword: false } });
                        console.log('Email sent' + info.response);
                    }
                });
            });
            return true;
        }
        catch (error) {
            return Promise.reject({
                statusCode: 500,
                status: false,
                data: {},
                message: "Bad Request",
                error: error,
            });
        }
    });
}
function verifyResetPassword(requestedToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = requestedToken;
        const email = Object.keys(emailVerificationTokens).find((key) => emailVerificationTokens[key] === token);
        if (email) {
            delete emailVerificationTokens[email];
            try {
                const user = yield authModel_1.default.findOneAndUpdate({ email }, { isEmailVerifiedForForgotPassword: true });
                if (!user) {
                    return Promise.reject({
                        statusCode: 400,
                        status: false,
                        data: {},
                        message: "user not found",
                    });
                }
                return Promise.resolve({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: "email verified successfully",
                });
            }
            catch (error) {
                console.error(error);
                return Promise.reject({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: error,
                });
            }
        }
        else {
            return Promise.reject({
                statusCode: 400,
                status: false,
                data: {},
                message: 'Invalid or Token expired',
            });
        }
    });
}
function createNewPassword(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, newPassword } = body;
            const salt = yield bcryptjs_1.default.genSalt(10);
            // Update the user's password in the database (you should hash newPassword before saving it)
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
            const user = yield authModel_1.default.findOneAndUpdate({ email }, { password: hashedPassword });
            if (!user) {
                return Promise.reject({
                    statusCode: 400,
                    status: false,
                    data: {},
                    message: 'user not found',
                });
            }
            return user;
        }
        catch (error) {
            return Promise.reject({
                statusCode: 400,
                status: false,
                data: {},
                message: 'Invalid or Token expired',
            });
        }
    });
}
exports.default = { userSignup, verifyEmail, userSignIn, forgotPassword, verifyResetPassword, createNewPassword };

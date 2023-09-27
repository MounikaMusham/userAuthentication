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
exports.default = { userSignup, verifyEmail };

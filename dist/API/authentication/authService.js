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
function userSignup(body) {
    return __awaiter(this, void 0, void 0, function* () {
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
            });
            // returning user details to API response
            return userDetails;
        }
        catch (error) {
        }
    });
}

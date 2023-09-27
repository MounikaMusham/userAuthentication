"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidation = exports.signUpValidation = void 0;
const joi_1 = __importDefault(require("joi"));
function signUpValidation(body) {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().min(3).max(15).required(),
        lastName: joi_1.default.string().min(3).max(15).required(),
        gender: joi_1.default.string().required(),
        DOB: joi_1.default.date().required(),
        email: joi_1.default.string().email().required(),
        mobileNumber: joi_1.default.number().required(),
        password: joi_1.default
            .string()
            .min(8)
            .max(15)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
            .required()
    });
    return schema.validate(body);
}
exports.signUpValidation = signUpValidation;
function signInValidation(body) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default
            .string()
            .min(8)
            .max(15)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)
            .required(),
    });
    return schema.validate(body);
}
exports.signInValidation = signInValidation;

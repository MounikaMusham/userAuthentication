"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var signUpSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
});
var signUpSchema = mongoose_1.default.model("UserAuthentication", signUpSchema);
exports.default = signUpSchema;

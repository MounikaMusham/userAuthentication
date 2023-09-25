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
const express_1 = __importDefault(require("express"));
const authValidations_1 = require("../authentication/authValidations");
const router = express_1.default.Router();
//API for Sign up process
router.post('/userSignUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //checking validation whether required fields are coming in the body  
        const { error } = (0, authValidations_1.signUpValidation)(req.body);
        // if Validation fails throwing error
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details[0].message,
                data: {},
                response: "false",
            });
        }
    }
    catch (error) {
        //sending error based on the type of error message
        res.status(500).json({
            status: 500,
            //  message: responseMessages.someThingWrong,
            data: {},
            response: "failed",
        });
    }
}));
exports.default = router;

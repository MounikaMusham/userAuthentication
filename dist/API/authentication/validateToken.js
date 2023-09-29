"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authorizeToken(req, res, next) {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }
        const verify = jsonwebtoken_1.default.verify(token, "#MMM@vvvv@AAA@AAA#");
        req.user = verify;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
exports.default = authorizeToken;

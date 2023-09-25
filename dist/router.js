"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./API/authentication/authRouter"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const router = express_1.default.Router();
const app = (0, express_1.default)();
const swaggerJsDocs = yamljs_1.default.load('src/API/authentication/authApiDocs.yaml');
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerJsDocs));
app.use(express_1.default.json());
router.use('/app', authRouter_1.default);
exports.default = router;

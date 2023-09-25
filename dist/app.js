"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./API/config"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
mongoose_1.default.connect(config_1.default.db_url);
mongoose_1.default.connection.on("connected", () => {
    console.log('connected to database');
});
//Handling CORS error 
const corsOptions = {
    methods: 'GET,PUT,POST,DELETE',
    origin: '*'
};
app.use((0, cors_1.default)(corsOptions));
// routing to router file
app.use('/', router_1.default);
// Handling when wrong url/path entered
app.get('*', (req, res) => {
    res.send({
        status: '404',
        message: 'Url Not Found'
    });
});
exports.default = app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression = require("compression");
const helmet_1 = __importDefault(require("helmet"));
const morgan = require("morgan");
const shop_route_1 = __importDefault(require("../src/routes/shop.route"));
const admin_route_1 = __importDefault(require("../src/routes/admin.route"));
const auth_route_1 = __importDefault(require("../src/routes/auth.route"));
const user_route_1 = __importDefault(require("../src/routes/user.route"));
const bodyParser = require("body-parser");
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:4200', 'https://happyshopping-8fc5b.web.app', 'https://happyshopping-8fc5b.firebaseapp.com'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// used to compress the response
app.use(bodyParser.json());
// used to compress the response
app.use(compression());
// used to add security protection to response header
app.use((0, helmet_1.default)());
// used to log information of the request type response code etc
app.use(morgan('common'));
app.use('/shop', shop_route_1.default);
app.use('/admin', admin_route_1.default);
app.use('/auth', auth_route_1.default);
app.use('/user', user_route_1.default);
// special error handling route
app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({
        message: error.message,
    });
});
exports.default = app;

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
exports.isAdmin = exports.isAuth = void 0;
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const blacklistJWT_model_1 = require("../models/blacklistJWT.model");
const constants_1 = require("../common/constants");
const isAuth = (req, res, next) => {
    const jwtToken = req.get('Authorization');
    let decodedToken;
    if (!jwtToken) {
        const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.unauthorizedRequest);
        error.status = 401;
        return next(error);
    }
    try {
        const token = jwtToken.split(' ')[1];
        blacklistJWT_model_1.BlacklistJWT.findOne({ token })
            .then((tokenDetails) => {
            var _a;
            if (tokenDetails) {
                const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.unauthorizedRequest);
                error.status = 401;
                return next(error);
            }
            else {
                decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                req.userId = (_a = decodedToken.sub) === null || _a === void 0 ? void 0 : _a.toString();
                req.token = token;
                return next();
            }
        })
            .catch(() => {
            const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
            error.status = 401;
            return next(error);
        });
    }
    catch (_a) {
        const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.unauthorizedRequest);
        error.status = 401;
        return next(error);
    }
};
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userData = yield user_model_1.User.findById(userId);
        if (!userData || userData.role != 'admin') {
            const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.forbiddenRequest);
            error.status = 403;
            return next(error);
        }
        return next();
    }
    catch (_a) {
        const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.unauthorizedRequest);
        error.status = 401;
        return next(error);
    }
});
exports.isAdmin = isAdmin;

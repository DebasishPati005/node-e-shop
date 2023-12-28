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
exports.logoutUser = exports.resetPassword = exports.sendForgotPasswordMail = exports.signIn = exports.createUser = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const types_1 = require("../types");
const constants_1 = require("../common/constants");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blacklistJWT_model_1 = require("../models/blacklistJWT.model");
const mailingService_1 = require("../../utils/mailingService");
const emailTemplates_1 = require("../../utils/emailTemplates");
const crypto = require("crypto");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetail = req.body;
    try {
        const userData = yield user_model_1.User.findOne({ email: userDetail.email });
        if (userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.userExists);
            err.status = 422;
            return next(err);
        }
        const hashedPw = yield bcryptjs_1.default.hash(userDetail.password, constants_1.CONSTANTS.PASSWORD_SALT);
        const newUser = new user_model_1.User({
            name: userDetail.name,
            password: hashedPw,
            role: process.env.DEFAULT_USER_ROLE,
            email: userDetail.email,
            productsInCart: { totalPrice: 0, products: [] },
            productsInWishList: [],
        });
        const userResponse = yield newUser.save();
        const mailServiceInstance = mailingService_1.MailService.getMailServiceInstance();
        yield mailServiceInstance.sentMail({
            to: userResponse.email,
            subject: constants_1.RESPONSE_MESSAGE.newAccountEmailSubject,
            html: (0, emailTemplates_1.getSignUpTemplate)(userResponse.name),
        });
        return res.json(Object.assign({}, userResponse.toObject()));
    }
    catch (_a) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.createUser = createUser;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetail = req.body;
    try {
        const userData = yield user_model_1.User.findOne({ email: userDetail.email });
        if (!userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.invalidCredentials);
            err.status = 422;
            return next(err);
        }
        const doesMatch = yield bcryptjs_1.default.compare(userDetail.password, userData.password);
        if (!doesMatch) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.invalidCredentials);
            err.status = 422;
            return next(err);
        }
        const token = createJWT(userData.email, userData._id.toString());
        return res.json({ token, id: userData._id });
    }
    catch (_b) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.signIn = signIn;
const sendForgotPasswordMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const userData = yield user_model_1.User.findOne({ email });
        if (!userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.userDoesNotExists);
            err.status = 414;
            return next(err);
        }
        crypto.randomBytes(constants_1.CONSTANTS.CRYPTO_BYTE_SIZE, (err, buf) => __awaiter(void 0, void 0, void 0, function* () {
            if (!err) {
                userData.resetToken = buf.toString('hex');
                userData.resetTokenExpires = new Date(Date.now() + +process.env.RESET_TOKEN_EXPIRATION * 1000);
                yield userData.save();
                const mailServiceInstance = mailingService_1.MailService.getMailServiceInstance();
                yield mailServiceInstance.sentMail({
                    to: userData.email,
                    subject: constants_1.RESPONSE_MESSAGE.newPasswordEmailSubject,
                    html: (0, emailTemplates_1.resetPasswordTemplate)(userData.resetToken),
                });
                return res.json(Object.assign({}, userData.toObject()));
            }
        }));
    }
    catch (_c) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.sendForgotPasswordMail = sendForgotPasswordMail;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const resetToken = req.body.resetToken;
    if (password !== confirmPassword) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.badRequest);
        err.status = 417;
        return next(err);
    }
    try {
        const userData = yield user_model_1.User.findOne({ resetToken, resetTokenExpires: { $gt: new Date() } });
        if (!userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.userDoesNotExists);
            err.status = 401;
            return next(err);
        }
        const hashedPw = yield bcryptjs_1.default.hash(password, constants_1.CONSTANTS.PASSWORD_SALT);
        userData.password = hashedPw;
        userData.resetToken = undefined;
        userData.resetTokenExpires = undefined;
        yield userData.save();
        return res.json(Object.assign({}, userData.toObject()));
    }
    catch (_d) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.resetPassword = resetPassword;
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const token = req.token;
    const updateData = req.body.updateData;
    try {
        const userData = yield user_model_1.User.findById(userId);
        if (!userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.invalidCredentials);
            err.status = 422;
            return next(err);
        }
        userData.productsInCart = updateData.productsInCart;
        userData.productsInWishList = updateData.productsInWishList.map((prodId) => new mongoose_1.Types.ObjectId(prodId));
        yield userData.save();
        const blacklistJWT = new blacklistJWT_model_1.BlacklistJWT({ token, userId });
        yield blacklistJWT.save();
        return res.json(Object.assign({}, userData.toObject()));
    }
    catch (_e) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.logoutUser = logoutUser;
function createJWT(email, userId) {
    let jwtToken;
    try {
        jwtToken = jsonwebtoken_1.default.sign({ email, sub: userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
    }
    catch (err) {
        const error = new types_1.StatusError(constants_1.ERROR_MESSAGE.default + 'Failed to create JSON web token');
        error.status = 500;
        throw error;
    }
    return jwtToken;
}

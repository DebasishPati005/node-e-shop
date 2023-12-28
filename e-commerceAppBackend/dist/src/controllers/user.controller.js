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
exports.postReport = exports.downloadOrdersInvoice = exports.getOrders = exports.postOrder = exports.getUserData = void 0;
const constants_1 = require("../common/constants");
const user_model_1 = require("../models/user.model");
const types_1 = require("../types");
const order_model_1 = require("../models/order.model");
const fs = require("fs");
const generateInvoicePdf_1 = __importDefault(require("../../utils/generateInvoicePdf"));
const mailingService_1 = require("../../utils/mailingService");
const emailTemplates_1 = require("../../utils/emailTemplates");
const report_model_1 = require("../models/report.model");
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        const userData = yield user_model_1.User.findById(id).populate('productsInCart.products.productId');
        if (!userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.invalidCredentials);
            err.status = 422;
            return next(err);
        }
        const filteredCartProducts = userData.productsInCart.products.map((prod) => {
            return Object.assign({ quantity: prod.quantity }, prod.productId.toObject());
        });
        const filteredUserData = Object.assign(Object.assign({}, userData.toObject()), { productsInCart: filteredCartProducts });
        return res.json(filteredUserData);
    }
    catch (_a) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getUserData = getUserData;
const postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userData = yield user_model_1.User.findById(userId);
        if (!userData) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.invalidCredentials);
            err.status = 422;
            return next(err);
        }
        const orderData = req.body;
        const newOrder = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { userId }));
        const orderDetails = yield newOrder.save();
        const mailServiceInstance = mailingService_1.MailService.getMailServiceInstance();
        yield mailServiceInstance.sentMail({
            to: userData.email,
            subject: constants_1.RESPONSE_MESSAGE.orderPlacedEmailSubject,
            html: (0, emailTemplates_1.orderPlacedTemplate)(orderDetails._id.toString()),
        });
        return res.json(Object.assign({}, newOrder.toObject()));
    }
    catch (_b) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.postOrder = postOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const allOrders = yield order_model_1.Order.find({ userId }).populate('productsOrdered.products.productId');
        const filteredOrderedProducts = allOrders.map((orderDetail) => {
            const prodDetail = orderDetail.productsOrdered.products.map((prod) => {
                return Object.assign({ quantity: prod.quantity }, prod.productId.toObject());
            });
            return Object.assign(Object.assign({}, orderDetail.toObject()), { productsOrdered: { products: prodDetail, totalPrice: orderDetail.productsOrdered.totalPrice } });
        });
        return res.json(filteredOrderedProducts);
    }
    catch (_c) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getOrders = getOrders;
const downloadOrdersInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    try {
        const orderDetail = yield order_model_1.Order.findById(orderId).populate('productsOrdered.products.productId');
        if (!orderDetail) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.badRequest);
            err.status = 422;
            throw err;
        }
        const filteredProducts = orderDetail.productsOrdered.products.map((prod) => {
            return Object.assign({ quantity: prod.quantity }, prod.productId.toObject());
        });
        const order = Object.assign(Object.assign({}, orderDetail.toObject()), { productsOrdered: { products: filteredProducts, totalPrice: orderDetail.productsOrdered.totalPrice } });
        (0, generateInvoicePdf_1.default)(order, (invoicePath, invoiceName) => {
            fs.readFile(invoicePath, (err, data) => {
                if (err) {
                    return next(err);
                }
                res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
                res.setHeader('Content-Type', 'application/pdf');
                res.status(200).send(data);
            });
        });
    }
    catch (_d) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.downloadOrdersInvoice = downloadOrdersInvoice;
const postReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const reportRequest = Object.assign(Object.assign({}, req.body), { userId });
    try {
        const reportInstance = new report_model_1.Report(Object.assign({}, reportRequest));
        const response = yield reportInstance.save();
        return res.json(Object.assign({}, response.toObject()));
    }
    catch (_e) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.postReport = postReport;

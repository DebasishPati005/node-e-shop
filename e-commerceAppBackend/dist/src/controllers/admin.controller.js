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
exports.getAllReports = exports.editUserStatusById = exports.editProductById = exports.deleteProductById = exports.getAllOrders = exports.getAllUsers = exports.saveCategory = exports.saveNewProduct = void 0;
const types_1 = require("../types");
const product_model_1 = __importDefault(require("../models/product.model"));
const category_model_1 = require("../models/category.model");
const constants_1 = require("../common/constants");
const user_model_1 = require("../models/user.model");
const order_model_1 = require("../models/order.model");
const report_model_1 = require("../models/report.model");
const saveNewProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const productDetail = req.body;
    const newProduct = new product_model_1.default(Object.assign(Object.assign({}, productDetail), { userId }));
    try {
        const category = yield category_model_1.Category.findById(productDetail.categoryId);
        if (!category) {
            const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.badRequest);
            err.status = 422;
            return next(err);
        }
        const productResponse = yield newProduct.save();
        category.products.push(productResponse._id);
        yield category.save();
        return res.json(Object.assign({}, productResponse.toObject()));
    }
    catch (_a) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.saveNewProduct = saveNewProduct;
const saveCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryName = req.body.categoryName;
    const newCategory = new category_model_1.Category({ name: categoryName, products: [] });
    try {
        const response = yield newCategory.save();
        return res.json(Object.assign({}, response.toObject()));
    }
    catch (_b) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.saveCategory = saveCategory;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_model_1.User.find();
        return res.json(Object.assign({}, response));
    }
    catch (_c) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield order_model_1.Order.find();
        return res.json(Object.assign({}, response));
    }
    catch (_d) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getAllOrders = getAllOrders;
const deleteProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const productDetails = yield product_model_1.default.findByIdAndUpdate({ _id: productId }, { $set: { isDeleted: true } });
        return res.json(Object.assign({}, productDetails));
    }
    catch (_e) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.deleteProductById = deleteProductById;
const editProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const productDetail = req.body;
    try {
        const productDetails = yield product_model_1.default.findByIdAndUpdate({ _id: productId }, { $set: Object.assign({}, productDetail) });
        return res.json(Object.assign({}, productDetails));
    }
    catch (_f) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.editProductById = editProductById;
const editUserStatusById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const editingUserId = req.params.userId;
    const doDisable = req.body.isDisable;
    try {
        const userData = yield user_model_1.User.findByIdAndUpdate({ _id: editingUserId }, { $set: { isDisable: doDisable } });
        return res.json(Object.assign({}, userData === null || userData === void 0 ? void 0 : userData.toObject()));
    }
    catch (_g) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.editUserStatusById = editUserStatusById;
const getAllReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allReports = yield report_model_1.Report.find();
        return res.json(allReports);
    }
    catch (_h) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getAllReports = getAllReports;

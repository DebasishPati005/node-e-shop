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
exports.getProductById = exports.getAllCategories = exports.getProductsByCategory = exports.getAllProducts = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const product_model_2 = __importDefault(require("../models/product.model"));
const types_1 = require("../types");
const constants_1 = require("../common/constants");
const category_model_1 = require("../models/category.model");
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = req.query.page || constants_1.CONSTANTS.DEFAULT_PAGE;
    const selectedPrPage = req.query.perPage || constants_1.CONSTANTS.ITEMS_PER_PAGE;
    try {
        const totalDocuments = yield product_model_1.default.find({ isDeleted: { $ne: true } }).countDocuments();
        const allProducts = yield product_model_1.default.find({ isDeleted: { $ne: true } })
            .skip((+pageNumber - 1) * +selectedPrPage)
            .limit(+selectedPrPage);
        return res.json({
            products: allProducts,
            totalProducts: totalDocuments,
        });
    }
    catch (_a) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getAllProducts = getAllProducts;
const getProductsByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const categoryId = req.query.categoryId;
    const pageNumber = req.query.page || constants_1.CONSTANTS.DEFAULT_PAGE;
    const selectedPrPage = (_b = req.query.perPage) !== null && _b !== void 0 ? _b : constants_1.CONSTANTS.ITEMS_PER_PAGE;
    try {
        const totalProducts = yield product_model_1.default.find({ categoryId: categoryId !== null && categoryId !== void 0 ? categoryId : '' }).countDocuments();
        const allProducts = yield product_model_1.default.find({ categoryId: categoryId })
            .skip((+pageNumber - 1) * +selectedPrPage)
            .limit(+selectedPrPage);
        return res.json({
            products: allProducts,
            totalProducts,
        });
    }
    catch (_c) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.find();
        return res.json({
            result: categories,
        });
    }
    catch (_d) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getAllCategories = getAllCategories;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const productDetail = yield product_model_2.default.findById(productId);
        return res.json(Object.assign({}, productDetail === null || productDetail === void 0 ? void 0 : productDetail.toObject()));
    }
    catch (_e) {
        const err = new types_1.StatusError(constants_1.ERROR_MESSAGE.default);
        err.status = 500;
        next(err);
    }
});
exports.getProductById = getProductById;

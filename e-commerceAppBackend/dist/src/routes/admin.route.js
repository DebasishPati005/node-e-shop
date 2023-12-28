"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../controllers/admin.controller"));
const router = (0, express_1.Router)();
const authMiddleware = __importStar(require("../middlewares/auth-middleware"));
router.use(authMiddleware.isAuth);
router.post('/add-product', authMiddleware.isAdmin, adminController.saveNewProduct);
router.post('/add-category', authMiddleware.isAdmin, adminController.saveCategory);
router.delete('/delete-product/:productId', authMiddleware.isAdmin, adminController.deleteProductById);
router.patch('/edit-product/:productId', authMiddleware.isAdmin, adminController.editProductById);
router.patch('/edit-user-status/:userId', authMiddleware.isAdmin, adminController.editUserStatusById);
router.get('/all-users', authMiddleware.isAdmin, adminController.getAllUsers);
router.get('/all-orders', authMiddleware.isAdmin, adminController.getAllOrders);
router.get('/all-reports', authMiddleware.isAdmin, adminController.getAllReports);
exports.default = router;

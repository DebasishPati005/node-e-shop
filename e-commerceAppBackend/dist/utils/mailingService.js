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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const nodemailer_1 = require("nodemailer");
const constants_1 = require("../src/common/constants");
class MailService {
    constructor() {
        this.createConnection();
    }
    static getMailServiceInstance() {
        if (!this.instance) {
            return new MailService();
        }
        else {
            return this.instance;
        }
    }
    createConnection() {
        var _a;
        this.transporter = (0, nodemailer_1.createTransport)({
            host: process.env.GOOGLE_SES_HOST,
            port: +process.env.GOOGLE_SES_PORT,
            secure: ((_a = process.env.GOOGLE_SES_SECURE) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true',
            service: process.env.GOOGLE_SES_SERVICE,
            auth: {
                user: process.env.GOOGLE_SES_USER,
                pass: process.env.GOOGLE_SES_PASSWORD,
            },
        });
    }
    sentMail(mailConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.sendMail(Object.assign({ from: process.env.GOOGLE_SES_USER }, mailConfig));
                return {
                    message: constants_1.RESPONSE_MESSAGE.mailSendSuccessMessage,
                    sentMail: true,
                };
            }
            catch (_a) {
                return { message: constants_1.RESPONSE_MESSAGE.mailSendSuccessMessage, sentMail: true };
            }
        });
    }
}
exports.MailService = MailService;

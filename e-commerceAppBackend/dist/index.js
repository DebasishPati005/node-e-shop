"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const http = require("http");
const app_1 = __importDefault(require("./src/app"));
const MONGO_DB_URI = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@nodelearningcluster.fbds7im.mongodb.net/${process.env.DB_NAME}`;
mongoose
    .connect(MONGO_DB_URI)
    .then(() => {
    const server = http.createServer(app_1.default);
    server.listen(process.env.PORT);
    console.log('DB is Connected and app is listening');
})
    .catch((error) => {
    console.log(error);
});

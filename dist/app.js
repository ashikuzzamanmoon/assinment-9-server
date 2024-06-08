"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Routes_1 = __importDefault(require("./app/Routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middleWare/globalErrorHandler"));
const notFound_1 = require("./app/middleWare/notFound");
const app = (0, express_1.default)();
// https://travel-buddy-client-ten.vercel.app
app.use((0, cors_1.default)({
    origin: "https://travel-buddy-client-ten.vercel.app",
    credentials: true,
}));
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        Message: "Travel Buddy server is running...",
    });
});
app.use("/api", Routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(notFound_1.notFound);
exports.default = app;

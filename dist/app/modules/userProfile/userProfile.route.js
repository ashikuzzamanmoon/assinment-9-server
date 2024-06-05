"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userProfile_controller_1 = require("./userProfile.controller");
const auth_1 = __importDefault(require("../../middleWare/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), userProfile_controller_1.userProfileController.getUserProfile);
router.put("/profile", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), userProfile_controller_1.userProfileController.updateUserProfile);
exports.userProfileRoutes = router;

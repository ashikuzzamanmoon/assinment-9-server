"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleWare/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleWare/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/user/:userId", user_controller_1.userController.getUserById);
router.post("/register", (0, validateRequest_1.default)(user_validation_1.userValidation.UserCreateSchema), user_controller_1.userController.registerUser);
router.post("/create-admin", 
// auth(UserRole.ADMIN),
(0, validateRequest_1.default)(user_validation_1.userValidation.UserCreateSchema), user_controller_1.userController.createAdmin);
router.post("/login", (0, validateRequest_1.default)(user_validation_1.userValidation.UserLoginSchema), user_controller_1.userController.loginUser);
router.post("/change-password", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.changePassword);
router.patch("/update-role/:userId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.updateRole);
router.patch("/update-status/:userId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.updateStatus);
router.get("/users", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.userController.getAllUser);
exports.userRoutes = router;

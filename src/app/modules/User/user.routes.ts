import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleWare/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middleWare/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/user/:userId", userController.getUserById);
router.post(
  "/register",
  validateRequest(userValidation.UserCreateSchema),
  userController.registerUser
);
router.post(
  "/create-admin",
  // auth(UserRole.ADMIN),
  validateRequest(userValidation.UserCreateSchema),
  userController.createAdmin
);

router.post(
  "/login",
  validateRequest(userValidation.UserLoginSchema),
  userController.loginUser
);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.changePassword
);
router.patch(
  "/update-role/:userId",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.updateRole
);
router.patch(
  "/update-status/:userId",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.updateStatus
);

router.get(
  "/users",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.getAllUser
);

export const userRoutes = router;

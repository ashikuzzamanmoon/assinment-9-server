import express from "express";

import { userProfileController } from "./userProfile.controller";
import auth from "../../middleWare/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/profile",
  auth(UserRole.ADMIN, UserRole.USER),
  userProfileController.getUserProfile
);

router.put(
  "/profile",
  auth(UserRole.ADMIN, UserRole.USER),
  userProfileController.updateUserProfile
);

export const userProfileRoutes = router;

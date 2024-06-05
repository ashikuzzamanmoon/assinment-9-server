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
exports.userProfileController = void 0;
const userProfile_services_1 = require("./userProfile.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const userProfile = yield userProfile_services_1.userProfileService.getUserProfile(userId);
    if (!userProfile) {
        res.status(404).json({
            success: false,
            message: "User profile not found.",
        });
        return;
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User profile retrieved successfully",
        data: userProfile,
    });
}));
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { name, email, bio, age, userPhoto } = req.body;
    // Update the user profile
    const updatedProfile = yield userProfile_services_1.userProfileService.updateUserProfile(userId, name, email, bio, age, userPhoto);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User profile updated successfully",
        data: updatedProfile,
    });
}));
exports.userProfileController = {
    getUserProfile,
    updateUserProfile,
};

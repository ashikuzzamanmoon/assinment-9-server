import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, profile } = req.body;

    const user = await userServices.registerUser(
      name,
      email,
      password,
      profile
    );

    // Exclude password from the response
    const { password: _, ...userData } = user;

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: userData,
    });
  }
);
const createAdmin = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, profile } = req.body;
    const result = await userServices.createAdminInToDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Admin create successfully",
      data: result,
    });
  }
);

const loginUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await userServices.loginUser(email, password);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: user,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    // console.log(user);

    const result = await userServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);

const getUserById = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.params;

    const result = await userServices.getUserById(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetch successfully",
      data: result,
    });
  }
);
const getAllUser = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await userServices.getAllUser();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users fetch successfully",
      data: result,
    });
  }
);

const updateRole = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.params;
    const result = await userServices.updateRole(userId, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Role updated successfully",
      data: result,
    });
  }
);
const updateStatus = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.params;
    const result = await userServices.updateStatus(userId, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Status updated successfully",
      data: result,
    });
  }
);
export const userController = {
  registerUser,
  createAdmin,
  loginUser,
  changePassword,
  getUserById,
  getAllUser,
  updateRole,
  updateStatus,
};

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { tripServices } from "./trip.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { tripFilterAbleFields } from "./trip.constant";
import httpStatus from "http-status";

const createTrip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure req.user is defined and contains userId
    const { userId } = req.user;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
      return;
    }

    const { destination, startDate, endDate, budget, photo, type } = req.body;

    const trip = await tripServices.createTrip(
      userId,
      destination,
      startDate,
      endDate,
      budget,
      photo,
      type
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Trip created successfully",
      data: trip,
    });
  }
);

const getTripsByUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure req.user is defined and contains userId
    console.log(req.user);
    const { userId } = req.user;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
      return;
    }

    const trip = await tripServices.getTripsByUser(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Trip fetch successfully",
      data: trip,
    });
  }
);
const deleteTrip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure req.user is defined and contains userId
    // console.log(req.user);
    const { tripId } = req.params;

    const trip = await tripServices.deleteTrip(tripId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Trip deleted successfully",
      data: trip,
    });
  }
);
const updateTrip = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    const trip = await tripServices.updateTrip(tripId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Trip updated successfully",
      data: trip,
    });
  }
);
const getTripById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    const trip = await tripServices.getTripById(tripId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Trip fetched successfully",
      data: trip,
    });
  }
);

const getFilteredTrips = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, tripFilterAbleFields);

    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await tripServices.getFilteredTrips(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Trips retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const sendTravelBuddyRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;
    const { userId } = req.body;
    const request = await tripServices.sendTravelBuddyRequest(tripId, userId);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Travel buddy request sent successfully",
      data: request,
    });
  }
);

const getPotentialTravelBuddies = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { tripId } = req.params;

    const potentialBuddies = await tripServices.getPotentialTravelBuddies(
      tripId
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Potential travel buddies retrieved successfully",
      data: potentialBuddies,
    });
  }
);

const respondToTravelBuddyRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { buddyId } = req.params;
    const { status } = req.body;

    const updatedRequest = await tripServices.respondToTravelBuddyRequest(
      buddyId,
      status
    );

    if (!updatedRequest) {
      res.status(404).json({
        success: false,
        message: "Travel buddy request not found.",
      });
      return;
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Travel buddy request responded successfully",
      data: updatedRequest,
    });
  }
);
const respondToBuddyRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const updatedRequest = await tripServices.respondToBuddyRequest(
      id,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Travel buddy request responded successfully",
      data: updatedRequest,
    });
  }
);
const getAllRequestByUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.user;

    const result = await tripServices.getAllRequestByUser(userId);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Travel buddy request fetch successfully",
      data: result,
    });
  }
);

export const tripController = {
  createTrip,
  getFilteredTrips,
  sendTravelBuddyRequest,
  getPotentialTravelBuddies,
  respondToTravelBuddyRequest,
  getTripsByUser,
  deleteTrip,
  updateTrip,
  getTripById,
  getAllRequestByUser,
  respondToBuddyRequest,
};

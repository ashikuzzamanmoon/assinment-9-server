import { Prisma, PrismaClient, TravelBuddyRequest } from "@prisma/client";
import { ITripFilterRequest } from "./tripInterface";
import { IPaginationOption } from "../../Interface/pagination";
import { tripSearchAbleFields } from "./trip.constant";

const prisma = new PrismaClient();

const getTripsByUser = async (id: string) => {
  const result = await prisma.trip.findMany({
    where: {
      userId: id,
      isDeleted: false,
    },
  });
  return result;
};

const deleteTrip = async (tripId: string) => {
  const result = await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};
const updateTrip = async (tripId: string, payload: any) => {
  await prisma.trip.findUniqueOrThrow({
    where: {
      id: tripId,
      isDeleted: false,
    },
  });
  const result = await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: payload,
  });
  return result;
};
const getTripById = async (tripId: string) => {
  const result = await prisma.trip.findUniqueOrThrow({
    where: {
      id: tripId,
      isDeleted: false,
    },
    include: {
      user: {
        include: {
          userProfile: true,
        },
      },
    },
  });

  return result;
};

const createTrip = async (
  userId: string,
  destination: string,
  startDate: string,
  endDate: string,
  budget: number,
  photo: string,
  type: string,
  description: string
) => {
  const trip = await prisma.trip.create({
    data: {
      userId,
      destination,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      budget,
      photo,
      type,
      description,
    },
  });

  return trip;
};

const getFilteredTrips = async (
  params: ITripFilterRequest,
  options: IPaginationOption
) => {
  // Calculate pagination parameters
  const { page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;
  const andConditions: Prisma.TripWhereInput[] = [];
  const searchAbleFields = ["destination"];
  // console.log(params.searchTerm);
  // Search functionality
  if (params.searchTerm) {
    andConditions.push({
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filtering logic excluding searchTerm from filterData
  const {
    searchTerm,

    startDate,
    endDate,
    ...filterData
  } = params;

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const { budget } = filterData;
  // Budget range filter
  if (budget && (budget.minBudget || budget.maxBudget)) {
    andConditions.push({
      budget: {
        gte: budget.minBudget,
        lte: budget.maxBudget,
      },
    });
  }

  // Date range filter
  if (startDate || endDate) {
    andConditions.push({
      AND: [
        startDate ? { startDate: { gte: startDate } } : {},
        endDate ? { endDate: { lte: endDate } } : {},
      ],
    });
  }

  // check user deleted or not
  andConditions.push({ isDeleted: false });

  const searchInputs: Prisma.TripWhereInput = { AND: andConditions };

  const result = await prisma.trip.findMany({
    where: searchInputs,
    include: {
      user: {
        include: {
          userProfile: true,
        },
      },
    },
    skip: skip,
    take: limit,
    orderBy: {
      [options.sortBy || "createdAt"]: options.sortOrder || "desc",
    },
  });

  const total = await prisma.trip.count({
    where: searchInputs,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const sendTravelBuddyRequest = async (
  tripId: string,
  senderId: string,
  userId: string
): Promise<TravelBuddyRequest> => {
  const request = await prisma.travelBuddyRequest.create({
    data: {
      tripId,
      senderId,
      userId,
      status: "PENDING",
    },
  });

  return request;
};

const getPotentialTravelBuddies = async (
  tripId: string
): Promise<TravelBuddyRequest[]> => {
  const potentialBuddies = await prisma.travelBuddyRequest.findMany({
    where: {
      tripId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return potentialBuddies;
};

const respondToTravelBuddyRequest = async (
  buddyId: string,
  status: any
): Promise<TravelBuddyRequest | null> => {
  const updatedRequest = await prisma.travelBuddyRequest.update({
    where: {
      id: buddyId,
    },
    data: {
      status,
      updatedAt: new Date(),
    },
  });

  return updatedRequest;
};
const respondToBuddyRequest = async (
  id: string,
  payload: any
): Promise<TravelBuddyRequest | null> => {
  const updatedRequest = await prisma.travelBuddyRequest.update({
    where: {
      id: id,
    },
    data: {
      status: payload?.status,
      updatedAt: new Date(),
    },
  });

  return updatedRequest;
};

const getAllRequestByUser = async (id: string) => {
  const result = await prisma.travelBuddyRequest.findMany({
    where: {
      userId: id,
    },
    include: {
      user: {
        include: {
          userProfile: true,
        },
      },
      trip: true,
      sender: {
        include: {
          userProfile: true,
        },
      },
    },
  });
  return result;
};
const getAllSendRequestHistoryByUser = async (id: string) => {
  const result = await prisma.travelBuddyRequest.findMany({
    where: {
      senderId: id,
    },
    include: {
      user: {
        include: {
          userProfile: true,
        },
      },
      trip: true,
      sender: {
        include: {
          userProfile: true,
        },
      },
    },
  });
  return result;
};

export const tripServices = {
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
  getAllSendRequestHistoryByUser,
};

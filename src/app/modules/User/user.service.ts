import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { createToken } from "./user.utils";
import jwt from "jsonwebtoken";
import Config from "../../Config";

const prisma = new PrismaClient();

const registerUser = async (
  name: string,
  email: string,
  password: string,
  profile: any
): Promise<any> => {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("User already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (prisma) => {
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: UserRole.USER },
    });

    await prisma.userProfile.create({
      data: { userId: newUser.id, bio: profile.bio, age: profile.age },
    });

    return newUser;
  });

  //   const token = generateToken(user.id);

  return { ...user };
};

const createAdminInToDB = async (payload: any) => {
  // console.log(payload);
  // hash password
  const hashPassword = bcrypt.hashSync(payload.password, 12);
  const userData = {
    name: payload.name,
    email: payload.email,
    role: UserRole.ADMIN,
    password: hashPassword,
  };
  // use transaction for creating user and profile together
  const result = await prisma.$transaction(async (transactionClient) => {
    const createUserData = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    await transactionClient.userProfile.create({
      data: {
        ...payload.profile,
        userId: createUserData.id,
      },
    });
    const createAdminData = await transactionClient.admin.create({
      data: {
        name: payload?.name,
        email: payload?.email,
      },
    });
    return createAdminData;
  });

  return result;
};

const loginUser = async (email: string, password: string): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  const jwtPayload = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    userId: user?.id,
  };

  const token = createToken(
    jwtPayload,
    Config.jwt.jwt_secret as string,
    Config.jwt.expires_in as string
  );

  // Omitting password from user data
  const { password: _, ...userData } = user;

  return { ...userData, token };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.userId,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  const updatedData = await prisma.user.update({
    where: {
      id: userData?.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return updatedData;
};

const getUserById = async (userId: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      userProfile: true,
    },
  });
  return result;
};

const getAllUser = async () => {
  const result = await prisma.user.findMany({
    include: {
      userProfile: true,
    },
  });
  return result;
};

const updateRole = async (id: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: payload?.role,
    },
  });
  return result;
};
const updateStatus = async (id: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload?.status,
    },
  });
  return result;
};

export const userServices = {
  registerUser,
  createAdminInToDB,
  loginUser,
  changePassword,
  getUserById,
  getAllUser,
  updateRole,
  updateStatus,
};

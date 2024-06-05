import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const getUserProfile = async (
  userId: string | undefined
): Promise<TUser | null> => {
  if (!userId) {
    return null;
  }

  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return userProfile;
};

const updateUserProfile = async (
  userId: string,
  name: string,
  email: string,
  bio: string,
  age: number,
  userPhoto: string
) => {
  try {
    const result = await prisma.$transaction(async (transactionClient) => {
      const updateUserData = await transactionClient.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          email,
        },
      });
      const updatedProfile = await transactionClient.userProfile.update({
        where: {
          userId: userId,
        },
        data: {
          bio,
          age,
          userPhoto,
        },
      });
      return updatedProfile;
    });
    // const updatedProfile = await prisma.user.update({
    //   where: { id: userId },
    //   data: { name, email },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    // });
    return result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};

export const userProfileService = {
  getUserProfile,
  updateUserProfile,
};

"use server";
import { connectDB } from "@/config/dbConfig";
import UserModel from "@/models/UserModel";
import { currentUser } from "@clerk/nextjs/server";

connectDB();

export const GetCurrentUserFromMongoDB = async () => {
  try {
    const clerkUser = await currentUser();

    // check if the user is already in the database based on clerkUserId
    const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
    
    if (mongoUser) {
      return JSON.parse(JSON.stringify(mongoUser));
    }

    // if the user is not in the database, create a new user in the database
    const newUserPayload = {
      clerkUserId: clerkUser?.id,
      name: clerkUser?.username,
      phone: clerkUser?.phoneNumbers[0].phoneNumber,
      profilePicUrl: clerkUser?.imageUrl,
    };

    const newUser = await UserModel.create(newUserPayload);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const UpdateUserProfile = async (userId: string, payload: any) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
      new: true,
    });
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const GetAllUsers = async () => {
  try {
    const users = await UserModel.find({});
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
}
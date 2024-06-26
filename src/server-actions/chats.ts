"use server";
import { connectDB } from "@/config/dbConfig";
import ChatModel from "@/models/ChatModel";

connectDB();

export const CreateNewChat = async (payload: any) => {
  try {
    await ChatModel.create(payload);
    const newchats = await ChatModel.find({
      users: {
        $in: [payload.createdBy],
      },
    })
      .populate("users")
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(newchats));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const GetAllChats = async (userId: string) => {
  try {
    const users = await ChatModel.find({
      users: {
        $in: [userId],
      },
    })
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      })
      .sort({ lastMessageAt: -1 });

    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};


export const UpdateChat = async ({chatId,payload}: {chatId: string;payload: any}) => {
  try {
    await ChatModel.findByIdAndUpdate(chatId, payload);

    return {
      message: "Chat updated successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

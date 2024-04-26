'use server';

import ChatModel from "@/models/ChatModel";
import MessageModel from "@/models/MessageModel";


export const sendNewMessage = async (payload: {
    text?: string,
    image?: string,
    chat: string,
    sender: string,
}) => {
    try {
        const newMessage = new MessageModel(payload);
        await newMessage.save();
        await ChatModel.findByIdAndUpdate(payload.chat, {
            lastMessage: newMessage._id,
        });
        return {message: "Message sent successfully", data: JSON.parse(JSON.stringify(newMessage))};
    } catch (error:any) {
        return error.message;
    }
}
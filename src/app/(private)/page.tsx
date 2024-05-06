'use client';
import { Divider } from "@nextui-org/react";
import ChatArea from "./_chatComponents/chatArea";
import Chats from "./_chatComponents/chats";
import React, { useState, useEffect } from 'react';
import { ChatState, SetChats } from "@/redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetChatMessages, ReadAllMessages } from "@/server-actions/messages";
import { MessageType } from "@/interfaces";
import toast from "react-hot-toast";
import socket from "@/config/socketConfig";
import { UserState } from "@/redux/userSlice";

export default function Home() {

  const dispatch = useDispatch();
  
  const [showChatArea, setShowChatArea] = useState(false);
  const { selectedChat,chats }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const chatAreaRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<MessageType[]>([]);

  useEffect(() => {
    const breakpoint = 768;

    const handleResize = () => {
      setShowChatArea(window.innerWidth >= breakpoint);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const getMessages = async () => {
    try {
      setLoading(true);

      const response  = await GetChatMessages(selectedChat?._id!);

      if (response.error) {
        throw new Error(response.error);
      }
      setMessages(response);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getMessages();
  }, [selectedChat]);


  useEffect(() => {
    socket.on("new-message-received", (message: MessageType) => {
      if(selectedChat?._id === message.chat._id){
        setMessages((prev) => {
          const isMessageAlreadyExists: any = prev.find((msg) => msg.socketMessageId === message.socketMessageId);
          if (isMessageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    });


    // listen for user-read-all-chat-messages event
    socket.on("user-read-all-chat-messages",({ chatId, readByUserId }: { chatId: string; readByUserId: string }) => {
        if (selectedChat?._id === chatId) {
          setMessages((prev) => {
            const newMessages = prev.map((msg) => {
              if (msg.sender._id !== readByUserId && !msg.readBy.includes(readByUserId)) {
                return { ...msg, readBy: [...msg.readBy, readByUserId] };
              }
              return msg;
            });

            return newMessages;
          });
        }
    });
    
  }, [selectedChat]);


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight + 100;
    }

    // clear unread messages

    let unreadMessages = 0;
    let chat = chats.find((chat) => chat._id === selectedChat?._id);
    if (chat && chat.unreadCounts) {
      unreadMessages = chat?.unreadCounts[currentUserData?._id!] || 0;
    }

    if(unreadMessages > 0){
      ReadAllMessages({chatId: selectedChat?._id!, userId: currentUserData?._id!});

      socket.emit("read-all-messages", {
        chatId: selectedChat?._id!, 
        userId: currentUserData?._id!,
        users: selectedChat?.users.filter((user) => user._id !== currentUserData?._id!).map((user) => user._id),
      });

    }

    //set the unread messages to 0 for the selected chat
    const newChats = chats.map((chat) => {
      if(chat._id === selectedChat?._id){
        let chatData = {...chat};
        chatData.unreadCounts = {...chat.unreadCounts};
        chatData.unreadCounts[currentUserData?._id!] = 0;
        return chatData;
      }
      return chat;
    });

    dispatch(SetChats(newChats));
  }, [messages]);
  

  return (
    <div className="flex h-screen md:h-[calc(100vh-65px)] flex-col md:flex-row">
      {!showChatArea && !selectedChat && (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <Chats />
        </div>
      )}
      {!showChatArea && selectedChat && (
        <div className="overflow-y-scroll mt-[129px] mb-[65px]" ref={chatAreaRef}>
          <ChatArea />
        </div>
      )}
      {showChatArea && (
        <>
          <div className="h-full overflow-y-auto custom-scrollbar">
            <Chats />
          </div>
          <Divider orientation="vertical" className="h-full border-gray-300 px-0 mx-0" />
          <ChatArea />
        </>
      )}
    </div>
  );
}
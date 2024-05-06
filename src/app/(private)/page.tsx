'use client';
import { Divider } from "@nextui-org/react";
import ChatArea from "./_chatComponents/chatArea";
import Chats from "./_chatComponents/chats";
import React, { useState, useEffect } from 'react';
import { ChatState } from "@/redux/chatSlice";
import { useSelector } from "react-redux";

export default function Home() {
  
  const [showChatArea, setShowChatArea] = useState(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  useEffect(() => {
    const breakpoint = 768;

    const handleResize = () => {
      setShowChatArea(window.innerWidth >= breakpoint);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen md:h-[calc(100vh-65px)] flex-col md:flex-row">
      {!showChatArea && !selectedChat && (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <Chats />
        </div>
      )}
      {!showChatArea && selectedChat && (
        <ChatArea />
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
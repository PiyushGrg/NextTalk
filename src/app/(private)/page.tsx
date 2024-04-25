'use client';

import { Divider } from "@nextui-org/react";
import ChatArea from "./_chatComponents/chatArea";
import Chats from "./_chatComponents/chats";

export default async function Home() {
  
  return (
    <div className="flex h-[85vh]">
      <Chats />
      <Divider orientation="vertical" className="h-full border-gray-300" />
      <ChatArea />
    </div>
  );
}

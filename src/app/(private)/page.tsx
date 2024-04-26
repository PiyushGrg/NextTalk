'use client';

import { Divider } from "@nextui-org/react";
import ChatArea from "./_chatComponents/chatArea";
import Chats from "./_chatComponents/chats";

export default function Home() {
  
  return (
    <div className="flex h-[91vh]">
      <Chats />
      <Divider orientation="vertical" className="h-full border-gray-300 px-0 mx-0" />
      <ChatArea />
    </div>
  );
}

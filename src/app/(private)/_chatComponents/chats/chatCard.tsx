import { ChatType } from '@/interfaces'
import { ChatState, SetSelectedChat } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { Avatar } from '@nextui-org/react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function ChatCard({chat}:{chat:ChatType}) {

    const dispatch = useDispatch();

    const {currentUserData}: UserState = useSelector((state: any) => state.user);
    const {selectedChat}:ChatState = useSelector((state: any) => state.chat);

    let chatName = '';
    let chatImage = '';
    let lastMessage = '';
    let lastMessageSenderName = '';
    let lastMessageTime = '';


    if (chat.isGroupChat) {
        chatName = chat.groupName;
        chatImage = chat.groupProfilePicture;
    } else {
        const receipient = chat.users.find((user) => user._id !== currentUserData?._id);
        chatName = receipient?.name!;
        chatImage = receipient?.profilePicUrl!;
    }

    const isSelected = selectedChat?._id === chat._id;

  return (
    <div className={`flex justify-between py-3 cursor-pointer px-2 rounded
        ${isSelected ? "bg-primary-dark/40" : "hover:bg-primary-default/60"}`}
        onClick={() => {
            dispatch(SetSelectedChat(chat));
        }}
    >
        <div className='flex gap-5 items-center'>
            <Avatar src={chatImage} alt="" className='w-10 h-10 rounded-full'/>
            <span className='capitalize text-gray-700 text-sm'>{chatName}</span>
        </div>

        <div>
            <span>{lastMessageTime}</span>
        </div>
    </div>
  )
}

export default ChatCard
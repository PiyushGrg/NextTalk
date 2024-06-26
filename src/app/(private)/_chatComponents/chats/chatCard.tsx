import { formatDateTime } from '@/helpers/DateFormat';
import { ChatType } from '@/interfaces'
import { ChatState, SetSelectedChat } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { Avatar } from '@nextui-org/react';
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function ChatCard({chat}:{chat:ChatType}) {

    const dispatch = useDispatch();

    const {currentUserData,onlineUsers}: UserState = useSelector((state: any) => state.user);
    const {selectedChat}:ChatState = useSelector((state: any) => state.chat);
    const chatCardRef = useRef<HTMLDivElement>(null);

    let chatName = '';
    let chatImage = '';
    let lastMessage = '';
    let lastMessageSenderName = '';
    let lastMessageTime = '';


    if (chat.isGroupChat) {
        chatName = chat.groupName;
        chatImage = chat.groupProfilePicture || "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZlhiQnlkbWFSZVRqakJSbm1iUnBKdUlaY2UiLCJyaWQiOiJ1c2VyXzJmYVd4VTFoR1ZmNFIyRHc4WkRLTWVDNkFhVCJ9";
    } else {
        const receipient = chat.users.find((user) => user._id !== currentUserData?._id);
        chatName = receipient?.name!;
        chatImage = receipient?.profilePicUrl!;
    }


    if(chat?.lastMessage){
        lastMessageSenderName = chat?.lastMessage?.sender?._id === currentUserData?._id! ? 'You :' : `${chat?.lastMessage?.sender?.name} :`;
        lastMessageTime = formatDateTime(chat.lastMessage?.createdAt);

        if(chat?.lastMessage?.text){
            lastMessage = chat.lastMessage.text.length > 15 ? chat.lastMessage.text.substring(0, 15) + '...' : chat.lastMessage.text;
        }
        if(chat?.lastMessage?.image){
            lastMessage = 'Sent a photo';
        }
        if(chat?.lastMessage?.file){
            lastMessage = 'Sent a file';
        }
        if(chat?.lastMessage?.gifUrl){
            lastMessage = 'Sent a gif';
        }
    }

    const isSelected = selectedChat?._id === chat._id;

    const unreadCount = () => {
        if(!chat?.unreadCounts || !chat?.unreadCounts[currentUserData?._id!] || chat._id === selectedChat?._id){
            return null;
        }

        return <div className='bg-rose-600 h-5 w-5 rounded-full flex justify-center items-center'>
            <span className='text-white text-xs'>{chat.unreadCounts[currentUserData?._id!]}</span>
        </div>
    }

    const onlineIndicator = () => {
        if(chat.isGroupChat){
            return null;
        }

        const recipientId = chat.users.find((user) => user._id !== currentUserData?._id)?._id;
        if (onlineUsers.includes(recipientId!)) {
            return <div className="w-2 h-2 rounded-full bg-green-600"></div>;
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const isUserClicked = (event.target as HTMLElement).classList.contains('person');
        if (isUserClicked || event.target === chatCardRef.current) {
          dispatch(SetSelectedChat(chat));
        }
    };

  return (
    <div className={`flex justify-between py-3 cursor-pointer px-2 rounded
        ${isSelected ? "bg-primary-dark/40" : "hover:bg-primary-default/60"}`}
        ref={chatCardRef} onClick={handleClick}
    >
        <div className='flex gap-5 items-center'>
            <Avatar src={chatImage} alt="" className='w-10 h-10 rounded-full'/>
            <div className='flex flex-col gap-1'>
                <span className='capitalize text-gray-700 text-sm flex gap-2 items-center person'>{chatName} {onlineIndicator()}</span>
                <span className='capitalize text-gray-500 text-xs person'>{lastMessageSenderName} {lastMessage}</span>
            </div>
        </div>

        <div>
            {unreadCount()}
            <span className='text-xs text-gray-500'>{lastMessageTime}</span>
        </div>
    </div>
  )
}

export default ChatCard
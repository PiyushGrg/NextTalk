import { MessageType } from '@/interfaces'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import { Image } from '@nextui-org/react';
import { formatDateTime } from '@/helpers/DateFormat';

function Message({message}: {message: MessageType}) {

    const {selectedChat}: ChatState = useSelector((state: any) => state.chat);
    const {currentUserData}:UserState = useSelector((state: any) => state.user);

    const isLoggedInUserMessage = message.sender._id === currentUserData?._id!;

    if(isLoggedInUserMessage) {
        return (
            <div className='flex justify-end gap-2'>
                <div className='flex flex-col gap-1'>
                    <p className='bg-secondary text-white py-2 px-3 rounded-lg rounded-tr-none'>
                        {message.text}
                    </p>
                    <span className='text-gray-500 text-xs'>
                        {formatDateTime(message.createdAt)}
                    </span>
                </div>

                <Image src={message.sender.profilePicUrl} className='h-9 w-8 rounded-full' alt='avatar' />
            </div>
        )
    } else {
        return (
            <div className='flex gap-2'>
                <Image src={message.sender.profilePicUrl} className='h-9 w-8 rounded-full' alt='avatar' />

                <div className='flex flex-col gap-1'>
                    <div className='bg-gray-200/75 rounded-lg rounded-tl-none px-3 flex flex-col py-1'>
                        <span className='text-secondary capitalize text-xs font-semibold'>{message.sender.name}</span>
                        <p>
                            {message.text}
                        </p>
                    </div>
                    <span className='text-gray-500 text-xs'>
                        {formatDateTime(message.createdAt)}
                    </span>
                </div>
            </div>
        )
    }
}

export default Message
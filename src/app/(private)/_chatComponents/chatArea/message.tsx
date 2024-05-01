import { MessageType } from '@/interfaces'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import { Image } from '@nextui-org/react';
import { formatDateTime } from '@/helpers/DateFormat';
import toast from 'react-hot-toast';

function Message({message}: {message: MessageType}) {

    const {selectedChat}: ChatState = useSelector((state: any) => state.chat);
    const {currentUserData}:UserState = useSelector((state: any) => state.user);

    const isLoggedInUserMessage = message.sender._id === currentUserData?._id!;

    let read = false;
    if (selectedChat && selectedChat?.users?.length - 1 === message.readBy.length) {
        read = true;
    }

    const downloadImage = async (imageUrl:string) => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
      
          const a = document.createElement('a');
          a.href = url;
          a.download = `image_${Date.now()}.jpg`; // Set the desired file name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          toast.error('Failed to download image');
        }
    };

    if(isLoggedInUserMessage) {
        return (
            <div className='flex justify-end gap-2'>
                <div className='flex flex-col gap-1'>
                    {message.image && (
                        <Image src={message.image} className='h-40 w-40 rounded-lg rounded-tr-none' alt='message-image' />
                    )}

                    {message.file && (
                        <a href={message.file} target="_blank" rel="noopener noreferrer" className='text-rose-600'>
                            <div className='flex gap-1'>
                                <i className="ri-file-line"></i>
                                View File
                            </div>
                        </a>   
                    )}

                    {message.gifUrl && (
                        <Image src={message.gifUrl} className='h-40 w-50 rounded-lg rounded-tr-none' alt='message-gif' />
                    )}

                    {message.text && (
                        <p className='bg-secondary text-white py-2 px-3 rounded-lg rounded-tr-none'>
                            {message.text}
                        </p>
                    )}
                    <div className='flex flex-row justify-between'>
                        <span className='text-gray-500 text-xs'>
                            {formatDateTime(message.createdAt)}
                        </span>
                        <i className={`ri-check-double-line ${read ? "text-blue-600" : "text-gray-400"}`}></i>
                    </div>
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
                        {message.image && (
                            <Image src={message.image} className='h-40 w-40 rounded-lg rounded-tl-none cursor-pointer' alt='message-image' 
                                onClick={() => downloadImage(message.image)}
                            />
                        )}

                        {message.file && (
                            <a href={message.file} target="_blank" rel="noopener noreferrer" className='text-rose-600'>
                                <div className='flex gap-1'>
                                    <i className="ri-file-line"></i>
                                    View File
                                </div>
                            </a>   
                        )}

                        {message.gifUrl && (
                            <Image src={message.gifUrl} className='h-40 w-50 rounded-lg rounded-tl-none' alt='message-gif' />
                        )}

                        {message.text && (
                            <p>
                                {message.text}
                            </p>
                        )}
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
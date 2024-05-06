import { ChatState, SetSelectedChat } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { Avatar, Image } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RecipientInfo from './recipientInfo'
import socket from '@/config/socketConfig'
import { ChatType } from '@/interfaces'

function Recipient() {

    const dispatch = useDispatch();

    const [showRecipientInfo, setShowRecipientInfo] = React.useState<boolean>(false);
    const [typing, setTyping] = React.useState<boolean>(false);
    const [senderName, setSenderName] = React.useState<string>("");

    const {selectedChat}: ChatState = useSelector((state: any) => state.chat)
    const {currentUserData}: UserState = useSelector((state: any) => state.user)

    let chatName = '';
    let chatImage = '';

    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName;
        chatImage = selectedChat.groupProfilePicture || "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZlhiQnlkbWFSZVRqakJSbm1iUnBKdUlaY2UiLCJyaWQiOiJ1c2VyXzJmYVd4VTFoR1ZmNFIyRHc4WkRLTWVDNkFhVCJ9";
    } else {
        const receipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id);
        chatName = receipient?.name!;
        chatImage = receipient?.profilePicUrl!;
    }

    const typingAnimation = () => {
        if(typing){
            return <span className='text-rose-500 font-semibold text-xs capitalize'>{selectedChat?.isGroupChat ? `${senderName} is typing...` : "Typing..."}</span>
        }
    }

    useEffect(() => {
        socket.on("typing",({ chat, senderName }: { chat: ChatType; senderName: string }) => {
            if (selectedChat?._id === chat._id) {
              setTyping(true);
              if (chat.isGroupChat) {
                setSenderName(senderName);
              }
            }
    
            setTimeout(() => {
              setTyping(false);
            }, 2000);
          }
        );
    
        return () => {
          socket.off("typing");
        };
    }, [selectedChat]);

  return (
    <div className='flex justify-between bg-gray-100 px-4 py-3 border-b border-gray-400 border-solid' id='recipient'>
        <div className='flex items-center gap-3'>
            <Image src='/back.svg' className='w-[15px] h-[15px] cursor-pointer' onClick={()=>{dispatch(SetSelectedChat(null))}}/>
            <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={()=>setShowRecipientInfo(true)}>
                <Avatar src={chatImage} alt='' className='w-10 h-10 rounded-full' />
                <div className='flex flex-col gap-1'>
                    <span className='text-gray-800 text-sm capitalize'>{chatName}</span>
                    {typingAnimation()}
                </div>
            </div>
        </div>

        {showRecipientInfo && (
            <RecipientInfo showRecipientInfo={showRecipientInfo} setShowRecipientInfo={setShowRecipientInfo} />
        )}
    </div>
  )
}

export default Recipient
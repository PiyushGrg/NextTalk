import { ChatState, SetSelectedChat } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { Avatar, Image } from '@nextui-org/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RecipientInfo from './recipientInfo'

function Recipient() {

    const dispatch = useDispatch();

    const [showRecipientInfo, setShowRecipientInfo] = React.useState<boolean>(false);

    const {selectedChat}: ChatState = useSelector((state: any) => state.chat)
    const {currentUserData}: UserState = useSelector((state: any) => state.user)

    let chatName = '';
    let chatImage = '';

    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName;
        chatImage = selectedChat.groupProfilePicture;
    } else {
        const receipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id);
        chatName = receipient?.name!;
        chatImage = receipient?.profilePicUrl!;
    }

  return (
    <div className='flex justify-between bg-gray-100 px-4 py-3 border-b border-gray-400 border-solid'>
        <div className='flex items-center gap-3'>
            <Image src='/back.svg' className='w-[15px] h-[15px] cursor-pointer' onClick={()=>{dispatch(SetSelectedChat(null))}}/>
            <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={()=>setShowRecipientInfo(true)}>
                <Avatar src={chatImage} alt='' className='w-10 h-10 rounded-full' />
                <span className='text-gray-800 text-sm capitalize'>{chatName}</span>
            </div>
        </div>

        {showRecipientInfo && (
            <RecipientInfo showRecipientInfo={showRecipientInfo} setShowRecipientInfo={setShowRecipientInfo} />
        )}
    </div>
  )
}

export default Recipient
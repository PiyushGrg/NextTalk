import React from 'react'
import Recipient from './recipient'
import { ChatState } from '@/redux/chatSlice'
import { useSelector } from 'react-redux'
import { Image } from '@nextui-org/react'
import Messages from './messages'
import NewMessage from './newMessage'

function ChatArea() {

  const {selectedChat}: ChatState = useSelector((state: any) => state.chat)

  if(!selectedChat){
    return (
      <div className='flex flex-1 flex-col justify-center items-center h-full'>
        <Image src='/chatlogo.jpg' alt='' className='h-60' />
        <span className='font-semibold text-gray-600 text-sm'>
          Select a chat to start messaging..
        </span>
      </div>
    )
  }

  return (
    selectedChat && (
      <div className='flex-1 flex flex-col justify-between'>
        <Recipient />
        <Messages />
        <NewMessage />
      </div>
    )
  )
}

export default ChatArea
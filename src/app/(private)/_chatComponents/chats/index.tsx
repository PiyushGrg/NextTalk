import React from 'react'
import ChatsHeader from './chatsHeader'
import ChatsList from './chatsList'

function Chats() {
  return (
    <div className='w-full md:w-[325px] lg:w-[400px] h-full p-3'>
        <ChatsHeader />
        <ChatsList />
    </div>
  )
}

export default Chats
import socket from '@/config/socketConfig';
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { sendNewMessage } from '@/server-actions/messages';
import { Button, Image, image } from '@nextui-org/react'
import { Input } from 'antd'
import dayjs from 'dayjs';
import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function NewMessage() {

  const [text, setText] = React.useState('');

  const {currentUserData}: UserState = useSelector((state: any) => state.user);
  const {selectedChat}: ChatState = useSelector((state: any) => state.chat);

  const onSend = async () => {
    try {
      if(!text){
        return;
      }
      
      const socketPayload = {
        text,
        image: '',
        socketMessageId: dayjs().unix(),
        sender: currentUserData,
        chat: selectedChat
      };

      socket.emit("send-new-message",socketPayload);

      const dbPayload = {
        text,
        image: '',
        socketMessageId: dayjs().unix(),
        sender: currentUserData?._id!,
        chat: selectedChat?._id!
      };

      sendNewMessage(dbPayload);

      // console.log(response.data);
      setText('');

    } catch (error:any) {
      toast.error(error.message);
    }
  };


  return (
    <div className='p-3 bg-gray-100 border-t border-solid border-gray-400 flex gap-5 items-center'>
      <div>
        {/* Emoji */}
      </div>

      <div className='flex-1'>
        <Input placeholder='Type a message' 
          className='w-full h-[50px] px-3 border border-solid border-gray-300 outline-none focus:outline-none focus:border-secondary'
          value={text}
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              onSend();
            }
          }}
        />
      </div>

      <Button onClick={onSend} variant='bordered' size='lg' color='secondary'>
        <Image src='/send.svg' alt='' className='h-[20px] w-[20px]' />
      </Button>
      
    </div>
  )
}

export default NewMessage
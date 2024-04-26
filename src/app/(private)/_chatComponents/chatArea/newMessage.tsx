import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { sendNewMessage } from '@/server-actions/messages';
import { Image } from '@nextui-org/react'
import { Input } from 'antd'
import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function NewMessage() {

  const [text, setText] = React.useState('');

  const {currentUserData}: UserState = useSelector((state: any) => state.user);
  const {selectedChat}: ChatState = useSelector((state: any) => state.chat);

  const onSend = async () => {
    try {
      const dbPayload = {
        text,
        image: '',
        sender: currentUserData?._id!,
        chat: selectedChat?._id!
      };

      const response = await sendNewMessage(dbPayload);

      if(response.error) {
        throw new Error(response.error);
      }

      console.log(response.data);
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
          className='w-full h-[45px] px-3 border border-solid border-gray-300 outline-none focus:outline-none focus:border-secondary'
          value={text}
          onChange={(e) => setText(e.target.value)} 
        />
      </div>

      <Image src='/send.svg' alt='' className='h-[22px] w-[22px]' onClick={onSend} />
      
    </div>
  )
}

export default NewMessage
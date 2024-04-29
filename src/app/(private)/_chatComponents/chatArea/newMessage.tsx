import socket from '@/config/socketConfig';
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { sendNewMessage } from '@/server-actions/messages';
import { Image } from '@nextui-org/react';
import { Input,Button } from 'antd'
import dayjs from 'dayjs';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ImageSelector from './imageSelector';
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/ImageUpload';

function NewMessage() {

  const [text, setText] = React.useState('');

  const {currentUserData}: UserState = useSelector((state: any) => state.user);
  const {selectedChat}: ChatState = useSelector((state: any) => state.chat);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);
  const [showImageSelector, setShowImageSelector] = React.useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSend = async () => {
    try {
      if(!text && !selectedImageFile){
        return;
      }

      setLoading(true);

      let image = "";
      if (selectedImageFile) {
        image = await UploadImageToFirebaseAndReturnUrl(selectedImageFile);
      }
      
      const socketPayload = {
        text,
        image,
        socketMessageId: dayjs().unix(),
        sender: currentUserData,
        chat: selectedChat,
        readBy: [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      };

      socket.emit("send-new-message",socketPayload);

      const dbPayload = {
        text,
        image,
        socketMessageId: dayjs().unix(),
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
        readBy: [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      };

      sendNewMessage(dbPayload);

      // console.log(response.data);
      setText('');
      setShowEmojiPicker(false);
      setSelectedImageFile(null);
      setShowImageSelector(false);
    } catch (error:any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    setText('');
  },[selectedChat])

  useEffect(()=> {
      socket.emit("typing", {chat: selectedChat, senderId: currentUserData?._id!, senderName: currentUserData?.name});
  },[selectedChat,text]);


  return (
    <div className='p-3 bg-gray-100 border-t border-solid border-gray-400 flex gap-5 items-center relative'>
      <div className='flex gap-3'>
          {showEmojiPicker && 
            <div className='absolute left-14 bottom-20'>
              <EmojiPicker
                height={400}
                onEmojiClick={(emojiObject: any) => {
                  setText((prevText) => prevText + emojiObject.emoji);
                  inputRef.current?.focus();
                }}
              />
            </div>
          }

        {/* Image Selector */}
        <Button className="border border-solid border-secondary bg-white" onClick={() => setShowImageSelector(!showImageSelector)}>
          <i className="ri-folder-image-line"></i>
        </Button>

        {/* Emoji Picker */}
        <Button className='border border-solid border-secondary bg-white' onClick={()=>setShowEmojiPicker(!showEmojiPicker)}>
          {!showEmojiPicker ? (
            <i className="ri-emoji-sticker-line"></i>
          ) : (
            <i className="ri-keyboard-line"></i>
          )}
        </Button>
      </div>

      <div className='flex-1'>
        <input placeholder='Type a message' 
          className='w-full h-[50px] px-3 border border-solid border-gray-300 outline-none focus:outline-none focus:border-secondary'
          value={text}
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              onSend();
            }
          }}
          ref={inputRef}
        />
      </div>

      <Button onClick={onSend} className='border border-solid border-secondary bg-white' size='large'>
        <Image src='/send.svg' alt='' className='h-[20px] w-[20px]' />
      </Button>
      
      {showImageSelector && (
        <ImageSelector
          setShowImageSelector={setShowImageSelector}
          showImageSelector={showImageSelector}
          setSelectedImageFile={setSelectedImageFile}
          selectedImageFile={selectedImageFile}
          onSend={onSend}
          loading={loading}
        />
      )}
    </div>
  )
}

export default NewMessage
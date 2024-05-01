import socket from '@/config/socketConfig';
import { ChatState } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { sendNewMessage } from '@/server-actions/messages';
import { Image } from '@nextui-org/react';
import { Input,Button } from 'antd'
import dayjs from 'dayjs';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ImageSelector from './imageSelector';
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/ImageUpload';

function NewMessage() {

  const [text, setText] = React.useState('');
  const [gifUrl, setGifUrl] = React.useState('');

  const {currentUserData}: UserState = useSelector((state: any) => state.user);
  const {selectedChat}: ChatState = useSelector((state: any) => state.chat);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false);
  const [showGifPicker, setShowGifPicker] = React.useState<boolean>(false);
  const [showImageSelector, setShowImageSelector] = React.useState<boolean>(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSend = async () => {
    try {
      if(!text && !selectedImageFile && !selectedPdfFile && !gifUrl){
        return;
      }

      setLoading(true);

      let image = "";
      if (selectedImageFile) {
        image = await UploadImageToFirebaseAndReturnUrl(selectedImageFile);
      }

      let file = "";
      if (selectedPdfFile) {
        file = await UploadImageToFirebaseAndReturnUrl(selectedPdfFile);
      }
      
      const socketPayload = {
        text,
        image,
        file,
        gifUrl,
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
        file,
        gifUrl,
        socketMessageId: dayjs().unix(),
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
        readBy: [],
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      };

      await sendNewMessage(dbPayload);

      // console.log(response.data);
      setText('');
      setGifUrl('');
      setShowEmojiPicker(false);
      setShowGifPicker(false);
      setSelectedImageFile(null);
      setSelectedPdfFile(null);
      setShowImageSelector(false);
    } catch (error:any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    setText('');
    setGifUrl('');
    setShowEmojiPicker(false);
    setShowGifPicker(false);
    setSelectedImageFile(null);
    setSelectedPdfFile(null);
    setShowImageSelector(false);
  },[selectedChat])

  useEffect(()=> {
      socket.emit("typing", {chat: selectedChat, senderId: currentUserData?._id!, senderName: currentUserData?.name});
  },[selectedChat,text,gifUrl]);


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

          {showGifPicker && 
            <div className='absolute left-14 bottom-20'>
              <GifPicker
                tenorApiKey='AIzaSyDtW2rt98gchBHm9n2ifG30Beku0AiBq3E'
                height={400}
                onGifClick={(gifObject: any) => {
                  setGifUrl(gifObject.url);
                  setShowGifPicker(false);
                  inputRef.current?.focus();
                }}
              />
            </div>
          }

        {/* Image Selector */}
        <Button className="border border-solid border-secondary bg-white" onClick={() => {
          setShowImageSelector(!showImageSelector);
          setShowEmojiPicker(false);
          setShowGifPicker(false);
        }}>
          <i className="ri-folder-image-line"></i>
        </Button>

        {/* Emoji Picker */}
        <Button className='border border-solid border-secondary bg-white' onClick={()=>{
          setShowEmojiPicker(!showEmojiPicker);
          setShowGifPicker(false);
        }}>
          {!showEmojiPicker ? (
            <i className="ri-emoji-sticker-line"></i>
          ) : (
            <i className="ri-keyboard-line"></i>
          )}
        </Button>

        {/* Gif Picker */}
        <Button className='border border-solid border-secondary bg-white' onClick={()=>{
          setShowGifPicker(!showGifPicker);
          setShowEmojiPicker(false);
        }}>
          {!showGifPicker ? (
            <i className="ri-file-gif-line"></i>
          ) : (
            <i className="ri-keyboard-line"></i>
          )}
        </Button>

      </div>

      <div className='flex-1'>
        {!gifUrl && (
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
        )}
        {gifUrl && 
          <div className="flex items-center justify-between">
            <Image src={gifUrl} alt="" className="w-full h-[50px]" />
            <Button
              className="border border-solid border-secondary bg-white ml-2"
              onClick={() => setGifUrl("")}
            >
              <Image src='/close.svg' alt='' className='h-[20px] w-[20px]' />
            </Button>
          </div>
        }
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
          selectedPdfFile={selectedPdfFile}
          setSelectedPdfFile={setSelectedPdfFile}
          onSend={onSend}
          loading={loading}
        />
      )}
    </div>
  )
}

export default NewMessage
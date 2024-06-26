import { MessageType } from '@/interfaces';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { GetChatMessages, ReadAllMessages } from '@/server-actions/messages';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Message from './message';
import { UserState } from '@/redux/userSlice';
import socket from '@/config/socketConfig';

function Messages() {

  const dispatch = useDispatch();

  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const {selectedChat, chats}: ChatState =  useSelector((state: any) => state.chat);
  const {currentUserData}: UserState = useSelector((state: any) => state.user);

  const messagesDivRef = React.useRef<HTMLDivElement>(null);

  const getMessages = async () => {
    try {
      setLoading(true);

      const response  = await GetChatMessages(selectedChat?._id!);

      if (response.error) {
        throw new Error(response.error);
      }
      setMessages(response);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    socket.on("new-message-received", (message: MessageType) => {
      if(selectedChat?._id === message.chat._id){
        setMessages((prev) => {
          const isMessageAlreadyExists: any = prev.find((msg) => msg.socketMessageId === message.socketMessageId);
          if (isMessageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    });


    // listen for user-read-all-chat-messages event
    socket.on("user-read-all-chat-messages",({ chatId, readByUserId }: { chatId: string; readByUserId: string }) => {
        if (selectedChat?._id === chatId) {
          setMessages((prev) => {
            const newMessages = prev.map((msg) => {
              if (msg.sender._id !== readByUserId && !msg.readBy.includes(readByUserId)) {
                return { ...msg, readBy: [...msg.readBy, readByUserId] };
              }
              return msg;
            });

            return newMessages;
          });
        }
    });
    
  }, [selectedChat]);


  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight + 100;
    }

    // clear unread messages

    let unreadMessages = 0;
    let chat = chats.find((chat) => chat._id === selectedChat?._id);
    if (chat && chat.unreadCounts) {
      unreadMessages = chat?.unreadCounts[currentUserData?._id!] || 0;
    }

    if(unreadMessages > 0){
      ReadAllMessages({chatId: selectedChat?._id!, userId: currentUserData?._id!});

      socket.emit("read-all-messages", {
        chatId: selectedChat?._id!, 
        userId: currentUserData?._id!,
        users: selectedChat?.users.filter((user) => user._id !== currentUserData?._id!).map((user) => user._id),
      });

    }

    //set the unread messages to 0 for the selected chat
    const newChats = chats.map((chat) => {
      if(chat._id === selectedChat?._id){
        let chatData = {...chat};
        chatData.unreadCounts = {...chat.unreadCounts};
        chatData.unreadCounts[currentUserData?._id!] = 0;
        return chatData;
      }
      return chat;
    });

    dispatch(SetChats(newChats));
  }, [messages]);

  return (
    <div className='flex-1 p-3 md:overflow-y-scroll' ref={messagesDivRef}>
      <div className='flex flex-col gap-3'>
        {messages.map((message: MessageType) => {
          return <Message key={message._id} message={message} />;
        })}  
      </div>
    </div>
  )
}

export default Messages
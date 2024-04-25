'use client';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { GetAllChats } from '@/server-actions/chats';
import { Spinner } from '@nextui-org/react';
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ChatCard from './chatCard';

function ChatsList() {

  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { chats, selectedChat }: ChatState = useSelector((state: any) => state.chat);

  const [loading, setLoading] = React.useState(false);

  const getChats = async () => {
    try {
      setLoading(true);

      const response = await GetAllChats(currentUserData?._id!);
      if (response.error) throw new Error(response.error);

      dispatch(SetChats(response));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if(currentUserData){
      getChats();
    }
  }, [currentUserData]);

  return (
    <div>
      {chats.length > 0 && (
        <div className="flex flex-col gap-5 mt-5">
          {chats.map((chat) => {
            return <ChatCard chat={chat} key={chat._id} />;
          })}
        </div>
      )}

      {loading && (
        <div className="flex mt-32 items-center justify-center">
          <div className="flex flex-col">
            <Spinner color='secondary'/>
            <span className="text-gray-500 text-sm my-5">Loading chats...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatsList
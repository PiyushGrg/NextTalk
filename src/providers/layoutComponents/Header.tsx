"use client";
import { GetCurrentUserFromMongoDB } from '@/server-actions/users';
import { Avatar } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import CurrentUserInfo from './CurrentUserInfo';
import { UserType } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentUser, SetOnlineUsers, UserState } from '@/redux/userSlice';
import socket from '@/config/socketConfig';

function Header() {

    const pathname = usePathname();
  
    const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");

    const dispatch = useDispatch();
    
    const {currentUserData} : UserState = useSelector((state: any) => state.user);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);

    const getCurrentUser = async () => {
        try {
          const response = await GetCurrentUserFromMongoDB();
            if (response.error) {
                return;
            }
            dispatch(SetCurrentUser(response as UserType));
        } catch (error: any) {
          toast.error(error.message);
        }
    };
    
    useEffect(() => {
        getCurrentUser();
    }, []);


    useEffect(() => {
      if(currentUserData){
        socket.emit('join', currentUserData._id);

        socket.on("online-users-updated", (onlineUsers: string[]) => {
          dispatch(SetOnlineUsers(onlineUsers));
        });
      }
    },[currentUserData]);

    if (isPublicRoute){
      return null;
    }

  return (
    currentUserData && 
      <div className='bg-primary-dark w-full px-3 py-3 flex justify-between items-center border-0 border-b border-solid border-gray-300'>
        <div>
            <h1 className='text-2xl text-secondary font-semibold uppercase'>Next Talk</h1>
        </div>

        <div className='flex gap-5 items-center'>
            <span className='text-sm capitalize text-secondary'>{currentUserData?.name}</span>
            <Avatar src={currentUserData?.profilePicUrl} alt='profile picture' 
                className='rounded-full cursor-pointer' 
                onClick={() => setShowCurrentUserInfo(true)}    
            />
        </div>

        {showCurrentUserInfo && (
          <CurrentUserInfo
            setShowCurrentUserInfo={setShowCurrentUserInfo}
            showCurrentUserInfo={showCurrentUserInfo}
          />
        )}
      </div>
  )
}

export default Header
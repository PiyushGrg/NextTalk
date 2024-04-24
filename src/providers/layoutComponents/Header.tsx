import { GetCurrentUserFromMongoDB } from '@/server-actions/users';
import { Avatar } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import CurrentUserInfo from './CurrentUserInfo';
import { UserType } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentUser, UserState } from '@/redux/userSlice';

function Header() {

    const pathname = usePathname();
  
    const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");
  
    if (isPublicRoute){
        return null;
    }

    const dispatch = useDispatch();
    
    const {currentUserData} : UserState = useSelector((state: any) => state.user);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);

    const getCurrentUser = async () => {
        try {
          const response = await GetCurrentUserFromMongoDB();
            if (response.error) {
                return toast.error(response.error);
            }
            dispatch(SetCurrentUser(response as UserType));
        } catch (error: any) {
          toast.error(error.message);
        }
    };
    
    useEffect(() => {
        getCurrentUser();
    }, []);

  return (
    <div className='bg-primary w-full px-3 py-1 flex justify-between items-center border-0 border-b border-solid border-gray-300'>
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
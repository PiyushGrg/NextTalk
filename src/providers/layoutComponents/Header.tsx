import { GetCurrentUserFromMongoDB } from '@/server-actions/users';
import { Avatar } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import CurrentUserInfo from './CurrentUserInfo';
import { UserType } from '@/interfaces';

function Header() {

    const pathname = usePathname();
  
    const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");
  
    if (isPublicRoute){
        return null;
    }

    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false);

    const getCurrentUser = async () => {
        try {
          const response = await GetCurrentUserFromMongoDB();
            if (response.error) {
                return toast.error(response.error);
            }
            setCurrentUser(response);
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
            <span className='text-sm capitalize text-secondary'>{currentUser?.name}</span>
            <Avatar src={currentUser?.profilePicUrl} alt='profile picture' 
                className='rounded-full cursor-pointer' 
                onClick={() => setShowCurrentUserInfo(true)}    
            />
        </div>

        {showCurrentUserInfo && (
          <CurrentUserInfo
            currentUserInfo={currentUser}
            setShowCurrentUserInfo={setShowCurrentUserInfo}
            showCurrentUserInfo={showCurrentUserInfo}
          />
        )}
    </div>
  )
}

export default Header
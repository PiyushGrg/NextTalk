"use client";
import { UserType } from '@/interfaces';
import { ChatState, SetChats } from '@/redux/chatSlice';
import { UserState } from '@/redux/userSlice';
import { CreateNewChat } from '@/server-actions/chats';
import { GetAllUsers } from '@/server-actions/users';
import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

interface NewChatModalProps {
  showNewChatModal: boolean;
  setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewChatModal({showNewChatModal,setShowNewChatModal}: NewChatModalProps) {

    const router = useRouter();
    const dispatch = useDispatch();

    const [users,setUsers] = useState<UserType[]>([]);
    const [loading,setLoading] = useState(false);
    const [selectedUserId,setSelectedUserId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    const {currentUserData}: UserState = useSelector((state: any) => state.user);
    const {chats}: ChatState = useSelector((state: any) => state.chat);

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await GetAllUsers(searchText);
            if (response.error) throw new Error("No users found");
            // console.log(response);
            setUsers(response);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onAddToChat = async (userId: string) => {
        try {
            setSelectedUserId(userId);
            setLoading(true);

            const response = await CreateNewChat({
                createdBy: currentUserData?._id,
                users: [userId, currentUserData?._id],
            });

            if (response.error) throw new Error(response.error);

            toast.success("Chat created successfully");
            dispatch(SetChats(response));
            setShowNewChatModal(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            getUsers();
          }, 800);
      
          return () => {
            clearTimeout(redirectTimeout); // Cleanup function to clear the timeout when component unmounts or dependency changes
          };
    }, [searchText]);

  return (
    <Modal isOpen={showNewChatModal} onOpenChange={()=>setShowNewChatModal(false)} placement='center' scrollBehavior='inside' backdrop='blur'>
        <ModalContent className="overflow-y-auto h-[400px] md:h-[500px] custom-scrollbar">
            <>
              <ModalHeader className="flex flex-col gap-5 text-secondary/85 text-center">Create New Chat</ModalHeader>
              
              <ModalBody>

                <input
                    type="text"
                    placeholder="Search users by name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-secondary/75"
                />
                {!loading && users.length > 0 && (
                    <>
                        <div className='flex flex-col gap-5'>
                            {users.map((user) => {

                                const chatAlreadyExists = chats.find((chat) =>
                                    chat.users.find((u) => u._id === user._id) && !chat.isGroupChat
                                );
                                
                                if(user._id === currentUserData?._id || chatAlreadyExists){
                                    return null;
                                }

                                return (
                                    <div key={user._id} className='flex justify-between items-center'>
                                        <div className='flex items-center gap-5'>
                                            <Avatar src={user.profilePicUrl} alt={user.name} className='w-10 h-10 rounded-full sm:w-12 sm:h-12' />
                                            <span className='text-gray-600 capitalize sm:text-lg'>{user.name}</span>
                                        </div>

                                        <Button className='bg-primary-dark/85 border-none' size='sm' isLoading={selectedUserId===user._id && loading}
                                            onClick={() => onAddToChat(user._id)}
                                        >
                                            Add To Chat
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {loading && !selectedUserId && (
                    <div className="flex justify-center my-20">
                        <Spinner color='secondary' />
                    </div>
                )}
              </ModalBody>
            </>
        </ModalContent>
    </Modal>
  )
}

export default NewChatModal
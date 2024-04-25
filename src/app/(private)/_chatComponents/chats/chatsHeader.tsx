import React, { useState } from 'react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import NewChatModal from './newChatModal';
import { Input } from 'antd';


function ChatsHeader() {

    const [showNewChatModal, setShowNewChatModal] = useState(false);

  return (
    <div>
        <div className='flex justify-between items-center'>
            <h1 className='text-xl text-secondary/80 font-bold uppercase'>My Chats</h1>
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                        color="primary"
                        variant="solid"
                        className="capitalize text-secondary font-semibold w-max"
                    >
                        New
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Dropdown Variants"
                    color="secondary"
                    variant="solid"
                >
                    <DropdownItem key="1" onClick={()=>{setShowNewChatModal(true)}}>New Chat</DropdownItem>
                    <DropdownItem key="2">New Group</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>

        <Input
            placeholder="Search chats..."
            className="w-full border border-gray-300 border-solid outline-none rounded-md px-3 h-12 mt-3 focus:outline-none focus:border-secondary"
        />

        {showNewChatModal && (
            <NewChatModal
                showNewChatModal={showNewChatModal}
                setShowNewChatModal={setShowNewChatModal}
            />
        )}
    </div>
  )
}

export default ChatsHeader
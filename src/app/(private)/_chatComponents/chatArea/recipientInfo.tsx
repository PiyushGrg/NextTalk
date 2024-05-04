import { formatDateTime } from "@/helpers/DateFormat";
import { ChatState } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { Drawer } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Avatar, Button, Divider } from "@nextui-org/react";

interface RecipientInfoProps {
    showRecipientInfo: boolean;
    setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function RecipientInfo({showRecipientInfo,setShowRecipientInfo}: RecipientInfoProps) {

  const router = useRouter();

  const { currentUserData }: UserState = useSelector((state: any) => state.user);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  let chatName = "";
  let chatImage = "";
  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupProfilePicture || "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZlhiQnlkbWFSZVRqakJSbm1iUnBKdUlaY2UiLCJyaWQiOiJ1c2VyXzJmYVd4VTFoR1ZmNFIyRHc4WkRLTWVDNkFhVCJ9";
  } else {
    const receipient = selectedChat?.users.find((user) => user._id !== currentUserData?._id);
    chatName = receipient?.name!;
    chatImage = receipient?.profilePicUrl!;
  }

  const getProperty = (key: string, value: string) => {
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };

  return (
    <Drawer
      open={showRecipientInfo}
      onClose={() => setShowRecipientInfo(false)}
      title={selectedChat?.isGroupChat ? "Group Info" : "Chat Info"}
      style={{
        backgroundColor: "#E1F7F5"
      }}
      width={340}
    >
      <div className="flex justify-center flex-col items-center gap-5">
        <Avatar src={chatImage} alt="" className="w-28 h-28 rounded-full" />
        <span className="text-gray-700 capitalize">{chatName}</span>
      </div>

      <Divider className="my-3 border-gray-200" />

      {selectedChat?.isGroupChat && (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              {selectedChat.users.length} Members
            </span>
            <Button
              size="sm"
              className="bg-rose-400"
              onClick={() =>
                router.push(`/groups/editGroup/${selectedChat._id}`)
              }
            >
              Edit Group
            </Button>
          </div>
          {selectedChat.users.map((user) => (
            <div className="flex gap-5 items-center" key={user._id}>
              <Avatar
                src={user.profilePicUrl}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 text-sm capitalize">{user.name}</span>
            </div>
          ))}
        </div>
      )}
    
      {selectedChat?.isGroupChat && (<Divider className="my-3 border-gray-200" />)}

      <div className="flex flex-col gap-5">
        {getProperty("Created At", formatDateTime(selectedChat?.createdAt!))}
        {getProperty("Created By", selectedChat?.createdBy?.name! === currentUserData?.name! ? "You" : (selectedChat?.createdBy?.name!).toLocaleUpperCase() )}
      </div>
    </Drawer>
  );
}

export default RecipientInfo;
import { UserType } from '@/interfaces';
import { Divider, Button } from '@nextui-org/react';
import { Drawer, Upload } from 'antd';
import dayjs from 'dayjs';
import React from 'react'
import toast from 'react-hot-toast';

interface CurrentUserInfoProps {
    currentUserInfo: UserType | null;
    showCurrentUserInfo: boolean;
    setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function CurrentUserInfo({currentUserInfo,showCurrentUserInfo,setShowCurrentUserInfo}: CurrentUserInfoProps) {

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);


    const getProperty = (key: string, value: any) => {
        return (
          <div className="flex flex-col ">
            <span className="font-semibold text-gray-700">{key}</span>
            <span className="text-gray-600">{value}</span>
          </div>
        );
    };

    const onLogout = async () => {
        try {
          setShowCurrentUserInfo(false);
          toast.success("Logged out successfully");
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          
        }
    };

  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
      style={{
        backgroundColor: "#E1F7F5"
      }}
    >
      {currentUserInfo && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 justify-center items-center">
            {!selectedFile && (
              <img
                src={currentUserInfo?.profilePicUrl}
                alt="profile"
                className="w-28 h-28 rounded-full"
              />
            )}
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              className="cursor-pointer"
              listType={selectedFile ? "picture-circle" : "text"}
              maxCount={1}
            >
              Change Profile Picture
            </Upload>
          </div>

          <Divider orientation='horizontal' className="my-1 border-gray-200" />

          <div className="flex flex-col gap-5">
            {getProperty("Name", currentUserInfo.name.toUpperCase())}
            {getProperty("Phone", currentUserInfo.phone)}
            {getProperty("ID", currentUserInfo._id)}
            {getProperty(
              "Joined On",
              dayjs(currentUserInfo.createdAt).format("DD MMM YYYY hh:mm A")
            )}
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <Button
              className="w-full bg-rose-300"
            //   loading={loading}
            //   onClick={onProfilePictureUpdate}
              disabled={!selectedFile}
            >
              Update Profile Picture
            </Button>
            <Button
              className="w-full bg-secondary text-white"
            //   loading={loading && !selectedFile}
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}

export default CurrentUserInfo
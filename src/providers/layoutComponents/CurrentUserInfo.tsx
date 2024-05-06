import socket from '@/config/socketConfig';
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/ImageUpload';
import { UserType } from '@/interfaces';
import { SetCurrentUser, UserState } from '@/redux/userSlice';
import { UpdateUserProfile } from '@/server-actions/users';
import { useClerk } from '@clerk/nextjs';
import { Divider, Button, Avatar } from '@nextui-org/react';
import { Drawer, Upload } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

interface CurrentUserInfoProps {
    showCurrentUserInfo: boolean;
    setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

function CurrentUserInfo({showCurrentUserInfo,setShowCurrentUserInfo}: CurrentUserInfoProps) {

    const {signOut} = useClerk();
    const router = useRouter();
    const dispatch = useDispatch();

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [loading, setLoading] = React.useState(false);

    const { currentUserData }: UserState = useSelector((state: any) => state.user);

    const getProperty = (key: string, value: any) => {
        return (
          <div className="flex flex-col ">
            <span className="font-semibold text-gray-700">{key}</span>
            <span className="text-gray-600">{value}</span>
          </div>
        );
    };

    const onProfilePictureUpdate = async () => {
      try {
        setLoading(true);
        const url: string = await UploadImageToFirebaseAndReturnUrl(selectedFile!);

        const response = await UpdateUserProfile(currentUserData?._id!, {
          profilePicUrl: url,
        });

        if (response.error) throw new Error(response.error);

        dispatch(SetCurrentUser(response));
        toast.success("Profile picture updated successfully");
        setShowCurrentUserInfo(false);
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
        setSelectedFile(null);
      }
    };

    const onLogout = async () => {
        try {
          setLoading(true);
          socket.emit("logout", currentUserData?._id!);
          await signOut();
          setShowCurrentUserInfo(false);
          toast.success("Logged out successfully");
          router.push("/sign-in");
        } catch (error: any) {
          toast.error(error?.message);
        } finally {
          setLoading(false);
        }
    };

  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
      style={{
        backgroundColor: "#9AC8CD"
      }}
      width={340}
    >
      {currentUserData && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 justify-center items-center">
            {!selectedFile && (
              <Avatar
                src={currentUserData?.profilePicUrl}
                alt="profile"
                className="w-28 h-28 rounded-full"
              />
            )}
            <Upload
              beforeUpload={(file) => {
                const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                if (!isImage) {
                  toast.error('Only image files are allowed');
                  setSelectedFile(null);
                  return false;
                }
                if(isImage){
                  setSelectedFile(file);
                  return false;
                }
              }}
              accept=".png,.jpg,.jpeg"
              className="cursor-pointer"
              onRemove={() => setSelectedFile(null)}
              showUploadList={{ showPreviewIcon: false }}
              listType={selectedFile ? "picture-circle" : "text"}
              maxCount={1}
            >
              Change Profile Picture
            </Upload>
          </div>

          <Divider orientation='horizontal' className="my-1 border-gray-200" />

          <div className="flex flex-col gap-5">
            {getProperty("Name", currentUserData.name.toUpperCase())}
            {getProperty("Phone", currentUserData.phone)}
            {getProperty("ID", currentUserData._id)}
            {getProperty(
              "Joined On",
              dayjs(currentUserData.createdAt).format("DD MMM YYYY hh:mm A")
            )}
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <Button
              className="w-full bg-rose-400"
              isLoading={loading && (selectedFile ? true : false)}
              onClick={onProfilePictureUpdate}
              isDisabled={!selectedFile}
            >
              Update Profile Picture
            </Button>
            <Button
              className="w-full bg-secondary text-white"
              isLoading={loading && !selectedFile}
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
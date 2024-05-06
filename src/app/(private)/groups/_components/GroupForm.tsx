"use client";
import { UserType } from "@/interfaces";
import { UserState } from "@/redux/userSlice";
import { Form, Input, Upload } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { UploadImageToFirebaseAndReturnUrl } from "@/helpers/ImageUpload";
import { CreateNewChat, UpdateChat } from "@/server-actions/chats";
import toast from "react-hot-toast";
import { Avatar, Button, Checkbox } from "@nextui-org/react";

function GroupForm({users,initialData = null}: {users: UserType[];initialData?: any;}) {

  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(false);
  const { currentUserData }: UserState = useSelector((state: any) => state.user);

  const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>(
    initialData?.users.filter(
      (userId: string) => userId !== currentUserData?._id!
    ) || []
  );
  const [selectedProfilePicture, setSelectedProfilePicture] = React.useState<File>();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        groupName: values.groupName,
        groupBio: values.groupDescription,
        users: [...selectedUserIds, currentUserData?._id!],
        createdBy: currentUserData?._id!,
        isGroupChat: true,
        groupProfilePicture: initialData?.groupProfilePicture || "",
      };

      if (selectedProfilePicture) {
        payload.groupProfilePicture = await UploadImageToFirebaseAndReturnUrl(selectedProfilePicture);
      }

      let response: any = null;
      if (initialData) {
        response = await UpdateChat({
          chatId: initialData._id,
          payload: payload,
        });
      } else {
        response = await CreateNewChat(payload);
      }
      if (response.error) throw new Error(response.error);
      toast.success(
        initialData
          ? "Group updated successfully"
          : "Group created successfully"
      );
      router.push("/");
      router.refresh();
    } catch (error: any) {
    //   console.log(error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:gap-40">
      <div className="md:w-1/2 mb-5 md:mb-0">
        <span className="text-gray-500 text-sm">
          Select users to add to the group
        </span>
        <div className="mt-2 flex flex-col gap-3 md:gap-4 max-h-96 overflow-y-auto custom-scrollbar">
          {users.map((user) => {
            if (user._id === currentUserData?._id!) return null;
            return (
              <div key={user._id} className="flex gap-5 items-center">
                <Checkbox 
                  checked={selectedUserIds.includes(user._id)}
                  color="secondary"
                  size="sm"
                  onChange={() => {
                    if (selectedUserIds.includes(user._id)) {
                      setSelectedUserIds(
                        selectedUserIds.filter((id) => id !== user._id)
                      );
                    } else {
                      setSelectedUserIds([...selectedUserIds, user._id]);
                    }
                  }}
                  isSelected={selectedUserIds.includes(user._id)}
                />
                <Avatar
                  src={user.profilePicUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-500 text-sm capitalize">{user.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="md:w-1/2">
        <Form layout="vertical" onFinish={onFinish} initialValues={initialData}>
          <Form.Item
            name="groupName"
            label="Group Name"
            rules={[{ required: true, message: "Please input group name!" }]}
          >
            <Input className="border-solid border-gray-300 outline-none focus:outline-none focus:border-secondary"/>
          </Form.Item>
          <Form.Item name="groupDescription" label="Group Description" initialValue={initialData?.groupBio}>
            <Input.TextArea className="border-solid border-gray-300 outline-none focus:outline-none focus:border-secondary"/>
          </Form.Item>

          <Upload
            beforeUpload={(file) => {
                const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                if (!isImage) {
                    toast.error('Only image files are allowed');
                    setSelectedProfilePicture(undefined);
                    return false;
                }
                if(isImage){
                    setSelectedProfilePicture(file);
                    return false;
                }
            }}
            accept=".png,.jpg,.jpeg"
            className="cursor-pointer"
            onRemove={() => setSelectedProfilePicture(undefined)}
            showUploadList={{ showPreviewIcon: false }}
            maxCount={1}
            listType="picture-card"
          >
            <span className="p-3 text-xs">
                {initialData ? "Change Group Picture" : "Upload Group Picture"}
            </span>
          </Upload>

          <div className="flex justify-end gap-5 mt-5">
            <Button isDisabled={loading} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button color="secondary" type="submit" isLoading={loading}>
              {initialData ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GroupForm;
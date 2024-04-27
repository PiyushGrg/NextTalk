import { UserType } from "@/interfaces";
import ChatModel from "@/models/ChatModel";
import UserModel from "@/models/UserModel";
import Link from "next/link";
import React from "react";
import GroupForm from "../../_components/GroupForm";

async function EditGroup({ params }: { params: any }) {

  const id = params.id;
  const users: UserType[] = await UserModel.find({});
  const chat = await ChatModel.findById(id);

  return (
    <div className="p-5">
      <Link
        className="text-secondary border border-primary-dark px-5 py-2 no-underline border-solid text-sm"
        href="/"
      >
        Back To Chats
      </Link>
      <h1 className="text-rose-500 text-xl font-bold py-2 uppercase mt-10">
        Edit Group Chat
      </h1>

      <GroupForm
        initialData={JSON.parse(JSON.stringify(chat))}
        users={JSON.parse(JSON.stringify(users))}
      />
    </div>
  );
}

export default EditGroup;
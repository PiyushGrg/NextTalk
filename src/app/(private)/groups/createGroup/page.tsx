import UserModel from "@/models/UserModel";
import Link from "next/link";
import React from "react";
import GroupForm from "../_components/GroupForm";
import { UserType } from "@/interfaces";

async function CreateGroupPage() {

  const users: UserType[] = await UserModel.find({});

  return (
    <div className="p-5">
      <Link
        className="text-secondary border border-primary-dark px-5 py-2 no-underline border-solid text-sm"
        href="/"
      >
        Back To Chats
      </Link>
      <h1 className="text-rose-500 text-xl font-bold py-2 uppercase mt-10">
        Create Group Chat
      </h1>

      <GroupForm users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}

export default CreateGroupPage;
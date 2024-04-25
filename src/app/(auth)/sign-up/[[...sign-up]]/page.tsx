import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-primary-dark h-screen flex justify-center items-center">
      <SignUp path="/sign-up"/>
    </div>
  );
}
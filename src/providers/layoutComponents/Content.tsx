import { usePathname } from "next/navigation";
import React from "react";

function Content({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");

  if (isPublicRoute){
    return children;
  }

  return <div>{children}</div>;
}

export default Content;
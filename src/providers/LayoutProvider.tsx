"use client";
import React from "react";
import Header from "./layoutComponents/Header";
import Content from "./layoutComponents/Content";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Content>{children}</Content>
    </div>
  );
}

export default LayoutProvider;
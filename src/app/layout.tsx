import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/LayoutProvider";
import UIProvider from "@/providers/UIProvider";
import ReduxProvider from "@/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "NextTalk",
  description: "A real time chat web app where you can talk to people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorText: "#000",
          colorPrimary: "#1B1A55",
          colorBackground: "#9AC8CD",
          colorInputBackground: "#9AC8CD",
          colorInputText: "#000",
        },
      }}
    >
      <html lang="en">
        <body>
          <UIProvider>
            <ReduxProvider>
              <LayoutProvider>
                {children}
              </LayoutProvider>
            </ReduxProvider>
          </UIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

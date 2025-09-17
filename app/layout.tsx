import "../styles/globals.css";
import { ReactNode } from "react";

//components
import Header from "../components/layout/Header";
import TrackingComponents from "../components/layout/TrackingComponents";
import AuthModal from "../components/layout/AuthModal";
import LogoutWrapper from "../components/layout/LogoutWrapper";
import WelcomeWrapper from "../components/layout/WelcomeWrapper";
import { AuthProvider } from "../contexts/AuthContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthProvider>
          <Header />
          <TrackingComponents />
          <AuthModal />
          <LogoutWrapper />
          <WelcomeWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


import "../styles/globals.css";
import { ReactNode } from "react";

//components
import ConditionalNavbar from "../components/layout/ConditionalNavbar";
import ContentWrapper from "../components/layout/ContentWrapper";
import TrackingComponents from "../components/layout/TrackingComponents";
import AuthModal from "../components/layout/AuthModal";
import LogoutWrapper from "../components/layout/LogoutWrapper";
import WelcomeWrapper from "../components/layout/WelcomeWrapper";
import { AuthProvider } from "../contexts/AuthContext";
import { ChatProvider } from "../contexts/SocketContext";
import { Toaster } from "react-hot-toast";

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
          <ChatProvider>
            <ConditionalNavbar />
            <ContentWrapper>
              <TrackingComponents />
              <AuthModal />
              <LogoutWrapper />
              <WelcomeWrapper />
              {children}
            </ContentWrapper>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  zIndex: 99999,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                },
                success: {
                  style: {
                    background: '#059669',
                    border: '2px solid #10b981',
                  },
                },
                error: {
                  style: {
                    background: '#dc2626',
                    border: '2px solid #ef4444',
                  },
                },
              }}
            />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


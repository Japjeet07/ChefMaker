"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import LogoutAnimation from "./LogoutAnimation";

const LogoutWrapper: React.FC = () => {
  const { showLogoutAnimation, completeLogout } = useAuth();

  return (
    <LogoutAnimation 
      isVisible={showLogoutAnimation} 
      onComplete={completeLogout} 
    />
  );
};

export default LogoutWrapper;

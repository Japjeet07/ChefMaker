"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import WelcomeAnimation from "./WelcomeAnimation";

const WelcomeWrapper: React.FC = () => {
  const { showWelcomeAnimation, completeWelcome, user } = useAuth();

  return (
    <WelcomeAnimation 
      isVisible={showWelcomeAnimation} 
      onComplete={completeWelcome}
      userName={user?.name}
    />
  );
};

export default WelcomeWrapper;

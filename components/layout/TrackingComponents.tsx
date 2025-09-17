"use client";

import React, { useEffect } from "react";

const TrackingComponents: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const els = Array.from(document.querySelectorAll(".client")).concat(
        Array.from(document.querySelectorAll(".server")).flat()
      );

      if (e.key === "d") {
        els.forEach((el) => el.classList.add("debug"));
      } else if (e.key === "r") {
        els.forEach((el) => el.classList.remove("debug"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <></>;
};

export default TrackingComponents;


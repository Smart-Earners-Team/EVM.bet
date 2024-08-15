import React from "react";
import { RainbowKit } from "./rainbowkit";
import { RefContextProvider } from "../contexts/referralContext";

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RefContextProvider>
      <RainbowKit>{children}</RainbowKit>
    </RefContextProvider>
  );
};

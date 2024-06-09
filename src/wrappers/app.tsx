import React from 'react';
import { RainbowKit } from './rainbowkit';

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RainbowKit>
      {children}
    </RainbowKit>
  );
};

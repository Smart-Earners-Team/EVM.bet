/// <reference types="vite/client" />

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ethereum: any;
    xfi?: {
      ethereum?: any;
      bitcoin?: any;
    };
  }
}

export {};

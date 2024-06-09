import '@rainbow-me/rainbowkit/styles.css';
import {
    darkTheme,
    DisclaimerComponent,
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { testXTZ } from '../utils/customChains/chains';

const config = getDefaultConfig({
    appName: 'EVM.bet',
    projectId: 'YOUR_PROJECT_ID',
    chains: [testXTZ, mainnet],
    ssr: false, // true if your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const theme = darkTheme({
    accentColor: '#3CB0D9',
    accentColorForeground: 'white',
    borderRadius: 'small',
    fontStack: 'system',
    overlayBlur: 'large',
});

export const RainbowKit = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider coolMode theme={theme} appInfo={{
                    appName: "EVM.bet",
                    disclaimer: Disclaimer
                }}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
    <Text>
      By connecting your wallet, you agree to the{' '}
      <Link href="https://termsofservice.xyz">Terms of Service</Link> and
      acknowledge you have read and understand the protocol{' '}
      <Link href="https://disclaimer.xyz">Disclaimer</Link>
    </Text>
  );
  
import { Button } from "antd";
import { SiWalletconnect } from "react-icons/si";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Chain {
    hasIcon: boolean;
    iconUrl?: string | undefined;
    iconBackground?: string | undefined;
    id: number;
    name?: string | undefined;
    unsupported?: boolean | undefined;
}

export type OnChainChange = (chain: Chain) => void;

const Connect = ({ onChainChange }: {onChainChange?: OnChainChange}) => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                // Notify parent component about chain status
                if (chain && onChainChange) {
                    onChainChange(chain);
                }

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button onClick={openConnectModal} size="middle" className="btn-bg duration-500 group" type="primary" icon={<SiWalletconnect className="text-xl group-hover:animate-bounce" />} >
                                        Connect Wallet
                                    </Button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex gap-5">
                                    <button
                                        className="flex items-center border px-3 py-2 hover:opacity-75 duration-500 rounded border-dashed"
                                        onClick={openChainModal}
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 15,
                                                    height: 15,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 15, height: 15 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>

                                    <button className="flex items-center border px-3 py-2 hover:opacity-75 duration-500 rounded" onClick={openAccountModal} type="button">
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export { Connect as CustomConnect };

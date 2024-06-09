import { Chain } from "@rainbow-me/rainbowkit";

export const tToro : Chain = {
    id: 54321,
    name: "Toronet Testnet",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/5167.png",
    iconBackground: "#fff",
    nativeCurrency: {
        name: "TestToro",
        symbol: "tToro",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: [ "https://testnet.toronet.org/rpc/" ] },
    },
    blockExplorers: {
        default: { name: "Toronet Explorer", url: "https://testnet.toronet.org/" },
    },
    contracts: {
        multicall3: {
            address: "0x3364045D78f0df62425C48B721FC5C1c742bD7fb",
            blockCreated: 14308550,
        },
    },
} as const satisfies Chain;

export const KavaEVM : Chain = {
    id: 2222,
    name: "Kava EVM",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/4846.png",
    iconBackground: "#fff",
    nativeCurrency: {
        name: "Kava",
        symbol: "KAVA",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: [ "https://evm.kava.io/" ] },
    },
    blockExplorers: {
        default: { name: "Kava Explorer", url: "https://explorer.kava.io/" },
    },
    contracts: {
        multicall3: {
            address: "0x6A9a1D41269e979733b8D7C66d3600CEB02Efd01",
            blockCreated: 7147633,
        },
    },
} as const satisfies Chain;

export const ZetaAthens : Chain = {
    id: 7001,
    name: "ZetaChain Athens Testnet",
    iconUrl: "https://omnidrome.org/logos/zetachain-icon.svg",
    iconBackground: "#fff",
    nativeCurrency: {
        name: "Test Zeta",
        symbol: "aZETA",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [ "https://zetachain-athens-evm.blockpi.network/v1/rpc/public" ],
        },
    },
    blockExplorers: {
        default: {
            name: "Athens3 Explorer",
            url: "https://explorer.athens.zetachain.com/",
        },
    },
    contracts: {
        multicall3: {
            address: "0x89F56c350E7C62837F8eeddDa4874102910E2aA1",
            blockCreated: 2318799,
        },
    },
} as const satisfies Chain;

export const ZetaMainnet : Chain = {
    id: 7000,
    name: "ZetaChain Mainnet",
    iconUrl: "https://omnidrome.org/logos/zetachain-icon.svg",
    iconBackground: "#fff",
    nativeCurrency: {
        name: "Zeta",
        symbol: "ZETA",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [ "https://zetachain-evm.blockpi.network/v1/rpc/public" ],
        },
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://zetachain.blockscout.com/",
        },
    },
    contracts: {
        multicall3: {
            address: "0x81Be083099c2C65b062378E74Fa8469644347BB7",
            blockCreated: 1569272,
        },
    },
} as const satisfies Chain;

// Note: This is not for real use, donot change anything if you don't know what you are doing. Consult an expert or the dev team here.
export const BitcoinTestnet : Chain = {
    id: 18332,
    name: "Bitcoin",
    iconUrl:
        "data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%20-0.125%208.5%208.5%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8.313%204.032a4.032%204.032%200%201%201-8.064%200%204.032%204.032%200%200%201%208.064%200ZM5.25%202.534c.561.193.971.481.891%201.018-.059.393-.277.583-.568.65.399.207.534.599.408%201.073-.24.682-.809.74-1.567.598l-.184.734-.444-.111.181-.724a31.54%2031.54%200%200%201-.354-.091l-.182.728-.444-.11.184-.736-.895-.225.221-.506s.328.086.323.08c.126.031.182-.051.204-.105l.498-1.992c.006-.094-.027-.212-.207-.258a5.647%205.647%200%200%200-.323-.08l.118-.472.896.221.182-.727.444.111-.178.713c.119.027.239.054.356.084l.177-.708.444.11-.182.728ZM4.187%203.747c.302.08.961.255%201.076-.203.117-.469-.522-.61-.836-.679l-.092-.021-.221.884.073.019ZM3.844%205.17c.362.096%201.155.304%201.281-.2.129-.516-.639-.688-1.014-.771l-.109-.025-.244.974.086.022Z%22%20fill%3D%22%23F7931A%22%2F%3E%3C%2Fsvg%3E",
        iconBackground: "#fff",
    nativeCurrency: {
        name: "Bitcoin Testnet",
        symbol: "tBTC",
        decimals: 8,
    },
    rpcUrls: {
        default: {
            http: [ "https://zetachain-athens-evm.blockpi.network/v1/rpc/public" ],
        },
    },
    blockExplorers: {
        default: {
            name: "BlockChair Explorer",
            url: "https://blockchair.com/bitcoin/testnet/",
        },
    },
    contracts: {
        multicall3: {
            address: "0x89F56c350E7C62837F8eeddDa4874102910E2aA1",
            blockCreated: 2318799,
        },
    },
} as const satisfies Chain;

export const testXTZ : Chain = {
    id: 128123,
    name: "Etherlink Testnet",
    iconUrl:
        "https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png",
        iconBackground: "#fff",
    nativeCurrency: {
        name: "Tezos (Etherlink)",
        symbol: "tXTZ",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [ "https://node.ghostnet.etherlink.com" ],
        },
    },
    blockExplorers: {
        default: {
            name: "Etherlink Scan",
            url: "https://testnet-explorer.etherlink.com/",
        },
    },
    contracts: {
        multicall3: {
            address: "0xA7f3d2dEa7a53E7A9FEbBdE5Cf7C69d39D065030",
            blockCreated: 1420061,
        },
    },
} as const satisfies Chain;

export const EtherlinkMainnetBeta : Chain = {
    id: 128123,
    name: "Etherlink Mainnet Beta",
    iconUrl:
        "https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png",
        iconBackground: "#fff",
    nativeCurrency: {
        name: "Tezos (Etherlink)",
        symbol: "XTZ",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [ "https://node.mainnet.etherlink.com" ],
        },
    },
    blockExplorers: {
        default: {
            name: "Etherlink Scan",
            url: "https://explorer.etherlink.com/",
        },
    },
    contracts: {
        multicall3: {
            address: "0xA7f3d2dEa7a53E7A9FEbBdE5Cf7C69d39D065030",
            blockCreated: 327270,
        },
    },
} as const satisfies Chain;
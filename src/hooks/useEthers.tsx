import { ethers } from 'ethers'

interface ContractInitializer {
    rpc?: string,
    address?: ethers.Wallet,
    contractAddress?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contractABI?: any;
}

export const useContractInitializer = ({ rpc = 'http://localhost:8545', contractAddress = '0x0000000000000000000000000000000000000000', contractABI = [] }: ContractInitializer) => {
    // let contract: ethers.Contract | undefined;
    const JsonProvider = new ethers.JsonRpcProvider(rpc);
    // const signerOrProvider = address ? await JsonProvider.getSigner(address) : JsonProvider;
    // const signer = address?.connect(JsonProvider)

    const contract = new ethers.Contract(contractAddress, contractABI, JsonProvider);

    // if (contractType === 'read') {
    //     contract = new ethers.Contract(contractAddress, contractABI, JsonProvider);
    // }
    // else if (contractType === 'write') {
    //     contract = new ethers.Contract(contractAddress, contractABI, signer);
    // }

    return contract;
}

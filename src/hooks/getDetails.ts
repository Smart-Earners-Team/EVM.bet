import { ethers } from "ethers";
import { useContractInitializer } from "./useEthers";
import { ERC20ABI } from "../utils/ABIs";

export const getTokenBalance = async (
  userAddr: string,
  tokenAddress: string,
  rpcUrl: string
) => {
  let res: string = "0";

  try {
    if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" || tokenAddress === ethers.ZeroAddress) {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const response = await provider.getBalance(userAddr);
      res = ethers.formatEther(response);
    } else {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const contract = useContractInitializer({
        rpc: rpcUrl,
        contractABI: ERC20ABI,
        contractAddress: tokenAddress,
      });

      const response = await contract.balanceOf(userAddr);
      const decimals = await contract.decimals();
      // console.log(decimals)
      res = String(ethers.formatUnits(response, decimals));
      // console.log(res, 'contract');
    }
  } catch (error) {
    // console.log(error)
    console.log("error fetching balance for", tokenAddress);
  }

  // console.log(res)
  return res;
};
import { ethers } from "ethers";
import { useContractInitializer } from "./useEthers";
import { ERC20ABI, leaderboardABI } from "../utils/ABIs";
import { addresses } from "./addresses";

export interface TopUser {
  user: string;
  points: bigint;
}

export function encodeToBase64(inputString: string) {
  return btoa(inputString);
}

export function decodeBase64(encodedString: string) {
  return atob(encodedString);
}

export const getTokenBalance = async (
  userAddr: string,
  tokenAddress: string,
  rpcUrl: string
) => {
  let res: string = "0";

  try {
    if (
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ||
      tokenAddress === ethers.ZeroAddress
    ) {
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

export const getUserBonus = async (
  userAddr: string,
  cID: number,
  rpcUrl: string
) => {
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: leaderboardABI,
    contractAddress: addresses.leaderboard[cID],
  });

  const userBonus = await contract.UserBonus(userAddr);
  const userData = await contract.userData(userAddr);

  const today = Number(await contract.today());
  const lastUserBonus = await contract.lastUserBonus(userAddr);

  // console.log(today, lastUserBonus);
  // console.log(lastUserBonus.day)

  const res = {
    totalPoints: Number(userBonus),
    directReferrals: Number(userData.directRefs),
    teamSize: Number(userData.teamSize),
    multiLevelRef: JSON.parse(
      JSON.stringify(userData.multiLevelRef, (_, v) =>
        typeof v === "bigint" ? Number(v) : v
      )
    ),
    todaysPoints:
      Number(lastUserBonus.day) < today ? 0 : Number(lastUserBonus.amount),
  };

  return res;
};

export const getLeaderboard = async (
  // userAddr: string,
  cID: number,
  rpcUrl: string
) => {
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: leaderboardABI,
    contractAddress: addresses.leaderboard[cID],
  });

  const leaderBoard = await contract.getLeaderboard();

  // console.log(leaderBoard);

  const result = leaderBoard.map((item: any) => ({
    user: item.addr,
    points: item.points,
  }));

  const res = result.filter(
    (item: any) => item.user !== "0x0000000000000000000000000000000000000000"
  );

  return res;
};

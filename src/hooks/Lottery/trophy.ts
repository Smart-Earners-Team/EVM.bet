import { lotteryABI, pragmaEthFeedABI } from "../../utils/ABIs";
import { addresses } from "../addresses";
import { ethers } from "ethers";
import { useContractInitializer } from "../useEthers";
import { findCompatibleRPC } from "../checkRPC";
import { defaultRPCs } from "../../wrappers/rainbowkit";

// enum Status {
//     Pending,
//     Open,
//     Close,
//     Claimable
// }

export interface Lottery {
  status: bigint;
  startTime: bigint;
  endTime: bigint;
  priceTicketInEth: bigint;
  discountDivisor: bigint; // 200: 0
  rewardsBreakdown: bigint[]; // 0: 1 matching number // 5: 6 matching numbers [250,375,625,1250,2500,5000]
  treasuryFee: bigint; // 500: 5% // 200: 2% // 50: 0.5% 200: 0
  EthPerBracket: bigint[];
  countWinnersPerBracket: bigint[];
  firstTicketId: bigint;
  firstTicketIdNextLottery: bigint;
  amountCollectedInEth: bigint;
  finalNumber: bigint;
}

export const getLotteryId = async (cID: number, rpcUrl: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  const res = await contract.viewCurrentLotteryId();
  // console.log(res);
  return res;
};

export const getLastLotteryId = async (cID: number, rpcUrl: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  const res = await contract.viewCurrentLotteryId();
  // console.log(res);

  for (let i = Number(res); i >= 0; i--) {
    const lottery: Lottery = await getLotteryInfo(String(i), cID, rpcUrl);
    if (lottery.finalNumber > BigInt(0)) return i;
  }
  return 0;
};

export const getLotteryInfo = async (
  roundNo: string,
  cID: number,
  rpcUrl: string
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  const res: Lottery = await contract.viewLottery(BigInt(roundNo));
  // console.log(res);
  return res;
};

export const getCurrentprizeInETH = async (roundNo: string, cID: number) => {
  const lotteryInfo: Lottery = await getLotteryInfo(
    roundNo,
    cID,
    await findCompatibleRPC(defaultRPCs, cID)
  );

  if (lotteryInfo.amountCollectedInEth) {
    return ethers.formatEther(String(lotteryInfo.amountCollectedInEth));
  }

  return String(0);
};

export const getCurrentPrizeInUSD = async (roundNo: string, cID: number) => {
  const amtInETH: string = await getCurrentprizeInETH(roundNo, cID);
  // console.log(amtInETH);

  const Price = await getEthPrice();

  const prizeInUSD = Number(amtInETH) * Price;

  return prizeInUSD;
};

export const calculatePrizeForBulkTickets = async (
  discountDivisor: bigint,
  ticketPrice: bigint,
  ticketsNumber: number,
  cID: number,
  rpcUrl: string
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  const res: bigint = await contract.calculateTotalPriceForBulkTickets(
    discountDivisor,
    ticketPrice,
    ticketsNumber
  );
  console.log(res);
  return res;
};

export async function getEthPrice() {
  const contract = useContractInitializer({
    rpc: await findCompatibleRPC(defaultRPCs),
    contractABI: pragmaEthFeedABI,
    contractAddress: addresses.pragmaEthFeed[1802203764],
  });

  const res = await contract.latestAnswer();

  return Number(ethers.formatUnits(res, 8));
}

import { lotteryABI } from "../../utils/ABIs";
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
  priceTicketInMetis: bigint;
  discountDivisor: bigint; // 200: 0
  rewardsBreakdown: bigint[]; // 0: 1 matching number // 5: 6 matching numbers [250,375,625,1250,2500,5000]
  treasuryFee: bigint; // 500: 5% // 200: 2% // 50: 0.5% 200: 0
  MetisPerBracket: bigint[];
  countWinnersPerBracket: bigint[];
  firstTicketId: bigint;
  firstTicketIdNextLottery: bigint;
  amountCollectedInMetis: bigint;
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

export const getCurrentprizeInXTZ = async (roundNo: string, cID: number) => {
  const lotteryInfo: Lottery = await getLotteryInfo(
    roundNo,
    cID,
    await findCompatibleRPC(defaultRPCs, cID)
  );

  if (lotteryInfo.amountCollectedInMetis) {
    return ethers.formatEther(String(lotteryInfo.amountCollectedInMetis));
  }

  return String(0);
};

export const getCurrentPrizeInUSD = async (roundNo: string, cID: number) => {
  const amtInXTZ: string = await getCurrentprizeInXTZ(roundNo, cID);
  // console.log(amtInXTZ);

  const Price = 2.1;

  const prizeInUSD = Number(amtInXTZ) * Price;

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

  const res: Lottery = await contract.calculateTotalPriceForBulkTickets(
    discountDivisor,
    ticketPrice,
    ticketsNumber
  );
  // console.log(res);
  return res;
};

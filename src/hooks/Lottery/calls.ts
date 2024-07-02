import { ethers } from "ethers";
import { lotteryABI } from "../../utils/ABIs";
import { addresses } from "../addresses";
import { useContractInitializer } from "../useEthers";

export interface txReceipt {
  hash: string;
  status: boolean;
}

function flattenArray(arr: number[][]): number[] {
  return arr.map(subArr => {

    const concatenated = subArr.join('');
    return parseInt(concatenated, 10);
  });
}

export function flattenArrayToString(arr: number[][]): string[] {
  return arr.map(subArr => {

    const concatenated = subArr.join('');
    return concatenated;
  });
}

const buyTickets = async (lotteryId: string, ticketNumbers: number[][], amount: string, cID: number, signer: ethers.JsonRpcSigner) => {
  // console.log(lotteryId)
  // console.log(ticketNumbers)
  // console.log(amount) /* 0.399 */

  const tk = flattenArray(ticketNumbers);
  // console.log(tk);

  const contract = new ethers.Contract(
    addresses.lottery[cID],
    lotteryABI,
    signer
  );

  // console.log(contract);

  // console.log(lotteryId);
  // console.log(ticketNumbers);

  const tx = await contract.buyTickets(lotteryId, tk, {
    value: ethers.parseEther(amount),
  });

  const receipt = await tx.wait();

  // console.log(receipt);

  const res: txReceipt = {
    hash: receipt.hash,
    status: receipt.status === 1 ? true : false,
  };

  return res;
};

async function claimTickets({
  lotteryId,
  ticketsIdArray,
  brackets,
  cID,
  signer
}: {
  lotteryId: string;
  ticketsIdArray: string[];
  brackets: number[];
  cID: number;
  signer: ethers.JsonRpcSigner
}) {
  const contract = new ethers.Contract(
    addresses.lottery[cID],
    lotteryABI,
    signer
  );

  // console.log(lotteryId)
  // console.log(ticketsIdArray)
  // console.log(brackets)
  // console.log(contract)

  // const ticketStatuses = await contract.viewNumbersAndStatusesForTicketIds(ticketsIdArray);

  // console.log(ticketStatuses)

  const tx = await contract.claimTickets(lotteryId, ticketsIdArray, brackets);

  const receipt = await tx.wait();

  const res: txReceipt = {
    hash: receipt.hash,
    status: receipt.status === 1 ? true : false,
  };

  return res;
}

async function changeRandomizer({
  rndAddress,
  gasLimit,
  amtGas,
  cID,
  rpcUrl,
}: {
  rndAddress: string;
  gasLimit: string;
  amtGas: string;
  cID: number;
  rpcUrl: string;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  await contract.changeRandomizer(rndAddress, gasLimit, amtGas);

  // console.log(rndAddress);
  // console.log(gasLimit);
  // console.log(amtGas);
}

async function findMyTickets({ userAddr, lotteryId, cursor, size, cID,
  rpcUrl }: {
    userAddr: string, lotteryId: string, cursor: number, size: number, cID: number,
    rpcUrl: string;
  }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  const res = await contract.viewUserInfoForLotteryId(userAddr, lotteryId, cursor, size);

  return {
    ticketIDs: res[0],
    ticketNumbers: res[1],
    ticketClaimStatus: res[2],
    totalTickets: res[3]
  } as {
    ticketIDs: bigint[],
    ticketNumbers: bigint[],
    ticketClaimStatus: boolean[],
    totalTickets: bigint;
  };
}

async function viewRewardsForTicketId({
  lotteryId,
  ticketId,
  bracket,
  cID,
  rpcUrl,
}: {
  lotteryId: string;
  ticketId: bigint;
  bracket: bigint;
  cID: number;
  rpcUrl: string;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  return await contract.viewRewardsForTicketId(lotteryId, ticketId, bracket) as bigint;

  // console.log(lotteryId);
  // console.log(ticketsIdArray);
  // console.log(brackets);
}

export {
  buyTickets,
  claimTickets,
  changeRandomizer,
  findMyTickets,
  viewRewardsForTicketId
};

import { ethers } from "ethers";
import { lotteryABI } from "../../utils/ABIs";
import { addresses } from "../addresses";
import { useContractInitializer } from "../useEthers";

async function buyTickets({
  lotteryId,
  ticketNumbers,
  amount,
  cID,
  rpcUrl,
}: {
  lotteryId: string;
  ticketNumbers: number[][];
  cID: number;
  amount: string;
  rpcUrl: string;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  // console.log(lotteryId);
  // console.log(ticketNumbers);

  const res = await contract.buyTickets(lotteryId, ticketNumbers, {
    value: ethers.parseEther(amount),
  });

  await res.wait();
}

async function claimTickets({
  lotteryId,
  ticketsIdArray,
  brackets,
  cID,
  rpcUrl,
}: {
  lotteryId: string;
  ticketsIdArray: string[];
  brackets: number[];
  cID: number;
  rpcUrl: string;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractABI: lotteryABI,
    contractAddress: addresses.lottery[cID],
  });

  await contract.claimTickets(lotteryId, ticketsIdArray, brackets);

  // console.log(lotteryId);
  // console.log(ticketsIdArray);
  // console.log(brackets);
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
    rpcUrl: string
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
        totalTickets: bigint
    };
}

export {
    buyTickets,
    claimTickets,
    changeRandomizer,
    findMyTickets
}

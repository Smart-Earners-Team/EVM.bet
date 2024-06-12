import { lotteryABI } from "../../utils/ABIs";
import { addresses } from "../addresses";
import { useContractInitializer } from "../useEthers";

async function buyTickets({ lotteryId, ticketNumbers, cID,
    rpcUrl }: {
    lotteryId: string, ticketNumbers: number[], cID: number,
    rpcUrl: string
}) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const contract = useContractInitializer({
        rpc: rpcUrl,
        contractABI: lotteryABI,
        contractAddress: addresses.lottery[cID],
    });

    await contract.buyTickets(lotteryId, ticketNumbers);

    console.log(lotteryId)
    console.log(ticketNumbers)
}

async function claimTickets({ lotteryId, ticketsIdArray, brackets, cID,
    rpcUrl }: {
    lotteryId: string, ticketsIdArray: string[], brackets: number[], cID: number,
    rpcUrl: string
}) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const contract = useContractInitializer({
        rpc: rpcUrl,
        contractABI: lotteryABI,
        contractAddress: addresses.lottery[cID],
    });

    await contract.claimTickets(lotteryId, ticketsIdArray, brackets);

    console.log(lotteryId)
    console.log(ticketsIdArray)
    console.log(brackets)
}

async function changeRandomizer({ rndAddress, gasLimit, amtGas, cID,
    rpcUrl }: {
    rndAddress: string, gasLimit: string, amtGas: string, cID: number,
    rpcUrl: string
}) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const contract = useContractInitializer({
        rpc: rpcUrl,
        contractABI: lotteryABI,
        contractAddress: addresses.lottery[cID],
    });

    await contract.changeRandomizer(rndAddress, gasLimit, amtGas);

    console.log(rndAddress)
    console.log(gasLimit)
    console.log(amtGas)
}

export {
    buyTickets,
    claimTickets,
    changeRandomizer
}
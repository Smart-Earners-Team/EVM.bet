import { useAccount, useChainId, useConfig, useSwitchChain } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { LuArrowLeft, LuArrowRight, LuArrowRightToLine } from "react-icons/lu";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import Head from "react-helmet";
import { Layout } from "../components/Layout";
import {
  calculatePrizeForBulkTickets,
  getCurrentPrizeInUSD,
  getCurrentprizeInXTZ,
  getLastLotteryId,
  getLotteryId,
  getLotteryInfo,
  Lottery,
} from "../hooks/Lottery/trophy";
import { Button, Input, Modal, Tooltip } from "antd";
import { findCompatibleRPC } from "../hooks/checkRPC";
// import { lotteryABI } from "../utils/ABIs"
import { defaultRPCs } from "../wrappers/rainbowkit";
import TrophyImg from "../assets/trophy.svg";
import { CustomConnect, OnChainChange } from "../components/Wallet/Connect";
import { formatTimestamp } from "../hooks/formatTime";
import { buyTickets, claimTickets, findMyTickets, txReceipt, viewRewardsForTicketId } from "../hooks/Lottery/calls";
import { getTokenBalance } from "../hooks/getDetails";
import { useEthersSigner } from "../hooks/wagmiSigner";
import { TiLinkOutline, TiTick, TiWarning } from "react-icons/ti";
import { shortenAddress } from "../hooks/shortenAddress";
import { TfiTicket } from "react-icons/tfi";
import { RiCheckFill, RiErrorWarningLine } from "react-icons/ri";
import hourGlass from "../assets/hourglassNewColored.gif";
import { PiCaretRightBold } from "react-icons/pi";

const evmbetLogo = "/logo.png";

function generateColorHash(inputNumber: number): string {
  // Ensure the input number is positive
  const positiveInput = Math.abs(inputNumber);

  // Simple hash function: you can modify this for different hashing behaviors
  const red: number = (positiveInput * 113) % 256;
  const green: number = (positiveInput * 157) % 256;
  const cyan: number = (positiveInput * 193) % 256;

  // Convert the RGB values to a hexadecimal color string
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const cyanHex = cyan.toString(16).padStart(2, "0");

  return `#${redHex}${greenHex}${cyanHex}`;
}

type BracketResult = {
  bracket: number;
  result: bigint;
};

const Trophy = () => {
  const { address, chain, isConnected } = useAccount();

  // console.log(address)

  const config = useConfig();
  const chains = config.chains;
  const chainId = useChainId();

  // console.log(chains)

  const { switchChainAsync } = useSwitchChain();

  // console.log(nftArray)

  const cID = chainId || chains[0].id;

  const [isUnsupportedChain, setIsUnsupportedChain] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChainChange: OnChainChange = (chain: any) => {
    setIsUnsupportedChain(chain.unsupported);
  };

  // console.log(cID);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signer: any = useEthersSigner({ chainId: cID });

  const [more, setMore] = useState<boolean>(false);

  const handleAccordion = () => {
    setMore(!more);
  };

  const [latestRound, setLatestRound] = useState<number>(0);
  const [lastRound, setLastRound] = useState<number>(0);
  const [roundNo, setRoundNo] = useState<number>(latestRound);
  const [latestRoundInfo, setLatestRoundInfo] = useState<Lottery>(
    {} as Lottery
  );
  const [roundInfo, setRoundInfo] = useState<Lottery>({} as Lottery);
  const [roundHistory, setRoundHistory] = useState<string>("All");
  const [prizeInXTZ, setprizeInXTZ] = useState<string>("0");
  const [prizeInUSD, setPrizeInUSD] = useState<string>("0");
  const [prizeInUSD2, setPrizeInUSD2] = useState<string>("0");
  const [moreR, setMoreR] = useState<boolean>(false);
  const [amtTicket, setamtTicket] = useState<string>("0");
  const [amtTicketInRound, setamtTicketInRound] = useState<string>("0");
  const [amtTicketInLatestRound, setamtTicketInLatestRound] = useState<string>("0");
  const [winningTicketsInRound, setWinningTicketsInRound] = useState<{
    [key: string]: BracketResult[];
  }>({});
  // const [winningTicketsInLatestRound, setWinningTicketsInLatestRound] = useState<{
  //   [key: string]: BracketResult[];
  // }>({});
  const [buyModalOpen, setBuyModalOpen] = useState<boolean>(false);
  const [myTicketModalOpen, setMyTicketModalOpen] = useState<boolean>(false);
  const [myTicket2ModalOpen, setMyTicket2ModalOpen] = useState<boolean>(false);
  const [mainButtonText, setMainButtonText] = useState<string>("");
  const [isBuyLoading, setisBuyLoading] = useState<boolean>(false);
  const [isClaimLoading, setisClaimLoading] = useState<boolean>(false);

  const [bulkTicketDiscount, setBulkTicketDiscount] = useState<string>("0");
  const [discountXTZ, setDiscountXTZ] = useState<string>("0");
  const [discountPercentage, setDiscountPercentage] = useState<string>("0");
  const [purchaceCost, setPurchaceCost] = useState<string>("0");

  const [baseBalance, setBaseBalance] = useState<string>("0.00");
  const [txReceipt, setReceipt] = useState<txReceipt>({
    hash: "",
    status: false,
  });

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  //console.log( amtTicket )
  const [editLot, setEditLot] = useState<boolean>(false);
  const [loadingRound, setloadingRound] = useState<boolean>(false);

  function hasDuplicateArrays(arrays: string[][]): boolean {
    const numberArr: number[][] = arrays.map((subArr) =>
      subArr.map((str) => parseInt(str))
    );

    const arrayMap = new Map<string, number>();

    for (const arr of numberArr) {
      const arrString = JSON.stringify(arr);
      if (arrayMap.has(arrString)) {
        //console.log('true')
        return true; // Duplicate found
      } else {
        arrayMap.set(arrString, 1);
      }
    }

    //console.log( 'false' )
    return false; // No duplicates found
  }

  // Function to generate a random 6-digit number
  const generateRandomNumber = (): number => {
    const randomSixDigits = Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit number
    return Number(randomSixDigits.toString());
  };

  // Function to generate an array of random digits
  const generateRandomDigitsArray = (): string[] => {
    return generateRandomNumber().toString().split("");
  };

  // State to store the array of arrays of random digits
  const [digitsArr, setDigitsArr] = useState<string[][]>(
    Array.from({ length: Number(amtTicket) }, generateRandomDigitsArray)
  );

  const [ticketNumbersInRound, setTicketNumbersInRound] = useState<string[][]>([]);

  const [ticketNumbersInLatestRound, setTicketNumbersInLatestRound] = useState<string[][]>([]);

  const [userRoundInfo, setUserRoundInfo] = useState<{
    number: number;
    date: string;
    tickets: number;
  }[]>([]);

  // useEffect to update digitsArr whenever amtTicket changes
  useEffect(() => {
    const newDigitsArr = Array.from(
      { length: Number(amtTicket) },
      generateRandomDigitsArray
    );
    setDigitsArr(newDigitsArr);
  }, [amtTicket]);

  // Handler for randomizing the entire array of arrays
  const randomizeAll = () => {
    do {
      const newDigitsArr = Array.from(
        { length: Number(amtTicket) },
        generateRandomDigitsArray
      );
      setDigitsArr(newDigitsArr);
    } while (hasDuplicateArrays(digitsArr));
  };

  // Input event handler to manage all inputs and return the numbers selected
  const handleInputChange = (
    arrayIndex: number,
    digitIndex: number,
    value: string
  ) => {
    let num = parseInt(value);
    if (isNaN(num) || num < 0) {
      num = 0;
    } else if (num > 9) {
      num = 9;
    }
    const newDigitsArr = digitsArr.map((digits, idx) =>
      idx === arrayIndex
        ? digits.map((digit, i) => (i === digitIndex ? num.toString() : digit))
        : digits
    );

    setDigitsArr(newDigitsArr);
  };

  // Invert digits for display in each array
  const invertedDigitsArr = digitsArr.map((digits) => [...digits].reverse());

  //console.log(digitsArr)

  const handleAccordionR = () => {
    setMoreR(!moreR);
  };

  const getData = useCallback(async () => {
    const lotID = await getLotteryId(
      cID,
      await findCompatibleRPC(defaultRPCs, cID)
    );
    const lastID = await getLastLotteryId(
      cID,
      await findCompatibleRPC(defaultRPCs, cID)
    );
    setLatestRound(Number(lotID));
    setLastRound(Number(lastID));
    setRoundNo(Number(lotID));
  }, [cID, address]);

  const getRoundInfo = useCallback(async () => {
    setloadingRound(true);
    const res1 = await getLotteryInfo(
      String(roundNo),
      cID,
      await findCompatibleRPC(defaultRPCs, cID)
    );
    const res2 = await getLotteryInfo(
      String(latestRound),
      cID,
      await findCompatibleRPC(defaultRPCs, cID)
    );

    setRoundInfo(res1);
    setLatestRoundInfo(res2);

    setprizeInXTZ(String(await getCurrentprizeInXTZ(String(roundNo), cID)));
    // console.log(await getCurrentprizeInXTZ(String(roundNo), cID));

    setPrizeInUSD(String(await getCurrentPrizeInUSD(String(roundNo), cID)));
    // console.log(await getCurrentPrizeInUSD(String(roundNo), cID));

    setPrizeInUSD2(String(await getCurrentPrizeInUSD(String(latestRound), cID)));
    // console.log(await getCurrentPrizeInUSD2(String(latestRound), cID));

    setloadingRound(false);

    // console.log(roundInfo);

    // console.log(JSON.parse(JSON.stringify(roundInfo, (_, v) =>
    //     typeof v === 'bigint' ? Number(v) : v)));
    // console.log(latestRound);
    // console.log(prizeInXTZ)
    // console.log("prizeInUSD", prizeInUSD);
  }, [roundNo, roundHistory]);

  const ticketNumbers = digitsArr.length > 0 ? digitsArr.map(val => {
    const newArr = val.map(item => Number(item));
    newArr.unshift(1);
    return newArr;
  }) : [];

  // console.log(ticketNumbers);

  const handleBuy = async () => {
    // console.log("buying");
    setisBuyLoading(true);

    try {
      // console.log("going through")
      const res = await buyTickets(
        String(latestRound),
        ticketNumbers,
        bulkTicketDiscount,
        cID,
        signer
      );

      // console.log(res);

      setReceipt(res);
      setisBuyLoading(false);
    } catch (error) {
      console.error(error);
      setisBuyLoading(false);
    }
  };

  const handleClaimTickets = async () => {
    // console.log("claiming");
    setisClaimLoading(true);

    const brackets = Object.keys(winningTicketsInRound).reduce((acc: number[], key) => {
      const brackets = winningTicketsInRound[key].map(bracketResult => bracketResult.bracket);
      const highestBracket = Math.max(...brackets); // Find the highest bracket in the current array
      acc.push(highestBracket); // Add the highest bracket to the accumulator array
      return acc;
    }, []);

    try {
      const res = await claimTickets({
        lotteryId: String(roundNo),
        ticketsIdArray: Object.keys(winningTicketsInRound),
        brackets: brackets,
        cID: cID,
        signer: signer
      });

      // console.log(res);

      setReceipt(res);
      setisClaimLoading(false);
    } catch (error) {
      console.error(error);
      setisClaimLoading(false);
    }
  };

  useEffect(() => {
    const updateMainButtonText = () => {
      amtTicket !== "" && Number(amtTicket) > 0
        ? Number(amtTicket) === 1
          ? setMainButtonText("Buy Ticket")
          : setMainButtonText("Buy Tickets")
        : setMainButtonText("Enter a valid amount!");
    };
    updateMainButtonText();
  }, [amtTicket]);

  const fetchUserRoundsInfo = async () => {
    const array: {
      roundNo: number;
      ticketIDs: bigint[];
      ticketNumbers: bigint[];
      ticketClaimStatus: boolean[];
      totalTickets: bigint;
      date: bigint;
    }[] = [];

    for (let i = latestRound; i > latestRound - 100; i--) {
      if (i < 1) {
        break;
      }
      const res = await findMyTickets({
        userAddr: String(address),
        lotteryId: String(i),
        cursor: 0,
        size: 100,
        cID: cID,
        rpcUrl: await findCompatibleRPC(defaultRPCs, cID)
      });

      if (res.totalTickets > 0) {
        const lotInfo = await getLotteryInfo(
          String(i),
          cID,
          await findCompatibleRPC(defaultRPCs, cID)
        );

        array.push({
          ...res,
          roundNo: i,
          date: lotInfo.endTime,
        });
      }
    }

    // console.log(array);

    const result: {
      number: number;
      date: string;
      tickets: number;
    }[] = array.map(item => ({
      number: item.roundNo,
      date: formatTimestamp(Number(item.date))
        .formattedDate,
      tickets: Number(item.totalTickets)
    }));

    // console.log(result);
    setUserRoundInfo(result);
  };

  useEffect(() => {
    fetchUserRoundsInfo();
  }, [latestRound]);

  const fetchTicketInRound = async () => {
    const res = await findMyTickets({
      userAddr: String(address),
      lotteryId: String(roundNo),
      cursor: 0,
      size: 100,
      cID: cID,
      rpcUrl: await findCompatibleRPC(defaultRPCs, cID),
    });

    setamtTicketInRound(String(Number(res.totalTickets)));

    const results: { [key: string]: BracketResult[]; } = {};

    for (let i = 0; i < res.ticketIDs.length; i++) {
      const ticketId = res.ticketIDs[i].toString();
      const bracketResults: BracketResult[] = [];

      for (let j = 0; j < 7; j++) {
        const result: bigint = await viewRewardsForTicketId({
          ticketId: BigInt(ticketId),
          cID: cID,
          rpcUrl: await findCompatibleRPC(defaultRPCs, cID),
          lotteryId: String(roundNo),
          bracket: BigInt(j)
        });

        if (result > BigInt(0)) {
          bracketResults.push({ bracket: j, result });
        }
      }

      if (bracketResults.length > 0) {
        // console.log(bracketResults);
        results[ticketId] = bracketResults;
      }
    }

    setWinningTicketsInRound(results);

    // console.log(results);
    // console.log('Total number of results:', Object.keys(results));

    // console.log('Total number of results:', Object.keys(results).length);

    setTicketNumbersInRound(() => {
      // console.log(arr);
      return res.ticketNumbers.map(val =>
        val.toString()
          .substring(1)
          .split("")
          .reverse()
          .join("")
          .split("")
      );
    });
  };

  const fetchTicketInLatestRound = async () => {
    const res = await findMyTickets({
      userAddr: String(address),
      lotteryId: String(latestRound),
      cursor: 0,
      size: 100,
      cID: cID,
      rpcUrl: await findCompatibleRPC(defaultRPCs, cID),
    });
    // console.log(res.totalTickets)

    setamtTicketInLatestRound(String(Number(res.totalTickets)));

    // const results: { [key: string]: BracketResult[]; } = {};

    // for (let i = 0; i < res.ticketIDs.length; i++) {
    //   const ticketId = res.ticketIDs[i].toString();
    //   const bracketResults: BracketResult[] = [];

    //   for (let j = 0; j < 7; j++) {
    //     const result: bigint = await viewRewardsForTicketId({
    //       ticketId: BigInt(ticketId),
    //       cID: cID,
    //       rpcUrl: await findCompatibleRPC(defaultRPCs, cID),
    //       lotteryId: String(latestRound),
    //       bracket: BigInt(j)
    //     });

    //     if (result > BigInt(0)) {
    //       bracketResults.push({ bracket: j, result });
    //     }
    //   }

    //   if (bracketResults.length > 0) {
    //     results[ticketId] = bracketResults;
    //   }
    // }

    // setWinningTicketsInLatestRound(results);

    // console.log(results);
    // console.log('Total number of results:', Object.keys(results).length);

    setTicketNumbersInLatestRound(() => {
      // console.log(arr);
      return res.ticketNumbers.map(val =>
        val.toString()
          .substring(1)
          .split("")
          .reverse()
          .join("")
          .split("")
      );
    });
  };

  const fetchBulkTicketDiscount = async () => {
    if (latestRoundInfo.priceTicketInMetis > BigInt(0)) {
      const cost =
        Number(ethers.formatEther(latestRoundInfo.priceTicketInMetis)) *
        Number(amtTicket);

      const res =
        Number(amtTicket) > 0
          ? ethers.formatEther(
            await calculatePrizeForBulkTickets(
              latestRoundInfo.discountDivisor,
              latestRoundInfo.priceTicketInMetis,
              Number(amtTicket),
              cID,
              await findCompatibleRPC(defaultRPCs, cID)
            )
          )
          : String(0);

      const discountPercent = ((cost - Number(res)) / cost) * 100;

      setBulkTicketDiscount(String(Number(res)));
      setDiscountXTZ((cost - Number(res)).toLocaleString());
      setDiscountPercentage(discountPercent.toLocaleString());
      setPurchaceCost(cost.toLocaleString());
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getRoundInfo();
  }, [getRoundInfo]);

  useEffect(() => {
    fetchTicketInRound();
  }, [roundNo, address, cID]);

  useEffect(() => {
    fetchTicketInLatestRound();
  }, [roundNo, latestRound, address, cID]);

  useEffect(() => {
    fetchBulkTicketDiscount();
  }, [amtTicket, latestRoundInfo]);

  useEffect(() => {
    const fetchBalance = async () => {
      const res: string = await getTokenBalance(
        String(address),
        ethers.ZeroAddress,
        await findCompatibleRPC(defaultRPCs, cID)
      );
      // console.log(res);
      setBaseBalance(res);
    };
    const intervalId = setInterval(fetchBalance, 3000);
    return () => clearInterval(intervalId);
  }, [address, cID, latestRound]);

  useEffect(() => {
    const txCheck = () => {
      if (txReceipt.hash !== "") {
        setIsReceiptModalOpen(true); // Show receipt modal
        setTimeout(() => setIsReceiptModalOpen(false), 10000);
        setReceipt({
          hash: "",
          status: false
        });
      }
    };

    txCheck();
    // console.log(txReceipt)
  }, [txReceipt]);

  if (isUnsupportedChain && isConnected) {
    return (
      <div>
        <Head>
          <title>Wrong Network | EVM.bet &copy;</title>
          <link rel="icon" type="image/png" href="/logo.png" />
        </Head>

        <Layout>
          <div className="flex flex-col items-center justify-center mx-auto my-16">
            <a
              href="/"
              className="flex col-span-2 cursor-pointer select-none gap-x-1 w-fit"
            >
              <img src={evmbetLogo} width={800} alt="EVM.bet Logo" />
            </a>
            <div className="mb-6 -mt-2 duration-500 md:-mt-16 animate-pulse text-md md:text-2xl">
              Please, switch to a supported network.
            </div>
            {/* <WalletConnectButton /> */}
            <button
              onClick={async () =>
                switchChainAsync({
                  chainId: chains[0].id,
                })
              }
              className="px-6 py-2 mt-4 text-sm font-semibold text-white bg-cyan-500 rounded-md shadow hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
            >
              Switch Network
            </button>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Trophy | EVM.bet &copy;</title>
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>

      <Layout>
        <div className="flex flex-col max-w-screen-lg gap-10 mx-auto my-6">
          <div className="grid justify-center gap-2 text-center align-middle select-none">
            <div className="grid items-center justify-center">
              <h1 className="text-2xl font-bold">EVM.bet Trophy</h1>
              <div
                className="my-2 text-4xl font-black md:text-6xl text-cyan-500 text-ellipsis truncate"
                title={`$${Number(prizeInUSD).toLocaleString()}`}
              >
                {`$${Number(prizeInUSD).toLocaleString()}`}
              </div>
              <div className="text-xl font-semibold">in Prizes!</div>
              <img
                src={TrophyImg}
                alt={"trophy"}
                loading="lazy"
                className="w-[30rem] pointer-events-none mx-auto -my-5"
              />
            </div>
          </div>

          <div className="grid justify-around gap-8">
            {
              Number(latestRoundInfo.endTime) > Date.now() && (
                <div className="grid gap-2 text-center">
                  <h1 className="text-2xl font-black">Get your tickets now!</h1>
                  <div className="items-center space-x-2 text-3xl">
                    <span className="space-x-3 font-black text-cyan-500">
                      <span className="space-x-1">
                        <span>3</span>
                        <span className="text-xl">h</span>
                      </span>
                      <span className="space-x-1">
                        <span>45</span>
                        <span className="text-xl">m</span>
                      </span>
                    </span>
                    <span className="text-lg">until the draw</span>
                  </div>
                </div>
              )
            }

            {
              Number(latestRoundInfo.endTime) ? (
                Number(latestRoundInfo.endTime) > Date.now() ? (
                  <div className="max-w-2xl shadow min-w-80 rounded-3xl bg-cyan-900/30 backdrop-blur-sm text-cyan-50">
                    <div className="grid items-center justify-between grid-flow-col py-5 px-7 bg-cyan-950/50 rounded-t-3xl">
                      <div className="hidden text-base font-black md:block">
                        Next Draw
                      </div>
                      <div className="text-xs">
                        #{latestRound} | Drawn:{" "}
                        {latestRoundInfo.endTime > BigInt(0) &&
                          `${formatTimestamp(Number(latestRoundInfo.endTime))
                            .formattedDate
                          } | ${formatTimestamp(Number(latestRoundInfo.endTime))
                            .formattedTime
                          }`}
                      </div>
                    </div>

                    <div className="grid gap-5 py-5 text-center px-7">
                      <div className="grid md:gap-5 md:grid-flow-col justify-items-center md:justify-start">
                        <div className="self-start py-0.5 font-bold text-base">
                          Prize Pot:
                        </div>
                        <div className="grid self-start gap-1">
                          <div className="text-3xl font-bold text-cyan-200 text-ellipsis truncate">
                            ~${Number(prizeInUSD2).toLocaleString()}
                          </div>
                          <div className="text-xs md:self-start">
                            {latestRoundInfo.amountCollectedInMetis > BigInt(0)
                              ? Number(
                                ethers.formatEther(latestRoundInfo.amountCollectedInMetis)
                              ).toLocaleString()
                              : 0}{" "}
                            XTZ
                          </div>
                        </div>
                      </div>

                      <div className="grid text-sm md:gap-5 md:grid-flow-col items-center">
                        <div className="py-0.5 font-bold text-base">
                          Your Tickets:
                        </div>
                        <div className="grid gap-2 my-2 justify-center items-center">
                          <div className="space-x-1">
                            <span>You have</span>
                            <span
                              children={amtTicketInLatestRound}
                              className="text-cyan-50 w-32 text-sm font-semibold"
                            />
                            <span>ticket(s) in this round</span>
                          </div>
                          {
                            Number(amtTicketInLatestRound) > 0 && (
                              <button
                                onClick={() => setMyTicketModalOpen(true)}
                                className="text-xs font-bold text-center duration-500 hover:text-cyan-500 outline-none text-cyan-300"
                                children={"View your tickets"}
                              />
                            )
                          }
                        </div>

                        <button
                          // disabled={!(Number(latestRoundInfo.endTime) > Date.now())}
                          onClick={() => setBuyModalOpen(true)}
                          className="px-4 py-2 my-2 text-sm font-semibold text-center duration-500 border border-dotted outline-none hover:rounded-xl rounded-tr-xl rounded-bl-xl bg-cyan-100/90 text-cyan-900 hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy Tickets
                        </button>

                      </div>
                    </div>

                    <hr className="w-4/5 mx-auto line-clamp-1 opacity-15" />

                    {more && (
                      <div className="grid gap-5 py-5 px-7 bg-cyan-950/50">
                        <div className="text-xs">
                          Match the winning number in the same order to share prizes.
                          Current prizes up for grabs:
                        </div>
                        <div className="grid justify-between grid-cols-3 gap-5 md:grid-cols-4">
                          {latestRoundInfo.rewardsBreakdown.map((val, i) => (
                            <div key={i} className="grid text-sm justify-items-start">
                              <div className="text-xs font-bold text-cyan-500">
                                Match First {i + 1}
                              </div>
                              <div className="space-x-2">
                                <span className="text-base font-semibold">
                                  {(
                                    (Number(val) / 10000) *
                                    Number(
                                      ethers.formatEther(
                                        latestRoundInfo.amountCollectedInMetis
                                      )
                                    )
                                  ).toFixed(3)}
                                </span>
                                <span className="text-sm">XTZ</span>
                              </div>
                              <div className="text-xs opacity-85">
                                {/* ~${val.usd.toLocaleString()} */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <hr className="w-4/5 mx-auto line-clamp-1 opacity-15" />

                    <div className="grid gap-5 py-5 mx-auto text-center px-7 w-fit">
                      <button
                        onClick={handleAccordion}
                        className="grid grid-flow-col px-4 py-2 text-sm font-semibold text-center align-middle duration-500 border border-dotted outline-none hover:rounded-xl rounded-tr-xl rounded-bl-xl bg-cyan-100/90 text-cyan-900 hover:bg-cyan-100 group"
                      >
                        <span className="">{more ? "Hide" : "Details"}</span>
                        {more ? (
                          <FaAngleUp className="my-auto text-xl duration-500 group-hover:py-0.5 justify-self-center" />
                        ) : (
                          <FaAngleDown className="my-auto text-xl duration-500 group-hover:py-0.5 justify-self-center" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid pt-3 grid-flow-col justify-center gap-1.5 text-lg tracking-wide text-center">
                      The <span className="text-gradient font-bold">EVM.bet</span> Lottery
                    </div>

                    <img src={hourGlass} className="md:w-96 w-32 mx-auto -my-2" />

                    <div className="grid gap-5 mx-auto text-4xl font-extrabold tracking-wide text-center pb-5 w-fit">
                      Tickets on sale soon
                    </div>

                  </div>
                )
              ) : (
                <img src={evmbetLogo} className="w-8 animate-spin" />
              )
            }
          </div>

          <div className="grid justify-around gap-8">
            {!isConnected && (
              <div
                className={`grid self-center place-items-center gap-2 p-8 text-center shadow w-5xl border-2 border-dashed border-cyan-500/50 text-cyan-50 rounded-xl`}
              >
                <h1 className="text-xl font-bold">
                  Connect your wallet to check if you've won!
                </h1>
                <CustomConnect onChainChange={handleChainChange} />
              </div>
            )}
          </div>

          <div className="grid justify-around gap-8">
            <div className="grid gap-2 place-items-center">
              <h1 className="text-2xl font-black">Finished Rounds</h1>
              <div className="grid grid-flow-col gap-1.5 text-sm bg-cyan-900 rounded-3xl p-0.5 font-semibold leading-tight mt-3">
                <button
                  onClick={() => setRoundHistory("All")}
                  className={`px-3 py-2 tracking-wide duration-300 ${roundHistory === "All"
                    ? "bg-cyan-50 text-cyan-800"
                    : "text-cyan-200"
                    } rounded-3xl hover:opacity-75 shadow-xl`}
                >
                  All History
                </button>
                <button
                  onClick={() => setRoundHistory("User")}
                  className={`px-3 py-2 tracking-wide duration-300 ${roundHistory === "User"
                    ? "bg-cyan-50 text-cyan-800"
                    : "text-cyan-200"
                    } rounded-3xl hover:opacity-75 shadow-xl`}
                >
                  Your History
                </button>
              </div>

              {roundHistory === "All" && (
                <>
                  <div className="max-w-3xl shadow min-w-80 rounded-3xl bg-cyan-900/30 backdrop-blur-sm text-cyan-50">
                    <div className="grid items-center justify-between grid-flow-col py-5 px-7 bg-cyan-950/50 rounded-t-3xl">
                      <div className="grid gap-2">
                        <div className="grid grid-flow-col gap-0.5 items-center">
                          <span className="text-base font-black md:block">
                            Round
                          </span>
                          <input
                            type="text"
                            name="round"
                            id="round"
                            className="w-16 px-3 py-1 text-sm font-semibold border-2 outline-none rounded-2xl text-cyan-800 border-cyan-500 inset-5"
                            min={1}
                            max={latestRound}
                            value={roundNo}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (!isNaN(value)) {
                                // Check if the value is not NaN
                                if (value > latestRound) {
                                  setRoundNo(latestRound);
                                } else {
                                  setRoundNo(value);
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="text-xs">
                          Drawn{" "}
                          {roundInfo.endTime > BigInt(0) &&
                            `${formatTimestamp(Number(roundInfo.endTime))
                              .formattedDate
                            } | ${formatTimestamp(Number(roundInfo.endTime))
                              .formattedTime
                            }`}
                        </div>
                      </div>
                      <div className="grid grid-flow-col gap-2">
                        <button
                          onClick={() => roundNo > 1 && setRoundNo(roundNo - 1)}
                          className="text-xl disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={roundNo <= 1}
                        >
                          <LuArrowLeft />
                        </button>
                        <button
                          onClick={() =>
                            roundNo >= 1 && setRoundNo(roundNo + 1)
                          }
                          className="text-xl disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={roundNo === latestRound}
                        >
                          <LuArrowRight />
                        </button>
                        <button
                          onClick={() => setRoundNo(latestRound)}
                          className="text-xl disabled:cursor-not-allowed disabled:opacity-50"
                          disabled
                        >
                          <LuArrowRightToLine />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-5 py-5 text-center px-7">
                      <div className="grid gap-2 select-none md:gap-5 md:grid-flow-col justify-items-center md:justify-start">
                        <div className="self-start py-0.5 font-bold text-base whitespace-nowrap">
                          Winning Number
                        </div>
                        <div className="relative items-center grid grid-flow-col gap-2 select-none">
                          {
                            loadingRound ? <img src={evmbetLogo} className='w-8 animate-spin m-auto' /> :
                              <div>
                                <div className="relative items-center grid grid-flow-col gap-2 select-none">
                                  {
                                    /* Number(1533774) */
                                    Number(roundInfo.finalNumber)
                                      .toString()
                                      .substring(1)
                                      .split("")
                                      .reverse()
                                      .join("")
                                      .split("")
                                      .map((val, i) => (
                                        <div key={i} className="relative h-fit w-fit">
                                          <svg
                                            viewBox="0 0 32 32"
                                            color="text"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-12 shadow-xl md:w-16"
                                          >
                                            <circle
                                              cx="16"
                                              cy="16"
                                              r="16"
                                              fill={generateColorHash(i ** 2 + 1)}
                                            />
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M24.343 3.132c4.576 5.74 4.208 14.125-1.106 19.439-5.709 5.709-14.966 5.709-20.675 0q-.42-.42-.798-.864C4.028 27.349 9.55 31.333 16 31.333c8.468 0 15.333-6.865 15.333-15.334 0-5.391-2.783-10.133-6.99-12.867"
                                              opacity=".1"
                                              style={{
                                                mixBlendMode: "multiply",
                                              }}
                                            />
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M25.771 4.183c4.86 6.029 4.49 14.878-1.11 20.478s-14.448 5.97-20.477 1.111A15.3 15.3 0 0 0 16 31.332c8.468 0 15.333-6.864 15.333-15.332a15.3 15.3 0 0 0-5.562-11.817"
                                              opacity=".1"
                                              style={{
                                                mixBlendMode: "multiply",
                                              }}
                                            />
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M3.49 24.868C.15 18.765.975 11.064 6.02 6.019 11.063.975 18.765.151 24.868 3.49A15.26 15.26 0 0 0 16 .667C7.532.667.667 7.532.667 16c0 3.304 1.045 6.364 2.823 8.868"
                                              fill="#fff"
                                              style={{
                                                mixBlendMode: "soft-light",
                                              }}
                                            />
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M2.1 9.514a15.4 15.4 0 0 1 8.392-7.83q.081.072.158.15c1.834 1.833.262 3.91-1.989 6.16-2.25 2.251-4.327 3.823-6.16 1.99a4 4 0 0 1-.4-.47"
                                              fill="#fff"
                                              style={{
                                                mixBlendMode: "soft-light",
                                              }}
                                            />
                                          </svg>
                                          <div className="absolute text-3xl font-bold rotate-6 top-1.5 md:top-3 text-cyan-50 left-1/3">
                                            {val}
                                          </div>
                                        </div>
                                      ))
                                  }
                                </div>
                                {
                                  Number(amtTicketInRound) > 0 && (
                                    <div className="grid text-sm md:gap-5 md:grid-flow-col items-center px-5">
                                      {/* <div className="py-0.5 font-bold text-base">
                                        Your Tickets:
                                      </div> */}
                                      <div className="grid gap-2 my-2 justify-center items-center">
                                        <div className="space-x-1">
                                          <span>You have</span>
                                          <span
                                            children={amtTicketInRound}
                                            className="text-cyan-50 w-32 text-sm font-semibold"
                                          />
                                          <span>ticket(s) in this round</span>
                                        </div>

                                        <button
                                          onClick={() => setMyTicket2ModalOpen(true)}
                                          className="text-xs font-bold text-center duration-500 hover:text-cyan-500 outline-none text-cyan-300"
                                          children={"View your tickets"}
                                        />
                                      </div>

                                      {/* <button
                                        // disabled={!(Number(latestRoundInfo.endTime) > Date.now())}
                                        onClick={() => setBuyModalOpen(true)}
                                        className="px-4 py-2 my-2 text-sm font-semibold text-center duration-500 border border-dotted outline-none hover:rounded-xl rounded-tr-xl rounded-bl-xl bg-cyan-100/90 text-cyan-900 hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Buy Tickets
                                      </button> */}
                                    </div>
                                  )
                                }
                              </div>
                          }
                          {roundNo === lastRound && (
                            <div className="absolute px-2 py-1 text-xs font-semibold tracking-wide uppercase rotate-[30deg] -right-6 -top-5 text-cyan-900/80 w-fit bg-cyan-50 h-fit rounded-3xl">
                              Latest
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {
                      isConnected && (
                        <div className="justify-center grid mb-4">
                          <button disabled={Object.entries(winningTicketsInRound).length < 1 || loadingRound || isClaimLoading ||isBuyLoading} className="grid gap-1.5 grid-flow-col items-center px-4 py-2 my-2 text-xs font-semibold text-center duration-500 border border-dotted outline-none hover:rounded-xl rounded-tr-xl rounded-bl-xl bg-cyan-100/90 text-cyan-900 hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleClaimTickets}>{
                            isClaimLoading && (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-cyan-300"/>
                            )
                          } Claim Ticket{Object.entries(winningTicketsInRound).length !== 1 && 's'}</button>
                        </div>
                      )
                    }

                    <hr className="w-4/5 mx-auto line-clamp-1 opacity-15" />

                    {moreR && (
                      <div className="grid grid-cols-1 gap-8 py-5 md:grid-flow-col px-7 bg-cyan-950/50">
                        <div className="grid gap-5">
                          <div className="grid self-start">
                            <div className="self-start text-base font-bold">
                              Prize Pot
                            </div>
                            <div className="text-3xl font-bold text-cyan-200 text-ellipsis truncate">
                              ~${Number(prizeInUSD).toLocaleString()}
                            </div>
                            <div className="text-xs md:self-start">
                              {Number(prizeInXTZ).toLocaleString()} XTZ
                            </div>
                          </div>
                          {/* <div className="text-xs font-bold text-cyan-50">
                            Total Players this round: {312}
                          </div> */}
                        </div>

                        <div className="grid gap-5">
                          <div className="text-xs">
                            Match the winning number in the same order to share
                            prizes. Current prizes up for grabs:
                          </div>
                          <div className="grid justify-between grid-cols-3 gap-5 md:grid-cols-4">
                            {roundInfo?.rewardsBreakdown?.map((val, i) => (
                              <div
                                key={i}
                                className="grid text-sm justify-items-start"
                              >
                                <div className="text-xs font-bold text-cyan-500">
                                  Match First {i + 1}
                                </div>
                                <div className="space-x-2">
                                  <span className="text-base font-semibold">
                                    {(
                                      (Number(val) / 10000) *
                                      Number(
                                        ethers.formatEther(
                                          roundInfo.amountCollectedInMetis
                                        )
                                      )
                                    ).toFixed(3)}
                                  </span>
                                  <span className="text-sm">XTZ</span>
                                </div>
                                <div className="text-xs opacity-85">
                                  {/* ~${val.usd.toLocaleString()} */}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <hr className="w-4/5 mx-auto line-clamp-1 opacity-15" />

                    <div className="grid gap-5 py-5 mx-auto text-center px-7 w-fit">
                      <button
                        onClick={handleAccordionR}
                        className="grid grid-flow-col px-4 py-2 text-sm font-semibold text-center align-middle duration-500 border border-dotted outline-none hover:rounded-xl rounded-tr-xl rounded-bl-xl bg-cyan-100/90 text-cyan-900 hover:bg-cyan-100 group"
                      >
                        <span className="">{moreR ? "Hide" : "Details"}</span>
                        {moreR ? (
                          <FaAngleUp className="my-auto text-xl duration-500 group-hover:py-0.5 justify-self-center" />
                        ) : (
                          <FaAngleDown className="my-auto text-xl duration-500 group-hover:py-0.5 justify-self-center" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {roundHistory === "User" && (
                <>
                  <div className="max-w-3xl shadow min-w-80 rounded-3xl bg-cyan-900/30 backdrop-blur-sm text-cyan-50">
                    <div className="grid py-5 px-7 bg-cyan-950/50 rounded-t-3xl">
                      <div className="grid gap-2">
                        <div className="grid gap-0.5 items-center">
                          <span className="text-xl font-black md:block">
                            Rounds
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isConnected && (
                      <div className="grid gap-2 py-5 text-center px-7">
                        <div className="text-sm">
                          Connect your wallet to check your history!
                        </div>
                        <CustomConnect onChainChange={handleChainChange} />
                      </div>
                    )}

                    {
                      isConnected && (
                        <table className="min-w-full text-cyan-50 text-sm font-semibold mb-5 mt-2">
                          <thead>
                            <tr className="uppercase tracking-wider text-center justify-items-center text-cyan-400 text-[11px]">
                              <th className="py-2 px-4">#</th>
                              <th className="py-2 px-4">Date</th>
                              <th className="py-2 px-4">Your Tickets</th>
                              <th className="py-2 px-4"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {userRoundInfo.map((round) => (
                              <tr key={round.number} className="border-b border-gray-700 text-center">
                                <td className="py-2 px-4">{round.number}</td>
                                <td className="py-2 px-4">{round.date}</td>
                                <td className="py-2 px-4 grid grid-flow-col justify-end items-center text-cyan-500">
                                  <span className="text-cyan-50">{round.tickets}</span>
                                  <span className="scale-50">🔘</span>
                                  <PiCaretRightBold title="View Round Info" onClick={() => {
                                    setRoundNo(round.number);
                                    setRoundHistory("All");
                                  }} className="scale-125 hover:scale-150 duration-500 cursor-pointer" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    }

                    <hr className="w-4/5 mx-auto line-clamp-1 opacity-15" />

                    <div className="grid pt-3 grid-flow-col justify-center gap-1.5 text-xs tracking-wide text-center">
                      The <strong>EVM.bet</strong> Lottery
                    </div>

                    <div className="grid gap-5 mx-auto text-xl font-bold tracking-wide text-center pb-5 w-fit">
                      Tickets on sale soon
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <h1 className="text-3xl font-bold text-center font-cyan text-cyan-500">
                  HOW TO PLAY!
                </h1>

                <div className="text-sm font-semibold text-center">
                  If the digits on your tickets match the winning numbers in the
                  correct order, you win a portion of the prize pool. Simple!
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="p-8 bg-transparent border-b-4 ring-1 ring-cyan-800/50 rounded-3xl backdrop-blur border-cyan-800/80">
                  <div className="grid justify-between grid-flow-col">
                    <div></div>
                    <div className="text-[11px] font-bold">STEP 1</div>
                  </div>
                  <div className="grid gap-3">
                    <h1 className="text-2xl font-bold font-cyan text-cyan-500">
                      Buy Tickets!
                    </h1>
                    <p className="text-sm">
                      Prices are set when the round starts, equal to 5 USD in
                      XTZ per ticket.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-transparent border-b-4 ring-1 ring-cyan-800/50 rounded-3xl backdrop-blur border-cyan-800/80">
                  <div className="grid justify-between grid-flow-col">
                    <div></div>
                    <div className="text-[11px] font-bold">STEP 2</div>
                  </div>
                  <div className="grid gap-3">
                    <h1 className="text-2xl font-bold font-cyan text-cyan-500">
                      Wait for the Draw
                    </h1>
                    <p className="text-sm">
                      There is one draw every day alternating between 0 AM UTC
                      and 12 PM UTC.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-transparent border-b-4 ring-1 ring-cyan-800/50 rounded-3xl backdrop-blur border-cyan-800/80">
                  <div className="grid justify-between grid-flow-col">
                    <div></div>
                    <div className="text-[11px] font-bold">STEP 3</div>
                  </div>
                  <div className="grid gap-3">
                    <h1 className="text-2xl font-bold font-cyan text-cyan-500">
                      Check for Prizes
                    </h1>
                    <p className="text-sm">
                      Once the round’s over, come back to the page and check to
                      see if you’ve won!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="divide-y-2" />

            <div className="grid gap-2 md:grid-cols-12">
              <div className="grid gap-2 md:col-span-9">
                <h1 className="text-xl font-bold font-cyan text-cyan-500">
                  Winning Criteria
                </h1>

                <h3 className="text-base font-semibold">
                  The digits on your ticket must match in the correct order to
                  win.
                </h3>

                <div className="grid gap-2 text-sm">
                  <div className="">
                    Here’s an example lottery draw, with two tickets, A and B.
                  </div>
                  <div className="grid pl-5">
                    <div className="list-item">
                      Ticket A: The first 3 digits and the last 2 digits match,
                      but the 4th digit is wrong, so this ticket only wins a
                      “Match first 3” prize.
                    </div>
                    <div className="list-item">
                      Ticket B: Even though the last 5 digits match, the first
                      digit is wrong, so this ticket doesn’t win a prize.
                    </div>
                  </div>
                  <div className="">
                    Prize brackets don’t ‘stack’: if you match the first 3
                    digits in order, you’ll only win prizes from the ‘Match 3’
                    bracket, and not from ‘Match 1’ and ‘Match 2’.
                  </div>
                </div>
              </div>

              <div className="grid md:col-span-3">
                <img
                  src={TrophyImg}
                  alt={"trophy"}
                  loading="lazy"
                  className="pointer-events-none w-min"
                />
              </div>
            </div>

            <hr className="divide-y-2" />

            <div className="grid gap-2 md:grid-cols-12">
              <div className="grid gap-3 md:col-span-8">
                <h1 className="text-xl font-bold font-cyan text-cyan-500">
                  Prize Funds
                </h1>

                <h3 className="text-base font-semibold">
                  The prizes for each lottery round come from three sources:
                </h3>

                <div className="grid gap-3 text-sm">
                  <div className="grid gap-2">
                    <div className="text-xl font-semibold">
                      Ticket Purchases
                    </div>
                    <div className="ml-5 list-item">
                      100% of the XTZ paid by people buying tickets that round
                      goes back into the prize pools.
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-xl font-semibold">Rollover Prizes</div>
                    <div className="ml-5 list-item">
                      After every round, if nobody wins in one of the prize
                      brackets, the unclaimed XTZ for that bracket rolls over
                      into the next round and are redistributed among the prize
                      pools.
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-xl font-semibold">XTZ Injections</div>
                    <div className="ml-5 list-item">
                      An average total of 35,000 XTZ from the treasury is added
                      to lottery rounds over the course of a week. This XTZ is
                      of course also included in rollovers! Read more in our
                      guide to{" "}
                      <Link to={""} className="text-cyan-400">
                        XTZ Tokenomics
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:col-span-4">
                <img
                  src={TrophyImg}
                  alt={"trophy"}
                  loading="lazy"
                  className="pointer-events-none w-min"
                />
              </div>
            </div>

            <hr className="divide-y-2" />

            <div className="flex items-center max-w-xl gap-2 mx-auto">
              <img
                src={TrophyImg}
                alt={"TrophyImg"}
                loading="lazy"
                className="w-1/2 pointer-events-none"
              />
              <div className="grid gap-2">
                <h2 className="text-lg font-bold tracking-wide">
                  Still got questions?
                </h2>
                <div className="text-sm font-semibold">
                  Check our in-depth guide on{" "}
                  <Link to="" className="text-cyan-500">
                    how to play the EVM.bet lottery!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <Modal
        className="m-auto"
        open={buyModalOpen}
        onCancel={() => {
          setBuyModalOpen(false);
          setEditLot(false);
        }}
        footer={null}
        title={editLot ? "Edit Numbers" : "Buy Tickets"}
      >
        {editLot ? (
          <div>
            <div className="p-5 rounded-md">
              <div className="flex justify-end items-end mb-2 gap-2">
                <div className="font-semibold opacity-70 text-sm mb-0.5">
                  Total cost:
                </div>
                <div className="text-cyan-800 font-semibold text-lg">
                  ~{bulkTicketDiscount} <small>XTZ</small>
                </div>
              </div>
              <div className="text-gray-700 mb-4">
                Numbers are randomized, with no duplicates among your tickets.
                Tap a number to edit it. Available digits: 0-9
              </div>
              <Button
                onClick={randomizeAll}
                className="mb-4 bg-cyan-800 hover:bg-cyan-700 text-white py-2 w-full rounded-md"
              >
                Randomize
              </Button>

              <div className="m-auto max-h-[12em] overflow-y-scroll">
                {invertedDigitsArr.map((digits, arrayIndex) => (
                  <div
                    key={arrayIndex}
                    className="flex space-x-2 my-2 mx-3 items-center justify-center"
                  >
                    {digits.map((digit, digitIndex) => {
                      const originalIndex = digits.length - 1 - digitIndex;
                      return (
                        <Input
                          key={digitIndex}
                          type="text"
                          min={0}
                          max={9}
                          inputMode="numeric"
                          className="w-3/12 border h-fit text-center py-1 rounded-md"
                          value={digit || 0}
                          onChange={(e) =>
                            handleInputChange(
                              arrayIndex,
                              originalIndex,
                              e.target.value
                            )
                          }
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <hr className="my-5 border-b-0.5 border-b-inherit w-1/2 m-auto" />

              <div className="flex flex-col items-center space-y-2">
                <Button
                  onClick={handleBuy}
                  className="bg-cyan-800 text-white py-2 px-4 rounded-md w-full"
                >
                  Confirm and buy
                </Button>
                <Button
                  onClick={() => setEditLot(false)}
                  className="mt-2 flex items-center space-x-1 text-cyan-900 font-semibold group"
                >
                  <span>Go back</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid items-center justify-between grid-flow-col py-2 text-sm px-7">
              <p className="opacity-75"></p>
              <div className="flex items-center justify-end gap-1 text-cyan-800">
                <p className="font-bold">Tickets</p>
                <img
                  className="w-5 pointer-events-none -rotate-12"
                  src="data:image/svg+xml,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20viewBox%3D%220%200%20128%20128%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20aria-hidden%3D%22true%22%20class%3D%22iconify%20iconify--noto%22%3E%3Cpath%20d%3D%22M3.16%2033.47v65.27c0%201.11.9%202.02%202.02%202.02h115.96c1.11%200%202.02-.9%202.02-2.02V33.47c0-1.11-.9-2.02-2.02-2.02H5.18c-1.12%200-2.02.91-2.02%202.02m83.01%2062.81c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.38-.57.7-.94.94m0-16.83c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.37-.57.7-.94.94m0-17.83c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.37-.57.7-.94.94m0-16.83c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.37-.57.7-.94.94%22%20fill%3D%22%23a65f3e%22%2F%3E%3Cpath%20d%3D%22M3.16%2030.47v65.27c0%201.11.9%202.02%202.02%202.02h115.96c1.11%200%202.02-.9%202.02-2.02V30.47c0-1.11-.9-2.02-2.02-2.02H5.18c-1.12%200-2.02.91-2.02%202.02m83.01%2062.81c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.38-.57.7-.94.94m0-16.83c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.37-.57.7-.94.94m0-17.83c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.37-.57.7-.94.94m0-16.83c-5.57%203.57-11.49-2.34-7.91-7.91.24-.38.56-.7.94-.94%205.57-3.57%2011.49%202.34%207.91%207.91-.25.37-.57.7-.94.94%22%20fill%3D%22%23ffd54f%22%2F%3E%3Cpath%20d%3D%22M15.06%2051.03h32.56M15.06%2066.51h23.07m15.96%200h4.84%22%20opacity%3D%22.8%22%20fill%3D%22none%22%20stroke%3D%22%234e342e%22%20stroke-width%3D%228%22%20stroke-linecap%3D%22round%22%20stroke-miterlimit%3D%2210%22%2F%3E%3Cpath%20d%3D%22M13.56%2080.46h3v9.3h-3zm25.15%200h3v9.3h-3zm5.44%200h3v9.3h-3zm-24.68%200h6v9.3h-6zm30.19%200h7v9.3h-7zm-21.52%200h8v9.3h-8z%22%20opacity%3D%22.5%22%20fill%3D%22%236d4c41%22%2F%3E%3Cpath%20d%3D%22M122.04%2028.45H4.27c-.62%200-1.11.5-1.11%201.11v9.96h74.45c-.72-1.67-.64-3.77.76-5.82.19-.28.44-.53.72-.72%204.42-2.93%209.1.17%209.1%204.36%200%20.77-.16%201.51-.45%202.17h35.41v-9.96c.01-.6-.49-1.1-1.11-1.1%22%20fill%3D%22%23e2a610%22%2F%3E%3Cpath%20opacity%3D%22.5%22%20fill%3D%22%236d4c41%22%20d%3D%22M97.81%2048.68h18.23v16.69H97.81z%22%2F%3E%3Cpath%20opacity%3D%22.8%22%20fill%3D%22none%22%20stroke%3D%22%234e342e%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-miterlimit%3D%2210%22%20d%3D%22M98.98%2074.14h9.07m-9.07%206.32h14.28%22%2F%3E%3C%2Fsvg%3E"
                  alt="ticket"
                />
              </div>
            </div>

            <div className="grid gap-1 px-5">
              <div className="border-2 group-focus:border-4 border-cyan-400 rounded-2xl p-5 grid gap-0.5 justify-items-end">
                <input
                  type="text"
                  autoFocus
                  className="w-full px-1 text-2xl truncate border-none outline-none caret-cyan-700 text-ellipsis text-end"
                  placeholder="0"
                  value={amtTicket}
                  onChange={(event) => {
                    const newValue = event.target.value;
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      if (Number(newValue) <= 100) {
                        setamtTicket(newValue);
                      } else {
                        setamtTicket("100");
                      }
                    }
                  }}
                  pattern="\d*\.?\d*"
                  inputMode="decimal"
                />
                <span className="text-xs">~{bulkTicketDiscount} XTZ</span>
              </div>
              <div className="px-2 text-xs text-end opacity-90 text-cyan-950">
                XTZ Balance:{" "}
                <span className="font-bold">
                  {Number(baseBalance).toLocaleString()}
                </span>
              </div>
              {Number(baseBalance) < Number(bulkTicketDiscount) && (
                <div className="px-2 mb-2 -mt-0.5 text-xs italic text-orange-600 text-end">
                  {`Insufficient ${"XTZ"} Balance`}
                </div>
              )}

              <div className="flex justify-between gap-2 px-3 text-sm">
                <button
                  className="w-full rounded-xl bg-cyan-500 text-cyan-200 py-0.5 px-5 hover:opacity-90 duration-500 hover:text-cyan-50"
                  onClick={() => setamtTicket("1")}
                >
                  1
                </button>
                <button className="w-full rounded-xl bg-cyan-500 text-cyan-200 py-0.5 px-5 hover:opacity-90 duration-500 hover:text-cyan-50">
                  Max
                </button>
              </div>

              <div className="grid items-center justify-between grid-flow-col px-3 text-sm opacity-75">
                <p className="text-sm">Cost (XTZ)</p>
                <p className="uppercase">
                  {purchaceCost || 0} <span className="text-xs">XTZ</span>
                </p>
              </div>

              <div className="grid items-center justify-between grid-flow-col px-3 text-sm opacity-75">
                <div className="flex items-center gap-1 text-sm w-fit">
                  <strong>{discountPercentage || 0}%</strong>{" "}
                  <span className="flex items-center gap-1 text-xs w-fit">
                    Bulk discount
                  </span>
                </div>
                <p className="uppercase">
                  ~{discountXTZ || 0} <span className="text-xs">XTZ</span>
                </p>
              </div>

              <div className="grid items-center justify-between grid-flow-col px-3 mt-2 text-sm opacity-75">
                <div className="flex items-center gap-1 text-sm w-fit">
                  You pay
                </div>
                <p className="font-bold uppercase opacity-95">
                  ~{bulkTicketDiscount}{" "}
                  <span className="text-xs font-normal">XTZ</span>
                </p>
              </div>

              {isConnected ? (
                <div className="grid gap-2 pt-5 text-sm">
                  <button
                    onClick={handleBuy}
                    className={`${(amtTicket === "" ||
                      Number(amtTicket) === 0 ||
                      isBuyLoading) &&
                      "opacity-50"
                      } bg-cyan-800 hover:bg-cyan-700 duration-500 text-cyan-100 px-4 py-2.5 rounded-xl w-full flex justify-between`}
                    disabled={
                      amtTicket === "" ||
                      Number(amtTicket) === 0 ||
                      isBuyLoading
                    }
                  >
                    <div className="w-full">{mainButtonText}</div>
                    <div
                      className={`${isBuyLoading
                        ? "my-auto border border-x-cyan-700 w-5 h-5 rounded-full animate-spin"
                        : "hidden"
                        }`}
                    />
                  </button>
                  <button
                    className={`${(amtTicket === "" ||
                      Number(amtTicket) === 0 ||
                      isBuyLoading) &&
                      "opacity-50"
                      } bg-cyan-800 items-center hover:bg-cyan-700 duration-500 text-cyan-100 px-4 py-2.5 rounded-xl w-full flex justify-between`}
                    disabled={
                      amtTicket === "" ||
                      Number(amtTicket) === 0 ||
                      isBuyLoading
                    }
                    onClick={() => setEditLot(true)}
                  >
                    <div className="w-full">View/Edit Numbers</div>
                  </button>
                </div>
              ) : (
                <div className="grid mx-2 mt-2 justify-items-center">
                  <CustomConnect />
                </div>
              )}

              <p className="pt-3 -mb-1 text-xs text-center select-none opacity-90">
                "Buy Instantly" chooses random numbers, with no duplicates among
                your tickets. Prices are set before each round starts, equal to
                $5 at that time. Purchases are final.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        className="m-auto select-none"
        open={myTicketModalOpen}
        onCancel={() => {
          setMyTicketModalOpen(false);
        }}
        footer={null}
        title={`Round ${latestRound}`}
      >
        <div>
          <div className="p-5 rounded-md">
            <div className="grid gap-2 mb-4">
              <div className="p-2 font-bold uppercase text-start text-[10px] text-cyan-700" children={"Your Tickets"} />
              <div className="grid grid-flow-col items-center justify-between px-2 font-bold w-full">
                <div className="w-fit flex gap-1 items-center">
                  <TfiTicket />
                  <span>Total Tickets:</span>
                </div>
                <div>{amtTicketInLatestRound}</div>
              </div>
            </div>
            <div className="m-auto max-h-[12em] overflow-y-scroll">
              {Object.entries(ticketNumbersInLatestRound).length > 0 ? ticketNumbersInLatestRound.map((digits, arrayIndex) => (
                <div
                  key={arrayIndex}
                  className="flex space-x-2 my-2 mx-3 items-center justify-center"
                >
                  {digits.map((digit, digitIndex) => {
                    return (
                      <div
                        key={digitIndex}
                        className="w-3/12 border h-fit text-center py-1 rounded-md"
                        children={digit}
                      />
                    );
                  })}
                </div>
              )) : <img src={evmbetLogo} className='w-8 animate-spin m-auto' />
              }
            </div>

            <hr className="my-5 border-b-0.5 border-b-inherit w-1/2 m-auto" />

            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => {
                  setBuyModalOpen(true);
                  setMyTicketModalOpen(false);
                }}
                className="bg-cyan-800 hover:bg-cyan-900 duration-500 text-white py-2 px-4 rounded-md w-full"
              >
                Buy Ticket
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        className="m-auto select-none"
        open={myTicket2ModalOpen}
        onCancel={() => {
          setMyTicket2ModalOpen(false);
        }}
        footer={null}
        title={`Round ${roundNo}`}
      >
        <div>
          <div className="p-5 rounded-md">
            <div className="border-b-2 border-dashed py-4 pt-2 mb-2">
              <div className="p-2 font-bold uppercase text-start text-[10px] text-cyan-700" children={"Winning Number"} />
              <div className="grid gap-2 grid-flow-col">
                {
                  Number(latestRoundInfo.finalNumber)
                    .toString()
                    .substring(1)
                    .split("")
                    .reverse()
                    .join("")
                    .split("")
                    .map((val, i) => (
                      <div key={i} className="relative h-fit w-fit">
                        <svg
                          viewBox="0 0 32 32"
                          color="text"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 md:w-16"
                        >
                          <circle
                            cx="16"
                            cy="16"
                            r="16"
                            fill={generateColorHash(i ** 2 + 1)}
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M24.343 3.132c4.576 5.74 4.208 14.125-1.106 19.439-5.709 5.709-14.966 5.709-20.675 0q-.42-.42-.798-.864C4.028 27.349 9.55 31.333 16 31.333c8.468 0 15.333-6.865 15.333-15.334 0-5.391-2.783-10.133-6.99-12.867"
                            opacity=".1"
                            style={{
                              mixBlendMode: "multiply",
                            }}
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M25.771 4.183c4.86 6.029 4.49 14.878-1.11 20.478s-14.448 5.97-20.477 1.111A15.3 15.3 0 0 0 16 31.332c8.468 0 15.333-6.864 15.333-15.332a15.3 15.3 0 0 0-5.562-11.817"
                            opacity=".1"
                            style={{
                              mixBlendMode: "multiply",
                            }}
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.49 24.868C.15 18.765.975 11.064 6.02 6.019 11.063.975 18.765.151 24.868 3.49A15.26 15.26 0 0 0 16 .667C7.532.667.667 7.532.667 16c0 3.304 1.045 6.364 2.823 8.868"
                            fill="#fff"
                            style={{
                              mixBlendMode: "soft-light",
                            }}
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.1 9.514a15.4 15.4 0 0 1 8.392-7.83q.081.072.158.15c1.834 1.833.262 3.91-1.989 6.16-2.25 2.251-4.327 3.823-6.16 1.99a4 4 0 0 1-.4-.47"
                            fill="#fff"
                            style={{
                              mixBlendMode: "soft-light",
                            }}
                          />
                        </svg>
                        <div className="absolute text-3xl font-bold rotate-6 top-1.5 md:top-3 text-cyan-50 left-1/3">
                          {val}
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
            <div className="grid gap-2 mb-4">
              <div className="p-2 font-bold uppercase text-start text-[10px] text-cyan-700" children={"Your Tickets"} />
              <div className="grid grid-flow-col items-center justify-between px-2 font-bold w-full">
                <div className="w-fit flex gap-1 items-center">
                  <TfiTicket />
                  <span>Total Tickets:</span>
                </div>
                <div>{amtTicketInRound}</div>
              </div>
              <div className="grid grid-flow-col items-center justify-between px-2 font-bold w-full">
                <div className="w-fit flex gap-1 items-center">
                  <TfiTicket />
                  <span>Winning Tickets:</span>
                </div>
                <div>{Object.entries(winningTicketsInRound).length}</div>
              </div>
            </div>
            <div className="m-auto max-h-[12em] overflow-y-scroll">
              {ticketNumbersInRound.map((digits, arrayIndex) => (
                <div
                  key={arrayIndex}
                  className="flex space-x-2 my-2 mx-3 items-center justify-center"
                >
                  {digits.map((digit, digitIndex) => {
                    return (
                      <div
                        key={digitIndex}
                        className="w-3/12 border h-fit text-center py-1 rounded-md"
                        children={digit}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <hr className="my-5 border-b-0.5 border-b-inherit w-1/2 m-auto" />

            {
              Object.entries(winningTicketsInRound).length < 1 ? (
                <Tooltip color={"#155E75"} placement="topLeft" title={
                  <div className="p-5 grid gap-2">
                    <div>Tickets must match the winning number in the exact same order, starting from the first digit.</div>
                    <div>If the winning number is "123456":</div>
                    <div>"120000" matches the first 2 digits.</div>
                    <div>"000006" mathces the last digit, but since the first five digits are wrong, it doesn't win any prizes.</div>
                  </div>
                }>
                  <div className="w-fit px-5 text-sm mx-auto mt-3 -mb-2 grid grid-flow-col justify-center items-center gap-2 font-bold text-cyan-800 hover:opacity-70 duration-500">
                    <RiErrorWarningLine />
                    <button
                      className="underline underline-offset-2"
                    >
                      Why didn't I win?
                    </button>
                  </div>
                </Tooltip>
              ) : (
                <div className="w-fit px-5 text-sm mx-auto mt-3 -mb-2 grid grid-flow-col justify-center items-center gap-2 font-bold text-cyan-800 hover:opacity-70 duration-500">
                  <RiCheckFill />
                  <span
                    className=""
                  >
                    Congratulations!
                  </span>
                </div>
              )
            }
          </div>
        </div>
      </Modal>

      <Modal
        open={isReceiptModalOpen}
        onCancel={() => {
          setIsReceiptModalOpen(false);
          setReceipt({
            hash: "",
            status: false,
          });
        }}
        title={"Transaction Receipt"}
      >
        <div className="grid text-gray-800 gap-y-5">
          {txReceipt.status === false ? (
            <div className="grid items-center gap-5 mx-auto select-none">
              <TiWarning className="p-1 mx-auto text-5xl text-white duration-500 bg-orange-700 rounded-xl" />
              <div className="text-sm">Transaction failed!</div>
            </div>
          ) : (
            <div className="grid items-center gap-5 mx-auto select-none">
              <TiTick className="p-1 mx-auto text-5xl text-white duration-500 rounded-xl bg-emerald-700" />
              <div className="text-sm">Transaction successful!</div>
            </div>
          )}
          <a
            href={`${chain?.blockExplorers?.etherscan?.url}tx/${txReceipt.hash}`}
            target="_blank"
            className="flex items-center gap-2 mx-auto text-center duration-500 w-fit hover:text-emerald-700 hover:underline underline-offset-4"
            title="Transaction Hash"
          >
            <span>View Hash</span>
            <TiLinkOutline className="text-2xl" />
            <span>{shortenAddress(txReceipt.hash)}</span>
          </a>
        </div>
      </Modal>
    </>
  );
};

export default Trophy;

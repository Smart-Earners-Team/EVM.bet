import { useAccount, useChainId, useConfig, useSwitchChain } from "wagmi";
import { useEffect, useState } from "react";
import Head from "react-helmet";
import { Layout } from "../components/Layout";
import { CustomConnect, OnChainChange } from "../components/Wallet/Connect";
import { getLeaderboard, getUserBonus, TopUser } from "../hooks/getDetails";
import { findCompatibleRPC } from "../hooks/checkRPC";
import { defaultRPCs } from "../wrappers/rainbowkit";
import { shortenAddress } from "../hooks/shortenAddress";

const evmbetLogo = "/logo.png";

const Dashboard = () => {
  const { address, /* chain, */ isConnected } = useAccount();

  const config = useConfig();
  const chains = config.chains;
  const chainId = useChainId();

  const { switchChainAsync } = useSwitchChain();

  const [isUnsupportedChain, setIsUnsupportedChain] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChainChange: OnChainChange = (chain: any) => {
    setIsUnsupportedChain(chain.unsupported);
  };

  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [directReferrals, setDirectReferrals] = useState<number>(0);
  const [teamSize, setTeamSize] = useState<number>(0);
  const [todaysPoints, setTodaysPoints] = useState<number>(0);
  const [leaderBoard, setLeaderBoard] = useState<TopUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userBonus = await getUserBonus(
        String(address),
        chainId,
        await findCompatibleRPC(defaultRPCs, chainId)
      );

      const leaderB = await getLeaderboard(
        chainId,
        await findCompatibleRPC(defaultRPCs, chainId)
      );

      // console.log(leaderB);
      // console.log(userBonus);
      setLeaderBoard(leaderB.slice(0, 20));

      setTotalPoints(userBonus.totalPoints);
      setDirectReferrals(userBonus.directReferrals);
      setTeamSize(userBonus.teamSize);
      setTodaysPoints(userBonus.todaysPoints);
    };
    // fetchData();
    const intervalId = setInterval(fetchData, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isConnected, address, chainId]);

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
        <title>Dashboard | EVM.bet &copy;</title>
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <div>
          <div className="min-h-screen mx-auto">
            <div className="animate-fade-in-bottom">
              {isConnected ? (
                <div className="space-y-4 md:space-y-2">
                  <div className="flex flex-wrap justify-center gap-5">
                    <div className="grid w-40 p-5 text-center border border-dashed rounded-sm shadow gap-y-2">
                      <span>Total Points</span>
                      <div className="flex mx-auto w-fit gap-x-1">
                        <span className="text-xl font-bold">
                          {totalPoints / 100}
                        </span>
                      </div>
                    </div>
                    <div className="grid w-40 p-5 text-center border border-dashed rounded-sm shadow gap-y-2">
                      <span>Direct Referrals</span>
                      <div className="flex mx-auto w-fit gap-x-1">
                        <span className="text-xl font-bold">
                          {directReferrals}
                        </span>
                      </div>
                    </div>
                    <div className="grid w-40 p-5 text-center border border-dashed rounded-sm shadow gap-y-2">
                      <span>Team Size</span>
                      <div className="flex mx-auto w-fit gap-x-1">
                        <span className="text-xl font-bold">{teamSize}</span>
                      </div>
                    </div>
                    <div className="grid w-40 p-5 text-center border border-dashed rounded-sm shadow gap-y-2">
                      <span>Today's Points</span>
                      <div className="flex mx-auto w-fit gap-x-1">
                        <span className="text-xl font-bold">
                          {todaysPoints / 100}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`grid self-center place-items-center gap-2 p-8 text-center shadow w-5xl border-2 border-dashed border-cyan-500/50 text-cyan-50 rounded-xl`}
                >
                  <h1 className="text-xl font-bold">
                    Connect your wallet to view your points!
                  </h1>
                  <CustomConnect onChainChange={handleChainChange} />
                </div>
              )}
              {/* Points Breakdown section */}
              <div>
                <div className="flex flex-col gap-6 mt-6 mb-6 sm:mt-16 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center w-full space-x-2 sm:w-2/4">
                    <h2 className="text-base md:text-xl">Points Breakdown</h2>
                  </div>
                </div>

                <div className="gap-y-4 md:gap-y-2">
                  <div className="p-8 text-sm text-black bg-white rounded-sm shadow">
                    <p className="mb-4 font-semibold text-cyan-900 dark:text-cyan-400">
                      Earn Points on Every Ticket
                    </p>
                    <p className="mb-4">
                      Each time you purchase a ticket, you will receive{" "}
                      <span className="font-semibold">1 point</span>. You can
                      earn up to{" "}
                      <span className="font-semibold">
                        20 direct points per game daily
                      </span>
                      , ensuring a fair allocation of rewards.
                    </p>
                    <p className="mb-4 font-semibold text-cyan-900 dark:text-cyan-400">
                      Referral Incentives
                    </p>
                    <div className="mb-4">
                      Sharing is rewarding. When you invite others, you earn:
                      <ul className="pl-5 mb-4 list-disc list-inside">
                        <li>
                          A{" "}
                          <span className="font-semibold">
                            5% bonus from direct referrals
                          </span>
                          .
                        </li>
                        <li>
                          A{" "}
                          <span className="font-semibold">
                            3% bonus from second-level referrals
                          </span>
                          .
                        </li>
                        <li>
                          A{" "}
                          <span className="font-semibold">
                            2% bonus from third-level referrals
                          </span>
                          .
                        </li>
                      </ul>
                    </div>
                    <p className="font-semibold text-cyan-900 dark:text-cyan-400">
                      Unlimited Potential
                    </p>

                    <p>
                      Although there's a limit on the daily points you can earn
                      directly, your potential for referral bonuses is
                      limitless. The more you{" "}
                      <span className="font-semibold">engage</span> and{" "}
                      <span className="font-semibold">share</span>, the more
                      rewards you accumulate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Leaderboard section */}
              <div className="py-5">
                <div className="flex flex-col gap-6 mt-6 mb-6 sm:mt-16 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center w-full space-x-2 sm:w-2/4">
                    <h2 className="text-base md:text-xl">Leaderboard</h2>
                  </div>
                </div>

                <div className="overflow-hidden bg-white rounded-sm shadow">
                  <div className="px-1 py-5 mx-auto overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 select-none">
                      <thead className="select-none">
                        <tr className="whitespace-nowrap">
                          <th
                            scope="col"
                            className="p-3 mx-auto text-xs tracking-wider text-gray-500 uppercase w-fit"
                          >
                            Rank
                          </th>
                          <th
                            scope="col"
                            className="p-3 mx-auto text-xs tracking-wider text-gray-500 uppercase w-fit"
                          >
                            User Address
                          </th>
                          <th
                            scope="col"
                            className="p-3 mx-auto text-xs tracking-wider text-gray-500 uppercase w-fit"
                          >
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-800 border-b border-gray-500 divide-y shadow rounded-xl">
                        {leaderBoard.length > 0 &&
                          leaderBoard.map((val, i) => (
                            <tr
                              key={i}
                              className={`my-auto py-5 ${
                                val.user === String(address)
                                  ? "bg-cyan-800 text-cyan-50"
                                  : "bg-white"
                              }`}
                            >
                              <td className="p-3 text-center whitespace-nowrap">
                                {i + 1}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                {shortenAddress(val.user)}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                {Number(val.points) / 100}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {leaderBoard.length === 0 && (
                      <div className="grid gap-1 p-6 text-center text-gray-500">
                        Nothing here yet!{" "}
                        <span className="text-xs italic animate-pulse">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;

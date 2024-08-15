import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import TrophyImg from "./../assets/trophy.svg";

const evmbetLogo = "/logo.png";

const Landing = () => {
  return (
    <>
      <Layout>
        <div className="max-w-screen-lg mx-auto flex flex-col gap-10 my-6">
          <div className="py-6 relative">
            <h1 className="font-black text-4xl md:text-5xl">EVM.bet Lottery</h1>
            <p className="my-5">
              Playing gives you a chance to win huge ETH prizes! No middleman,
              no KYC, no tampering, no bullsh*t.
            </p>
            <img
              src={evmbetLogo}
              className="absolute p-5 -top-1/2 opacity-5 w-[100rem] z-0"
            />
          </div>

          <div className="grid justify-between md:grid-cols-2 gap-5 select-none">
            {cardProps.map((item, i) => (
              <div key={i} className="grid place-items-center">
                <div className="-mb-5 z-10 grid place-items-center p-5 rounded-full btn-bg backdrop-blur-sm">
                  <img
                    src={item.src}
                    width={150}
                    alt={item.name}
                    loading="lazy"
                    className="pointer-events-none"
                  />
                </div>

                <div className="bg text-blue-50 backdrop-blur rounded-b-xl rounded-t-[30%] p-8 grid gap-2 place-items-center shadow-xl">
                  <div className="font-bold text-lg">{item.name}</div>

                  <div className="font-sans text-sm">{item.desc}</div>

                  <Link
                    to={item.route}
                    className={`uppercase font-semibold animate-bounce delay-[${
                      i * 1000
                    }ms] text-sm text-blue-100 mt-5`}
                  >
                    Play Now!
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Landing;

const cardProps = [
  {
    name: "Trophy",
    src: TrophyImg,
    route: "/trophy",
    desc: `Match the Numbers, Claim the Trophy – Your Big Win Awaits! It's easy, fair, and you can enter as often as you like.`,
  },
];

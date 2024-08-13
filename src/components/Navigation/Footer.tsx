import { FaTwitter, /* FaGithub */ } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    // const evmbetLogo = "/logo.png"

  return (
    <div className="grid gap-3 px-5">
      <div className="justify-center md:justify-between grid md:flex mx-5 md:mr-32 py-5 gap-3 z-0">
        <div className="flex text-xs">
          &copy; All Rights Reserved | EVM.bet {currentYear}
        </div>
        <div className="flex gap-x-3 text-3xl justify-center">
          <a
            className="hover:scale-150 hover:text-cyan-300 duration-500"
            href="https://x.com/evmgames"
            target="_blank"
          >
            <FaTwitter />
          </a>
          {/* <a
            className="hover:scale-150 hover:text-cyan-300 duration-500"
            href="https://github.com/Smart-Earners-Team/EVM.bet/"
            target="_blank"
          >
            <FaGithub />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
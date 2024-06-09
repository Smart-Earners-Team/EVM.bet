import { FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const evmbetLogo = "/logo.png"

  return (
    <div className="grid gap-3 px-5">
      <div className="justify-center md:justify-between grid md:flex mx-5 md:mr-32 py-5 gap-3">
        <div className="flex text-xs">
          &copy; All Rights Reserved | EVM.bet {currentYear}
        </div>
        <div className="flex gap-x-3 text-3xl justify-center">
          <a
            className="hover:scale-150 hover:text-gradient duration-500"
            href="https://x.com/evmgames"
            target="_blank"
          >
            <FaTwitter />
          </a>
          {/* <a
            className="hover:scale-150 hover:text-gradient duration-500"
            // href=""
            target="_blank"
          >
            <FaDiscord />
          </a> */}
          <a
            className="hover:scale-150 hover:text-gradient duration-500"
            href="https://github.com/"
            target="_blank"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
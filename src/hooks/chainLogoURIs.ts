import bscLogo from "./../assets/images/bscLogo.png";
import zetaChainLogo from "./../assets/svgs/zetachain/greenLogoOnly.svg";

type TURL = {
  [key: number]: string; // This is the string index signature
};

export const chainLogoURLs: TURL = {
  1: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  5: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  56: bscLogo,
  97: bscLogo,
  7000: zetaChainLogo,
  7001: zetaChainLogo,
  18332:
    "data:image/svg+xml,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%20-0.125%208.5%208.5%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M8.313%204.032a4.032%204.032%200%201%201-8.064%200%204.032%204.032%200%200%201%208.064%200ZM5.25%202.534c.561.193.971.481.891%201.018-.059.393-.277.583-.568.65.399.207.534.599.408%201.073-.24.682-.809.74-1.567.598l-.184.734-.444-.111.181-.724a31.54%2031.54%200%200%201-.354-.091l-.182.728-.444-.11.184-.736-.895-.225.221-.506s.328.086.323.08c.126.031.182-.051.204-.105l.498-1.992c.006-.094-.027-.212-.207-.258a5.647%205.647%200%200%200-.323-.08l.118-.472.896.221.182-.727.444.111-.178.713c.119.027.239.054.356.084l.177-.708.444.11-.182.728ZM4.187%203.747c.302.08.961.255%201.076-.203.117-.469-.522-.61-.836-.679l-.092-.021-.221.884.073.019ZM3.844%205.17c.362.096%201.155.304%201.281-.2.129-.516-.639-.688-1.014-.771l-.109-.025-.244.974.086.022Z%22%20fill%3D%22%23F7931A%22%2F%3E%3C%2Fsvg%3E",
  80001: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
};

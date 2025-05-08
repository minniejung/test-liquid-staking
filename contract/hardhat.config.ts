import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545", // Todo: Ganache RPC URL
      accounts: [process.env.PRIVATE_KEY_GANACHE || ""],
    },
    // kaia: {
    //   url: "https://public-en-kairos.node.kaia.io",
    //   accounts: [
    //     process.env.PRIVATE_KEY || "", // Todo: Kairos에서 제공하는 프라이빗 키 사용(.env 파일을 사용합니다)
    //   ],
    // },
  },
};

export default config;

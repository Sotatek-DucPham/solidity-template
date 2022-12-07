import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import { readdirSync } from "fs";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { join, resolve } from "path";
import "solidity-coverage";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// init typechain for the first time
try {
  readdirSync(join(__dirname, "typechain"));
  require("./tasks");
} catch {
  //
}

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  goerli: 5,
  chapel: 97,
  sepolia: 11155111,
};

// Ensure that we have all the environment variables we need.
const deployerPrivateKey: string | undefined = process.env.DEPLOYER_PRIVATE_KEY;
if (!deployerPrivateKey) {
  throw new Error("Please set your DEPLOYER_PRIVATE_KEY in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    case "chapel":
      jsonRpcUrl = "https://data-seed-prebsc-1-s3.binance.org:8545";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
  }

  return {
    accounts: [`0x${deployerPrivateKey}`],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
    goerli: getChainConfig("goerli"),
    sepolia: getChainConfig("sepolia"),
    chapel: getChainConfig("chapel"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./deployments/migrations",
    deployments: "./deployments/artifacts",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;

require("@nomiclabs/hardhat-waffle");
const PRIVATE_KEY =
  "dfb16812a6d2dd995a1969c0de2ac9600f4f680f115bcbd27608a32c95da649c";

module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/829f7524e1374c809c3974c7e010084f",
      accounts: [PRIVATE_KEY],
    },
  },
};

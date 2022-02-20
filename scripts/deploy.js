const hre = require("hardhat");
const fs = require("fs");

const main = async () => {
  const Social = await hre.ethers.getContractFactory("Social");
  const social = await Social.deploy();
  await social.deployed();
  console.log("Social deployed: ", social.address);

  fs.writeFileSync(
    "./config.js",
    `
    export const contractAddress = "${social.address}";
    export const ownerAddress = "${social.signer.address}"
    `
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

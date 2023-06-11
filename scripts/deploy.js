const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("NFTMarketplace deployed to:", "nftMarketplace.address");
  console.log("Check on Etherscan: https://sepholia.etherscan.io/address/" + nftMarketplace.address)
  //Pull the address and ABI out while you deploy, since that will be key in interacting with the smart contract later
  const data = {
    address: nftMarketplace.address,
    abi: JSON.parse(nftMarketplace.interface.format('json'))
  }

  //This writes the ABI and address to the marketplace.json
  //This data is then used by frontend files to connect with the smart contract
  fs.writeFileSync('./frontend/src/contracts/marketplace.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
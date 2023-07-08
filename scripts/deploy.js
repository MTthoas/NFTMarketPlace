const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NFTContract
  const NFTContract = await ethers.getContractFactory("NFTContract");
  const nftContract = await NFTContract.deploy();
  await nftContract.deployed();
  console.log("NFTContract deployed to:", nftContract.address);

  // Deploy AuctionContract
  const AuctionContract = await ethers.getContractFactory("AuctionContract");
  const auctionContract = await AuctionContract.deploy(nftContract.address);
  await auctionContract.deployed();
  console.log("AuctionContract deployed to:", auctionContract.address);

  // Deploy SaleContract
  const SaleContract = await ethers.getContractFactory("SaleContract");
  const saleContract = await SaleContract.deploy(nftContract.address);
  await saleContract.deployed();
  console.log("SaleContract deployed to:", saleContract.address);

  //Save the Contract addresses and ABI to a json file in the client directory
  const data = {
    nftContract: {
      address: nftContract.address,
      abi: JSON.parse(nftContract.interface.format('json'))
    },
    auctionContract: {
      address: auctionContract.address,
      abi: JSON.parse(auctionContract.interface.format('json'))
    },
    saleContract: {
      address: saleContract.address,
      abi: JSON.parse(saleContract.interface.format('json'))
    }
  }

  fs.writeFileSync('./frontend/src/contracts/contracts.json', JSON.stringify(data));

  console.log('Successfully wrote contract addresses and ABIs to contracts.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

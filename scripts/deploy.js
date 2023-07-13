// deploy.js
const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

    // Deploy MyNFT contract
    const MyNFT = await ethers.getContractFactory('MyNFT');
    const myNFT = await MyNFT.deploy();
    console.log(`MyNFT contract address: ${myNFT.address}`);

    // Deploy NFTMarket contract
    const NFTMarket = await ethers.getContractFactory('NFTMarket');
    const nftMarket = await NFTMarket.deploy(myNFT.address);
    console.log(`NFTMarket contract address: ${nftMarket.address}`);

    // Verify that the NFTMarket contract has the correct NFT contract address
    console.log(`MyNFT contract address in NFTMarket contract: ${await nftMarket.nft()}`);

    // Prepare contract data
    const data = {
        MyNFT: {
            address: myNFT.address,
            abi: JSON.parse(myNFT.interface.format('json')),
        },
        NFTMarket: {
            address: nftMarket.address,
            abi: JSON.parse(nftMarket.interface.format('json')),
        },
    };

    // Write contract data to file
    const path = './frontend/src/contracts/contracts.json';
    const path2 = './backend/src/contracts/contracts.json';

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    fs.writeFileSync(path2, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote contract addresses and ABIs to ${path}`);
    console.log(`Successfully wrote contract addresses and ABIs to ${path2}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

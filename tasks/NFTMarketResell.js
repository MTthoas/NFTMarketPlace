// tasks.js
const { task } = require("hardhat/config");

task("list-sale", "Lists an NFT for sale")
  .addParam("contract", "The address of the NFTMarketResell contract")
  .addParam("tokenid", "The id of the token to list")
  .addParam("price", "The price to list the token at")
  .setAction(async taskArgs => {
    const contractAddr = taskArgs.contract;
    const tokenId = taskArgs.tokenid;
    const price = taskArgs.price;
    const NFTMarketResell = await ethers.getContractFactory("NFTMarketResell");
    const accounts = await ethers.getSigners();
    const signer = accounts[0];
    const nftMarketResellContract = new ethers.Contract(contractAddr, NFTMarketResell.interface, signer);
    const result = await nftMarketResellContract.listSale(tokenId, price, { value: ethers.utils.parseEther("0.0025") });
    console.log("NFT listed for sale with the following details:");
    console.log(`Token Id: ${tokenId}`);
    console.log(`Price: ${price}`);
    console.log(`Transaction: ${result.hash}`);
});

// Other tasks can be similarly defined for 'buyNft', 'cancelSale', etc.

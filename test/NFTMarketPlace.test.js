// SPDX-License-Identifier: UNLICENSED
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { waffle } = require("hardhat");
const { deployContract } = waffle;

const NFTContract = require("../artifacts/contracts/NFTContract.sol/NFTContract.json");
const AuctionContract = require("../artifacts/contracts/AuctionContract.sol/AuctionContract.json");
const SaleContract = require("../artifacts/contracts/SaleContract.sol/SaleContract.json");

describe("NFTMarketplace", function () {
  let nftContract;
  let auctionContract;
  let saleContract;
  let deployer;
  let user1;
  let user2;

  const tokenURI = "https://example.com/nft";
  const listPrice = ethers.utils.parseEther("0.01");
  const startingPrice = ethers.utils.parseEther("0.1");
  const auctionDuration = 60; // 1 minute
  const nftPrice = ethers.utils.parseEther("0.5");

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    nftContract = await deployContract(deployer, NFTContract);
    auctionContract = await deployContract(deployer, AuctionContract, [nftContract.address]);
    saleContract = await deployContract(deployer, SaleContract, [nftContract.address]);

    await nftContract.updateListPrice(listPrice);
  });

  it("should create a token and list it for sale", async function () {
    await nftContract.createToken(tokenURI, nftPrice);

    const tokenId = await nftContract.getCurrentToken();

    const listedToken = await nftContract.getListedTokenForId(tokenId);
    expect(listedToken.currentlyListed).to.be.false;

    await nftContract.listTokenForSale(tokenId, nftPrice);

    const listedTokenAfterListing = await nftContract.getListedTokenForId(tokenId);
    expect(listedTokenAfterListing.currentlyListed).to.be.true;
    expect(listedTokenAfterListing.price).to.equal(nftPrice);
  });

  it("should unlist a token", async function () {
    await nftContract.createToken(tokenURI, nftPrice);
    const tokenId = await nftContract.getCurrentToken();

    await nftContract.listTokenForSale(tokenId, nftPrice);

    const listedTokenBeforeUnlisting = await nftContract.getListedTokenForId(tokenId);
    expect(listedTokenBeforeUnlisting.currentlyListed).to.be.true;

    await nftContract.unlistTokenForSale(tokenId);

    const listedTokenAfterUnlisting = await nftContract.getListedTokenForId(tokenId);
    expect(listedTokenAfterUnlisting.currentlyListed).to.be.false;
    expect(listedTokenAfterUnlisting.price).to.equal(0);
  });

  it("should start an auction for a token", async function () {
    await nftContract.createToken(tokenURI, nftPrice);
    const tokenId = await nftContract.getCurrentToken();

    await auctionContract.startAuction(tokenId, startingPrice, auctionDuration);

    const auction = await auctionContract.auctions(tokenId);
    expect(auction.isActive).to.be.true;
    expect(auction.startingPrice).to.equal(startingPrice);
    expect(auction.endTime).to.be.above(0);
  });

  it("should place a bid on an auction", async function () {
    await nftContract.createToken(tokenURI, nftPrice);
    const tokenId = await nftContract.getCurrentToken();

    await auctionContract.startAuction(tokenId, startingPrice, auctionDuration);

    const auction = await auctionContract.auctions(tokenId);
    expect(auction.isActive).to.be.true;

    const bidder = user1;
    const bidAmount = ethers.utils.parseEther("0.2");

    await expect(auctionContract.connect(bidder).bid(tokenId, { value: bidAmount, gasLimit: 3000000 }))
      .to.emit(auctionContract, "HighestBidIncreased")
      .withArgs(bidder.address, bidAmount);

    const updatedAuction = await auctionContract.auctions(tokenId);
    expect(updatedAuction.highestBidder).to.equal(bidder.address);
    expect(updatedAuction.highestBid).to.equal(bidAmount);
  });

  it("should end an auction and distribute funds", async function () {
    const tokenId = 1;
    const startingPrice = ethers.utils.parseEther("0.1");
    const auctionDuration = 60; // 1 minute
  
    // Créer un token et démarrer une enchère
    await nftContract.createToken(tokenURI, nftPrice);
    await auctionContract.startAuction(tokenId, startingPrice, auctionDuration);
  
    // Faire une offre sur l'enchère
    const bidder = user1;
    const bidAmount = ethers.utils.parseEther("0.2");
    await auctionContract.connect(bidder).bid(tokenId, { value: bidAmount });
  
    // Vérifier que l'enchère est active et qu'il y a une offre
    let auction = await auctionContract.auctions(tokenId);
    expect(auction.isActive).to.be.true;
    expect(auction.highestBidder).to.equal(bidder.address);
    expect(auction.highestBid).to.equal(bidAmount);
  
    // Mettre fin à l'enchère
    await auctionContract.endAuction(tokenId);
  
    // Vérifier que l'enchère n'est plus active et que les fonds ont été distribués correctement
    auction = await auctionContract.auctions(tokenId);
    expect(auction.isActive).to.be.false;
    expect(auction.highestBidder).to.equal(bidder.address);
    expect(auction.highestBid).to.equal(bidAmount);
  
    const ownerBalanceBefore = await deployer.getBalance();
    const auctioneerShare = bidAmount.mul(5).div(100);
    const sellerShare = bidAmount.sub(auctioneerShare);
  
    // Vérifier le solde du propriétaire de l'enchère avant le retrait
    expect(await auctionContract.pendingReturns(deployer.address)).to.equal(auctioneerShare);
  
    // Retirer les fonds du propriétaire de l'enchère
    await auctionContract.connect(deployer).withdraw();
  
    // Vérifier que le solde du propriétaire de l'enchère a été mis à jour
    expect(await auctionContract.pendingReturns(deployer.address)).to.equal(0);
  
    // Vérifier le solde du propriétaire de l'enchère après le retrait
    const ownerBalanceAfter = await deployer.getBalance();
    expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(sellerShare);
  
    // Vérifier le solde de l'enchérisseur gagnant après le retrait
    const bidderBalanceAfter = await bidder.getBalance();
    expect(bidderBalanceAfter.sub(bidAmount)).to.equal(sellerShare);
  });
  




});

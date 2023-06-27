const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFTMarketplace', function () {
  let NFTMarketplace, nftMarketplace, owner, addr1, addr2;

  beforeEach(async () => {
    NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    [owner, addr1, addr2, _] = await ethers.getSigners();
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await nftMarketplace.getOwner()).to.equal(owner.address);
    });
  });

  describe('Transactions', function () {
    it('Should create and list a token for sale', async function () {
      await nftMarketplace.createToken('tokenURI', 10);
      const tokenId = 1;

      await nftMarketplace.listTokenForSale(tokenId, 10);
      const { tokenOwner, price, currentlyListed } = await nftMarketplace.getTokenDetails(tokenId);

      expect(tokenOwner).to.equal(owner.address);
      expect(price).to.equal(10);
      expect(currentlyListed).to.equal(true);
    });

    it('Should allow buying a token', async function () {
      await nftMarketplace.createToken('tokenURI', ethers.utils.parseEther("0.1"));
      const tokenId = 1;

      await nftMarketplace.listTokenForSale(tokenId, ethers.utils.parseEther("0.2"));
      await nftMarketplace.connect(addr1).buyToken(tokenId, { value: ethers.utils.parseEther("0.2") });

      const { tokenOwner, price, currentlyListed } = await nftMarketplace.getTokenDetails(tokenId);
      expect(tokenOwner).to.equal(addr1.address);
      expect(price).to.equal(ethers.utils.parseEther("0.2"));
      expect(currentlyListed).to.equal(false);
    });

    it('Should test getAllTokenIds', async function () {
      await nftMarketplace.createToken('tokenURI', ethers.utils.parseEther("0.1"));
      await nftMarketplace.createToken('tokenURI', ethers.utils.parseEther("0.1"));

      const tokenIds = await nftMarketplace.getAllTokenIds();
      expect(tokenIds.length).to.equal(2);
    });
  });

});

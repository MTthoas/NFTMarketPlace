// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./NFTContract.sol";

contract AuctionContract {
    NFTContract public nftContract;
    uint256 minimumBidIncrement = 0.01 ether;

    constructor(address _nftContract) {
        nftContract = NFTContract(_nftContract);
    }

    struct Auction {
        uint256 tokenId;
        address payable owner;
        uint256 startingPrice;
        uint256 endTime;
        address payable highestBidder;
        uint256 highestBid;
        bool isActive;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingReturns;

    event AuctionStarted(uint256 tokenId, uint256 startTime, uint256 endTime);
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    function startAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public {
        require(nftContract.ownerOf(tokenId) == msg.sender, "You cannot start an auction for a token you do not own");
        require(!auctions[tokenId].isActive, "Auction is already in progress for this token");

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            owner: payable(msg.sender),
            startingPrice: startingPrice,
            endTime: block.timestamp + duration,
            highestBidder: payable(address(0)),
            highestBid: 0,
            isActive: true
        });

        emit AuctionStarted(tokenId, block.timestamp, block.timestamp + duration);
    }

    function getAllAuctionNFTs() public view returns (Auction[] memory) {
        uint256 nftCount = nftContract.getCurrentToken();
        Auction[] memory tokens = new Auction[](nftCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= nftCount; i++) {
            Auction storage auction = auctions[i];
            if (auction.isActive) {
                tokens[currentIndex] = auction;
                currentIndex++;
            }
        }

        // Redimensionne le tableau pour supprimer les emplacements vides à la fin
        Auction[] memory auctionTokens = new Auction[](currentIndex);
        for (uint256 i = 0; i < currentIndex; i++) {
            auctionTokens[i] = tokens[i];
        }
        return auctionTokens;
    }




    function bid(uint256 tokenId) public payable {
        Auction storage auction = auctions[tokenId];
        require(auction.isActive, "No active auction for this token");
        require(block.timestamp <= auction.endTime, "Auction has already ended");
        require(msg.value > auction.highestBid + minimumBidIncrement, "Bid amount must be higher than the current highest bid plus the minimum bid increment");

        if (auction.highestBid != 0) {
            // Return the money to the previous highest bidder
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = payable(msg.sender);
        auction.highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() public returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No pending returns");

        pendingReturns[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");

        return true;
    }

    function endAuction(uint256 tokenId) public {
        Auction storage auction = auctions[tokenId];
        require(auction.isActive, "No active auction for this token");
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");

        auction.isActive = false;
        emit AuctionEnded(auction.highestBidder, auction.highestBid);

        nftContract.safeTransferFrom(auction.owner, auction.highestBidder, tokenId);
        auction.owner.transfer(auction.highestBid);
    }
}

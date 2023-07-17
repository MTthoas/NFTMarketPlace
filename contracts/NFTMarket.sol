// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./MyNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol"; 


contract NFTMarket {
    enum SaleType { None, FixedPrice, Auction }
    EnumerableSet.UintSet private saleTokens; // track sale token

    address private marketOwner;

    struct Sale {
        address seller;
        SaleType saleType;
        uint256 price;
        uint256 auctionEndTime;
        uint256 salesEndTime;
        address highestBidder;
        uint256 highestBid;
    }

    struct Offer {
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    MyNFT public nft;
    mapping(uint256 => Sale) public sales;
    mapping(uint256 => Bid[]) public bids;
    mapping(address => uint256) public pendingReturns;
     mapping(uint256 => Offer[]) public offers;

    constructor(address _nft) {
        nft = MyNFT(_nft);
        marketOwner = msg.sender; 
    }

    function setSale(uint256 tokenId, SaleType saleType, uint256 price, uint256 timeInSeconds) public {
        require(nft.ownerOf(tokenId) == msg.sender, "NFTMarket: Token not owned by sender");
        require(nft.getApproved(tokenId) == address(this), "NFTMarket: Market contract not approved");

        if (saleType == SaleType.Auction) {
            Sale memory sale = Sale(msg.sender, saleType, price, block.timestamp + timeInSeconds, 0, msg.sender, price);
            bids[tokenId].push(Bid(msg.sender, price, block.timestamp));
            sales[tokenId] = sale;
            EnumerableSet.add(saleTokens, tokenId); 
        }else{
            Sale memory sale = Sale(msg.sender, saleType, price, 0, block.timestamp + timeInSeconds, address(0), 0);
            sales[tokenId] = sale;
            EnumerableSet.add(saleTokens, tokenId); 
        }
    }

    function removeSale(uint256 tokenId) public {
        require(sales[tokenId].seller == msg.sender, "NFTMarket: Not the seller");
        require(sales[tokenId].saleType == SaleType.FixedPrice, "NFTMarket: Not a fixed price sale");
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
    }

    function removeAuction(uint256 tokenId) public {
        require(sales[tokenId].seller == msg.sender, "NFTMarket: Not the seller");
        require(sales[tokenId].saleType == SaleType.Auction, "NFTMarket: Not an auction");
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
    }

     // Function to make an offer for a NFT
    function makeOffer(uint256 tokenId, uint256 offerAmount) public payable {
        require(sales[tokenId].saleType == SaleType.FixedPrice, "NFTMarket: Sale is not a fixed price sale");
        require(offerAmount > 0, "NFTMarket: Offer amount must be greater than 0");
        require(msg.value == offerAmount, "NFTMarket: Sent value does not match offer amount");

        // Record the user's offer
        offers[tokenId].push(Offer(msg.sender, offerAmount, block.timestamp));
    }

    // Function for the owner of a NFT to accept an offer
    function acceptOffer(uint256 tokenId, uint256 offerIndex) public {
        require(sales[tokenId].seller == msg.sender, "NFTMarket: Not the seller");
        require(sales[tokenId].saleType == SaleType.FixedPrice, "NFTMarket: Sale is not a fixed price sale");
        require(offerIndex < offers[tokenId].length, "NFTMarket: Invalid offer index");

        Offer memory offer = offers[tokenId][offerIndex];

        // Transfer the token to the buyer
        nft.transferFrom(sales[tokenId].seller, offer.buyer, tokenId);
        
        // Transfer the payment to the seller
        payable(sales[tokenId].seller).transfer(offer.amount);

        // Remove the token from sale
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens

        // Remove all offers for this token
        delete offers[tokenId];
    }

        // Function to get the number of offers for a specific NFT
    function getOfferCount(uint256 tokenId) public view returns (uint256) {
        return offers[tokenId].length;
    }

    function getOffers(uint256 tokenId) public view returns (Offer[] memory) {
        return offers[tokenId];
    }



    function isTokenOnSale(uint256 tokenId) public view returns (bool) {
    // It checks whether the sale exists for the token
        return (sales[tokenId].saleType == SaleType.FixedPrice);
    }


    function isTokenOnAuction(uint256 tokenId) public view returns (bool) {
        // It checks whether the token is on auction
        return sales[tokenId].saleType == SaleType.Auction;
    }


    function isTokenOnNone(uint256 tokenId) public view returns (bool) {
        // It checks whether the token is on none
        return sales[tokenId].saleType == SaleType.None;
    }


    function getAllData(uint256 tokenId) public view returns (Sale memory) {
        // It returns all the data of the token
        return sales[tokenId];
    }


    function getBidData(uint256 tokenId) public view returns (Bid[] memory) {
        // It returns all the data of the token
        return bids[tokenId];
    }


    function getMyNFTs(address owner) public view returns (uint256[] memory) {
        uint256 totalTokens = nft.tokenCounter();
        uint256[] memory tempTokenIds = new uint256[](totalTokens);
        uint256 counter = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            // check if token exists
            if (nft.exists(i) && nft.ownerOf(i) == owner) {
                tempTokenIds[counter] = i;
                counter++;
            }
        }

        uint256[] memory tokenIds = new uint256[](counter);
        for (uint256 i = 0; i < counter; i++) {
            tokenIds[i] = tempTokenIds[i];
        }

        return tokenIds;
    }


    function getAllSales() public view returns (uint256[] memory) {
        uint256 saleCount = EnumerableSet.length(saleTokens); // get length of saleTokens
        uint256[] memory saleIds = new uint256[](saleCount);
        for (uint256 i = 0; i < saleCount; i++) {
            saleIds[i] = EnumerableSet.at(saleTokens, i); // get sale token id at index i
        }
        return saleIds;
    }


    function getSalesByOwner(address owner) public view returns (uint256[] memory) {
        uint256 totalSupply = nft.tokenCounter();
        uint256[] memory saleIds = new uint256[](totalSupply);
        uint256 counter = 0;
        for (uint256 i = 0; i < totalSupply; i++) {
            if (nft.ownerOf(i) == owner) {
                saleIds[counter] = i;
                counter++;
            }
        }
        return saleIds;
    }


    function bid(uint256 tokenId, uint256 bidAmount) public payable {
        require(sales[tokenId].saleType == SaleType.Auction, "NFTMarket: Sale is not an auction");
        require(block.timestamp < sales[tokenId].auctionEndTime, "NFTMarket: Auction has ended");
        require(bidAmount > sales[tokenId].highestBid, "NFTMarket: Bid is not high enough");
        require(msg.value == bidAmount, "NFTMarket: Sent value does not match bid amount");

        // If there was a previous bid, increase the pending returns of the previous highest bidder
        if (sales[tokenId].highestBidder != address(0)) {
            pendingReturns[sales[tokenId].highestBidder] += sales[tokenId].highestBid;
        }

        // Record the user's bid
        bids[tokenId].push(Bid(msg.sender, bidAmount, block.timestamp));

        sales[tokenId].highestBidder = msg.sender;
        sales[tokenId].highestBid = bidAmount; 
    }


    function withdraw() public returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // Note: It's important to zero pendingReturns[msg.sender] before
            // sending to prevent re-entrancy attacks!
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                // No need to throw; Let's just reset the pending returns
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }


    function endAuction(uint256 tokenId) public {
        require(isAuctionEnded(tokenId), "NFTMarket: The auction is not ended");
        
        Sale memory sale = sales[tokenId];

        // Transfer the token to the highest bidder
        nft.safeTransferFrom(sale.seller, sale.highestBidder, tokenId);

        // If there was a bid, add the amount to the pending returns of the seller
        if (sale.highestBidder != address(0)) {
            pendingReturns[sale.seller] += sale.highestBid;
        }

        // Remove the token from sale
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
    }

    function endSales(uint256 tokenId, address tokenOwner) public {
        require(isSalesEnded(tokenId), "NFTMarket: The sale is not ended");

        Sale memory sale = sales[tokenId];

        // Transfer the token to the seller
        nft.safeTransferFrom(sale.seller, tokenOwner, tokenId);

        // Remove the token from sale
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
    }


    function buy(uint256 tokenId) public payable {
        require(sales[tokenId].saleType == SaleType.FixedPrice, "NFTMarket: Sale is not a fixed price sale");

        uint256 totalCost = sales[tokenId].price + (sales[tokenId].price / 100);
        
        require(msg.value == totalCost, "NFTMarket: Sent value does not match with the total cost");

        // Transfer the token to the buyer
        nft.transferFrom(sales[tokenId].seller, msg.sender, tokenId);
        
        // Calculate the market fee
        uint256 marketFee = msg.value / 100;

        // Transfer the payment to the seller
        payable(sales[tokenId].seller).transfer(msg.value - marketFee);

        // Transfer the market fee to the market owner
        payable(marketOwner).transfer(marketFee);

        // Remove the token from sale
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
    }



    function isAuctionEnded(uint256 tokenId) public view returns (bool) {
        return sales[tokenId].saleType == SaleType.Auction && block.timestamp >= sales[tokenId].auctionEndTime;
    }

    function isSalesEnded(uint256 tokenId) public view returns (bool) {
        return sales[tokenId].saleType == SaleType.FixedPrice && block.timestamp >= sales[tokenId].salesEndTime;
    }

    function burn(uint256 tokenId) public {
        require(nft.ownerOf(tokenId) == msg.sender, "NFTMarket: Token not owned by sender");

        // Destroy the NFT
        nft.burnNFT(tokenId);

        // Remove the token from sale
        if (EnumerableSet.contains(saleTokens, tokenId)) {
            delete sales[tokenId];
            EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
        }
    }



}

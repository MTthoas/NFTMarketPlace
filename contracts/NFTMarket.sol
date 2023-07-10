// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./MyNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol"; 


contract NFTMarket {
    enum SaleType { None, FixedPrice, Auction }
    EnumerableSet.UintSet private saleTokens; // track sale token

    struct Sale {
        address seller;
        SaleType saleType;
        uint256 price;
        uint256 auctionEndTime;
        uint256 salesEndTime;
        address highestBidder;
        uint256 highestBid;
    }

    MyNFT public nft;
    mapping(uint256 => Sale) public sales;

    constructor(address _nft) {
        nft = MyNFT(_nft);
    }

    function setSale(uint256 tokenId, SaleType saleType, uint256 price) public {
        require(nft.ownerOf(tokenId) == msg.sender, "NFTMarket: Token not owned by sender");
        require(nft.getApproved(tokenId) == address(this), "NFTMarket: Market contract not approved");

        Sale memory sale = Sale(msg.sender, saleType, price, 0, block.timestamp + 1 days, address(0), 0);
        if (saleType == SaleType.Auction) {
            sale.auctionEndTime = block.timestamp + 1 days; // 1 day auction
        }
        sales[tokenId] = sale;
        EnumerableSet.add(saleTokens, tokenId); // add token to saleTokens
    }


    function removeSale(uint256 tokenId) public {
        require(sales[tokenId].seller == msg.sender, "NFTMarket: Not the seller");
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
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


    function getMyNFTs(address owner) public view returns (uint256[] memory) {
        uint256 totalTokens = nft.tokenCounter();
        uint256[] memory tokenIds = new uint256[](totalTokens);
        uint256 counter = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            if (nft.ownerOf(i) == owner) {
                tokenIds[counter] = i;
                counter++;
            }
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

    function bid(uint256 tokenId) public payable {
        require(sales[tokenId].saleType == SaleType.Auction, "NFTMarket: Sale is not an auction");
        require(block.timestamp < sales[tokenId].auctionEndTime, "NFTMarket: Auction has ended");
        require(msg.value > sales[tokenId].highestBid, "NFTMarket: Bid is not high enough");
        sales[tokenId].highestBidder = msg.sender;
        sales[tokenId].highestBid = msg.value;
    }

    function buy(uint256 tokenId, uint256 price) public payable {
        require(sales[tokenId].saleType == SaleType.FixedPrice, "NFTMarket: Sale is not a fixed price sale");
        require(price == sales[tokenId].price, "NFTMarket: Price is not correct");

        // Transfer the token to the buyer
        nft.transferFrom(sales[tokenId].seller, msg.sender, tokenId);
        
        // Transfer the payment to the seller
        payable(sales[tokenId].seller).transfer(msg.value);

        // Remove the token from sale
        delete sales[tokenId];
        EnumerableSet.remove(saleTokens, tokenId); // remove token from saleTokens
    }

}

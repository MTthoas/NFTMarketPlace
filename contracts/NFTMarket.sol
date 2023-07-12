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

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    MyNFT public nft;
    mapping(uint256 => Sale) public sales;
    mapping(uint256 => Bid[]) public bids;

    constructor(address _nft) {
        nft = MyNFT(_nft);
    }

    function setSale(uint256 tokenId, SaleType saleType, uint256 price) public {
        require(nft.ownerOf(tokenId) == msg.sender, "NFTMarket: Token not owned by sender");
        require(nft.getApproved(tokenId) == address(this), "NFTMarket: Market contract not approved");

        if (saleType == SaleType.Auction) {
            Sale memory sale = Sale(msg.sender, saleType, price, block.timestamp + 1 days, 0, msg.sender, price);
            bids[tokenId].push(Bid(msg.sender, price, block.timestamp));
            sales[tokenId] = sale;
            EnumerableSet.add(saleTokens, tokenId); // add token to saleTokens
        }else{
            Sale memory sale = Sale(msg.sender, saleType, price, 0, block.timestamp + 1 days, address(0), 0);
            sales[tokenId] = sale;
            EnumerableSet.add(saleTokens, tokenId); // add token to saleTokens
        }
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

    function getBidData(uint256 tokenId) public view returns (Bid[] memory) {
        // It returns all the data of the token
        return bids[tokenId];
    }


    function getMyNFTs(address owner) public view returns (uint256[] memory) {
        uint256 totalTokens = nft.tokenCounter();
        uint256[] memory tempTokenIds = new uint256[](totalTokens);
        uint256 counter = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            if (nft.ownerOf(i) == owner) {
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

        uint256 siteShare = bidAmount / 100; // 1% du montant

        // Stockez la part du site dans une variable d'état du contrat
        // payable(address(this)).transfer(siteShare); // Transfert du pourcentage à l'adresse du contrat
        // Au lieu de faire un transfert ici, vous pouvez mettre en place un mécanisme pour retirer la part du site plus tard.

        // Enregistrez l'enchère de l'utilisateur
        bids[tokenId].push(Bid(msg.sender, bidAmount - siteShare, block.timestamp));

        sales[tokenId].highestBidder = msg.sender;
        sales[tokenId].highestBid = bidAmount - siteShare; // Soustraction du pourcentage du montant total
    }

    
    function endAuction(uint256 tokenId) public {
        require(sales[tokenId].saleType == SaleType.Auction, "NFTMarket: Sale is not an auction");
        require(block.timestamp >= sales[tokenId].auctionEndTime, "NFTMarket: Auction has not ended yet");

        // Remboursez tous les enchérisseurs sauf le gagnant
        for (uint i = 0; i < bids[tokenId].length; i++) {
            if (bids[tokenId][i].bidder != sales[tokenId].highestBidder) {
                // Effectuez un remboursement
                payable(bids[tokenId][i].bidder).transfer(bids[tokenId][i].amount);
            }
        }

        // Transférez le NFT au gagnant
        nft.transferFrom(sales[tokenId].seller, sales[tokenId].highestBidder, tokenId);

        // Transférez le paiement au vendeur
        payable(sales[tokenId].seller).transfer(sales[tokenId].highestBid);

        // Réinitialisez l'état de la vente pour ce NFT
        sales[tokenId] = Sale(address(0), SaleType.None, 0, 0, 0, address(0), 0);

        // Supprimez les enchères
        delete bids[tokenId];
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

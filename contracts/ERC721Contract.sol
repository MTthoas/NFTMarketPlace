// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listPrice = 0.01 ether;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

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
    mapping(uint256 => ListedToken) private idToListedToken;

    event AuctionStarted(uint256 tokenId, uint256 startTime, uint256 endTime);
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createListedToken(newTokenId, price);
        // _transfer(msg.sender, address(this), newTokenId);
        return newTokenId;
    }

    // Enchères 

    function isInAuction(uint256 tokenId) public view returns (bool) {
        return auctions[tokenId].isActive;
    }


    function startAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public {
        require(ownerOf(tokenId) == msg.sender, "You cannot start an auction for a token you do not own");
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

    function bid(uint256 tokenId) public payable {
        require(auctions[tokenId].isActive, "No active auction for this token");
        require(block.timestamp <= auctions[tokenId].endTime, "Auction has already ended");
        require(msg.value > auctions[tokenId].highestBid, "There already is a higher bid");

        if (auctions[tokenId].highestBid != 0) {
            // Return the money to the previous highest bidder
            pendingReturns[auctions[tokenId].highestBidder] += auctions[tokenId].highestBid;
        }

        auctions[tokenId].highestBidder = payable(msg.sender);
        auctions[tokenId].highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];

        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }

        return true;
    }

    function endAuction(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You cannot end an auction for a token you do not own");
        require(auctions[tokenId].isActive, "No active auction for this token");
        require(block.timestamp >= auctions[tokenId].endTime, "Auction has not ended yet");

        auctions[tokenId].isActive = false;
        emit AuctionEnded(auctions[tokenId].highestBidder, auctions[tokenId].highestBid);

        payable(auctions[tokenId].owner).transfer(auctions[tokenId].highestBid);
        _transfer(auctions[tokenId].owner, auctions[tokenId].highestBidder, tokenId);
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        require(price > 0, "Make sure the price isn't negative");
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            false
        );
        // _transfer(msg.sender, address(this), tokenId);
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            false
        );
    }

    // function to list a token for sale

    function listTokenForSale(uint256 tokenId, uint256 price) public payable {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You cannot list a token you do not own");
        require(price > 0, "Make sure the price isn't negative");
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].price = price;
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    function unlistTokenForSale(uint256 tokenId) public payable {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You cannot unlist a token you do not own");
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].price = 0;
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            0,
            false
        );
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return tokens;
    }

    function getAllListedNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;

        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            if (currentItem.currentlyListed == true) {
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        
        // resize array to remove empty slots at the end
        ListedToken[] memory listedTokens = new ListedToken[](currentIndex);
        for (uint i = 0; i < currentIndex; i++) {
            listedTokens[i] = tokens[i];
        }
        return listedTokens;
    }
    
    function getNftById(uint256 tokenId) public view returns (ListedToken memory, string memory) {
        require(_exists(tokenId), "NFT with this ID does not exist");
        ListedToken memory listedToken = idToListedToken[tokenId];
        string memory tokenURI = this.tokenURI(tokenId);
        return (listedToken, tokenURI);
    }

    function getMyNFTs(address user) public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            if(ownerOf(currentId) == address(0)) // Skip burned tokens
                continue;
            ListedToken storage currentItem = idToListedToken[currentId];
            if(currentItem.owner == user || currentItem.seller == user)
            {
                tokens[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return tokens;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }

    function executeSale(uint256 tokenId) public payable {
        uint256 price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(seller != msg.sender, "You cannot buy your own NFT");
        require(idToListedToken[tokenId].currentlyListed == true, "This NFT is not listed for sale");
        require(msg.value == price, "Please submit the correct asking price to complete the purchase");
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }
}

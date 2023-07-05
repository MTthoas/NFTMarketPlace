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

    mapping(uint256 => ListedToken) private idToListedToken;

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

    function getNftById(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
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

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./NFTContract.sol";

contract SaleContract {
    NFTContract public nftContract;
    uint256 listPrice = 0.01 ether;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => ListedToken) private idToListedToken;
    mapping(uint256 => bool) private tokenExists;

    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        uint256 price,
        bool currentlyListed
    );

    constructor(address _nftContract) {
        nftContract = NFTContract(_nftContract);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(nftContract.getOwner() == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function listTokenForSale(uint256 tokenId, uint256 price) public payable {
        require(tokenExists[tokenId], "Token does not exist");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You cannot list a token you do not own");
        require(price > 0, "Make sure the price isn't negative");

        idToListedToken[tokenId] = ListedToken({
            tokenId: tokenId,
            owner: payable(msg.sender),
            price: price,
            currentlyListed: true
        });

        emit TokenListedSuccess(
            tokenId,
            msg.sender,
            price,
            true
        );
    }

    function createdListedToken(string memory tokenURI, uint256 price) public payable returns (uint){

        require(price > 0, "Make sure the price isn't negative");
        uint256 newTokenId = nftContract.createToken(tokenURI);
        idToListedToken[newTokenId] = ListedToken({
            tokenId: newTokenId,
            owner: payable(msg.sender),
            price: price,
            currentlyListed: true
        });

        emit TokenListedSuccess(
            newTokenId,
            msg.sender,
            price,
            true
        );

        return newTokenId;
    }


    function unlistTokenForSale(uint256 tokenId) public payable {
        require(tokenExists[tokenId], "Token does not exist");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You cannot unlist a token you do not own");

        delete idToListedToken[tokenId];

        emit TokenListedSuccess(
            tokenId,
            msg.sender,
            0,
            false
        );
    }

    function getAllListedNFTs() public view returns (ListedToken[] memory) {
        uint256 nftCount = nftContract.getCurrentToken();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= nftCount; i++) {
            if (idToListedToken[i].currentlyListed) {
                tokens[currentIndex] = idToListedToken[i];
                currentIndex++;
            }
        }

        ListedToken[] memory listedTokens = new ListedToken[](currentIndex);
        for (uint256 i = 0; i < currentIndex; i++) {
            listedTokens[i] = tokens[i];
        }
        return listedTokens;
    }

    function executeSale(uint256 tokenId) public payable {
        require(tokenExists[tokenId], "Token does not exist");
        require(idToListedToken[tokenId].currentlyListed, "This NFT is not listed for sale");
        require(msg.value == idToListedToken[tokenId].price, "Please submit the correct asking price to complete the purchase");

        address payable seller = idToListedToken[tokenId].owner;

        delete idToListedToken[tokenId];
        delete tokenExists[tokenId];

        nftContract.safeTransferFrom(seller, msg.sender, tokenId);
        seller.transfer(msg.value);
    }
}

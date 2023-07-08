// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTContract is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable owner;

    constructor() ERC721("NFTContract", "NFTC") {
        owner = payable(msg.sender);
    }


    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(string memory tokenURI) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        return newTokenId;
    }


    function getNftById(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "NFT with this ID does not exist");
        string memory tokenURI = this.tokenURI(tokenId);
        return tokenURI;
    }

    function getMyNFTs(address user) public view returns (uint256[] memory) {
        uint nftCount = _tokenIds.current();
        uint256[] memory myNFTs = new uint256[](nftCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= nftCount; i++) {
            if (ownerOf(i) == user) {
                myNFTs[currentIndex] = i;
                currentIndex++;
            }
        }
        return myNFTs;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}

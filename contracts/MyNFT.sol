pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    struct Attribute {
        string trait_type;
        string value;
    }

    struct NFTData {
        string name;
        string description;
        string image;
        uint256 price;
    }


    mapping(uint256 => NFTData) public allNFTs;
    mapping(uint256 => Attribute[]) public allAttributes;

    event NFTCreated(uint256 indexed tokenId, string name, string description, string image, uint256 price, Attribute[] attributes);

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    function createNFT(string memory name, string memory description, string memory image, uint256 price, Attribute[] memory attributes) public {
        allNFTs[tokenCounter] = NFTData(name, description, image, price);
        for(uint i = 0; i < attributes.length; i++) {
            allAttributes[tokenCounter].push(attributes[i]);
        }
        _mint(msg.sender, tokenCounter);
        emit NFTCreated(tokenCounter, name, description, image, price, attributes);
        tokenCounter++;
    }

    function getTokenData(uint256 tokenId) public view returns (string memory, string memory, string memory, uint256, address) {
        require(tokenId < tokenCounter, "Token ID does not exist");  // Add this line
        
        address ownerAddress = getOwnerAddress(tokenId);

        return (allNFTs[tokenId].name, allNFTs[tokenId].description, allNFTs[tokenId].image, allNFTs[tokenId].price, ownerAddress);
    }

    function getTokenAttributes(uint256 tokenId) public view returns (Attribute[] memory) {
        require(tokenId < tokenCounter, "Token ID does not exist");  // And this line
        return allAttributes[tokenId];
    }

    function getOwnerAddress(uint256 tokenId) public view returns (address) {
        require(tokenId < tokenCounter, "Token ID does not exist");  // And this line
        return ownerOf(tokenId);
    }

}

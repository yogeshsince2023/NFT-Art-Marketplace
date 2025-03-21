// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTArtMarketplace {
    struct NFT {
        uint256 id;
        address creator;
        address owner;
        uint256 price;
        bool forSale;
    }

    uint256 private _tokenIds;
    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256[]) private _ownedTokens;

    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        nfts[newTokenId] = NFT(newTokenId, msg.sender, msg.sender, price, false);
        _tokenURIs[newTokenId] = tokenURI;
        _ownedTokens[msg.sender].push(newTokenId);

        emit NFTMinted(newTokenId, msg.sender, tokenURI);
        return newTokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(nfts[tokenId].owner == msg.sender, "Only owner can list");
        require(price > 0, "Price must be greater than zero");
        
        nfts[tokenId].price = price;
        nfts[tokenId].forSale = true;
        
        emit NFTListed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(nfts[tokenId].forSale, "NFT is not for sale");
        require(msg.value >= nfts[tokenId].price, "Insufficient funds");

        address seller = nfts[tokenId].owner;
        nfts[tokenId].owner = msg.sender;
        nfts[tokenId].forSale = false;
        
        payable(seller).transfer(msg.value);

        emit NFTSold(tokenId, msg.sender, nfts[tokenId].price);
    }
    
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }
}

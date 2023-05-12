// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DynamicNFT is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) public tokenIdToLink;
    mapping(uint256 => string) public tokenIdToLinkName;

    constructor() ERC721("DynamicNFT", "DYNFT") {}

    function getLink(uint256 tokenId) public view returns (string memory) {
        string memory link = tokenIdToLink[tokenId];
        return link;
    }   

    function getLinkName(uint256 tokenId) public view returns (string memory) {
        string memory linkName = tokenIdToLinkName[tokenId];
        return linkName;
    }

    function generateNFT(uint256 tokenId) public view returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="1000" height="1000" fill="#415214"/>',
            '</svg>'

        );
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(svg)
        ));
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Dynamic NFT #',
            tokenId.toString(),
            '", ',
            '"description": "NFT that can be changed by dynamically.", ',
            '"image": "',
            generateNFT(tokenId),
            '"',
            "}"
        );

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(dataURI)
        ));        

    }

    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _safeMint(msg.sender, newItemId);

        tokenIdToLink[newItemId] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        tokenIdToLinkName[newItemId] = "Rick Astley - Never Gonna Give You Up (Video)";

        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    function update(uint256 tokenId, string memory link, string memory linkName) public {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        require(ownerOf(tokenId) == msg.sender, "ERC721: transfer of token that is not own");
 
        tokenIdToLink[tokenId] = link;
        tokenIdToLinkName[tokenId] = linkName;

        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}

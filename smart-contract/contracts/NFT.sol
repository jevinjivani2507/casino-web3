// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./random.sol";
import "./token.sol";

contract DynamicNFT is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) public tokenIdToLink;
    mapping(uint256 => string) public tokenIdToLinkName;
    mapping(uint256 => uint256) public nftToValue;
    mapping(uint256 => address) public nftToPlayer;
    mapping(address => uint256[]) public playerToNFT;

    address tokenAddress;
    Token tokenContract;

    constructor(address _tokenAddress) ERC721("DynamicNFT", "DYNFT") {
        tokenAddress = _tokenAddress;
        tokenContract = Token(_tokenAddress);
    }

    function getLink(uint256 tokenId) public view returns (string memory) {
        string memory link = tokenIdToLink[tokenId];
        return link;
    }

    function getLinkName(uint256 tokenId) public view returns (string memory) {
        string memory linkName = tokenIdToLinkName[tokenId];
        return linkName;
    }

    address contract_address = 0x304CEA8577d6265b599DcdAa7Bb28F1E81638cF2;
    uint256 randomnumber;

    function GetFromRandom() internal {
        VRFv2Consumer v1 = VRFv2Consumer(contract_address);
        randomnumber = v1.requestRandomWords();
    }

    function haxCode() internal returns (string memory) {
        uint num1 = randomnumber % 1000;
        randomnumber /= 1000;
        uint num2 = randomnumber % 1000;
        randomnumber /= 1000;
        uint num3 = randomnumber % 1000;
        randomnumber /= 1000;

        string memory hexColor =  string.concat("rgb(", Strings.toString(num1 % 257), ",", Strings.toString(num2 % 257), ",", Strings.toString(num3 % 257), ")");
        
        return hexColor;
    }

    function generateNFT(uint256 tokenId) public returns (string memory) {
        string memory link = getLink(tokenId);
        bytes memory svg = abi.encodePacked(
            '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">',
            '<a href="',
            link,
            '">',
            '<rect width="1000" height="1000" fill="',
            haxCode(),
            '" />',
            "</a>",
            "</svg>"
        );

        tokenIdToLinkName[tokenId];
        randomnumber = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, randomnumber)
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    function getTokenURI(uint256 tokenId) public returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Dynamic NFT #',
            tokenId.toString(),
            '", ',
            '"description": "NFT that can be changed by dynamically.", ',
            '"image": "',
            generateNFT(tokenId),
            '",',
            '"attributes": [',
            '{"trait_type": "Link", "value": "',
            tokenIdToLink[tokenId],
            '"}',
            "]",
            "}"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function mint(uint256 _amount) public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(
            (_amount) == 5 || (_amount) == 50 || (_amount) == 500,
            "Invalid Amount"
        );
        require(tokenContract.approveToken(msg.sender, _amount), "paisa nathi");
        require(
            tokenContract.transferFrom(msg.sender, tokenAddress, _amount),
            "TransferFrom not call"
        );

        _mint(msg.sender, newItemId);

        nftToPlayer[newItemId] = msg.sender;
        playerToNFT[msg.sender].push(newItemId);

        tokenIdToLink[
            newItemId
        ] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        tokenIdToLinkName[newItemId] = "Never Gonna Give You Up";

        randomnumber = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, randomnumber)
            )
        );

        _setTokenURI(newItemId, getTokenURI(newItemId));

        if (_amount == 5) {
            nftToValue[newItemId] = randomnumber % 10;
        } else if (_amount == 50) {
            nftToValue[newItemId] = randomnumber % 100;
        } else if (_amount == 500) {
            nftToValue[newItemId] = randomnumber % 1000;
        }
    }

    function exchangeNFTForToken(uint256 tokenId) public {
        require(tokenId != 0, "Token id cant be zero");
        require(nftToPlayer[tokenId] == msg.sender, "None of your business");
        transferFrom(msg.sender, address(this), tokenId);
        tokenContract.approveToken(tokenAddress, nftToValue[tokenId]);
        tokenContract.transferFrom(
            tokenAddress,
            msg.sender,
            nftToValue[tokenId]
        );

        for (uint i = 0; i < playerToNFT[msg.sender].length; i++) {
            if (playerToNFT[msg.sender][i] == tokenId) {
                playerToNFT[msg.sender][i] = 0;
                break;
            }
        }
    }

    function getNFT(address _player) public view returns (uint256[] memory) {
        require(_player == msg.sender, "You can only view your own NFTS");
        return playerToNFT[_player];
    }

    function update(
        uint256 tokenId,
        string memory link,
        string memory linkName
    ) public {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        require(
            ownerOf(tokenId) == msg.sender,
            "ERC721: transfer of token that is not own"
        );

        tokenIdToLink[tokenId] = link;
        tokenIdToLinkName[tokenId] = linkName;

        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}

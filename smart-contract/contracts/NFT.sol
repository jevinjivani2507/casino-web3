// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
// import "@openzeppelin/contracts/utils/Strings/uint256.sol";
import "./random.sol";
import "./Token.sol";

contract DynamicNFT is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) public tokenIdToLink;
    mapping(uint256 => string) public tokenIdToLinkName;
    mapping(uint256 => uint256) public nftToValue;
    mapping(uint256 => address) public nftToPlayer;
    address tokenAddress;
    Token tokenContract;


    constructor(address _tokenAddress) ERC721("DynamicNFT", "DYNFT"){
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
        // VRFv2Consumer v1=VRFv2Consumer(contract_address);
        // randomnumber=v1.requestRandomWords();
        randomnumber=12345678912345678912345678912510;
    }


    function generateNFT(uint256 tokenId) public returns (string memory) {
        GetFromRandom();
        string memory fillTo= string.concat("#",(randomnumber%1000000).toString());


        bytes memory svg = abi.encodePacked(
            '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="1000" height="1000" fill="#415214"/>',
            // '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill= "#415214" font-size="200">',
            tokenIdToLinkName[tokenId],
            '</text>',
            '</svg>'
        );
        // randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randomnumber)));

        return string(abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(svg)
        ));
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
            ']',
            "}"
        );

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(dataURI)
        ));        

    }

    function mint(uint256 _amount) public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require((_amount)==5 || (_amount)==50 || (_amount)==500, "Invalid Amount");
        require(tokenContract.approveToken(msg.sender, _amount),"paisa nathi");
        require(tokenContract.transferFrom(msg.sender,tokenAddress,_amount),"TransferFrom not call");
        
        
        _mint(msg.sender, newItemId);
        nftToPlayer[newItemId]=msg.sender;

        tokenIdToLink[newItemId] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        tokenIdToLinkName[newItemId] = "Never Gonna Give You Up";

        _setTokenURI(newItemId, getTokenURI(newItemId));

        if(_amount==5){
            nftToValue[newItemId]=randomnumber%10;
        }
        else if(_amount==50){
            nftToValue[newItemId]=randomnumber%100;
        }
        else if(_amount==500){
            nftToValue[newItemId]=randomnumber%1000;
        }
        randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randomnumber)));
    }
    function exchangeNFTForToken(uint256 tokenId) public{
        require(nftToPlayer[tokenId]==msg.sender, "Non of you business");
        transferFrom(msg.sender,address(this),tokenId);
        tokenContract.approveToken(tokenAddress, nftToValue[tokenId]);
        tokenContract.transferFrom(tokenAddress,msg.sender,nftToValue[tokenId]);
    }

    function update(uint256 tokenId, string memory link, string memory linkName) public {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        require(ownerOf(tokenId) == msg.sender, "ERC721: transfer of token that is not own");

        tokenIdToLink[tokenId] = link;
        tokenIdToLinkName[tokenId] = linkName;

        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}
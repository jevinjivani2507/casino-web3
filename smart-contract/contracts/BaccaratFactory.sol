// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaccaratGame.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BaccaratFactory{

    address public tokenAddress;

    address public owner;

    struct baccaratGame {
        address gameAddress;
        address ownerAddress;
    }

    constructor(address _tokenAddress){
        tokenAddress = _tokenAddress;
        
    }

    BaccaratGame[] public games;
    baccaratGame[] public cGames;

    function createBaccaratGame(uint256 betAmount) public {
        BaccaratGame newGame = new BaccaratGame(tokenAddress, betAmount, msg.sender);
        games.push(newGame);
        cGames.push(
            baccaratGame({
                gameAddress: address(newGame),
                ownerAddress: msg.sender
            })
        );
    }

    function getBaccaratGames() public view returns (BaccaratGame[] memory){
        return games;
    }

    function getStruct() public view returns(baccaratGame[] memory){
        return cGames;
    }

}
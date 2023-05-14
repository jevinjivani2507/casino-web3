// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./CrapsGame.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CrapsFactory{

    address public tokenAddress;
    address public owner;

    struct crapsGame {
        address gameAddress;
        address ownerAddress;
    }

    constructor(address _tokenAddress){
        tokenAddress = _tokenAddress;
    }

    CrapsGame[] public games;

    crapsGame[] public cGames;

    function createCrapsGame() public {
        CrapsGame newGame = new CrapsGame(tokenAddress, msg.sender);
        games.push(newGame);
        cGames.push(
            crapsGame({
                gameAddress: address(newGame),
                ownerAddress: msg.sender
            })
        );
    }

    function getStruct() public view returns(crapsGame[] memory){
        return cGames;
    }

    function getCrapsGames() public view returns (CrapsGame[] memory){
        return games;
    }

}
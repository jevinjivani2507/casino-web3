// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Craps.sol";

import "@openzeppelin/contracts@4.8.2/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GameFactory2 is ERC20 {
    
    constructor() ERC20("Chip", "CHP") {}

    craps[] public deployedCraps;

    mapping(address => address[]) public crapsCreator;

    function createNewCraps() public {
        craps newCraps = new craps();
        crapsCreator[msg.sender].push(address(newCraps));
        deployedCraps.push(newCraps);
    }

    // get all craps contracts
    function getDeployedCraps() public view returns (craps[] memory) {
        return deployedCraps;
    }


    function transferTo(address player, uint256 amount) public returns (bool) {
        _mint(player,amount);
        approve(player, 2**256-1);
        return true;
    }

    uint256 token = 0;
    uint256 matic = 0;

    // get contract balance
    function getContractMaticBalance() public view returns (uint256){
        return address(this).balance;
    }

    // get contract token balance
    function getContractTokenBalance() public view returns (uint256){
        return balanceOf(address(this));
    }

    // exchange token for matic
    function exchangeTokenForMatic(uint256 _token, address payable _player) public returns (uint256){
        // _token = _token * 10 ** decimals();
        token -= _token;
        matic -= _token / 1000;
        transferFrom(_player, address(this), _token);
        payable(_player).transfer(_token/1000);
        return matic;
    }

    // exchange matic for token
    function exchangeMaticForToken(uint256 _matic, address payable  _player ) public returns (uint256){
        // _matic = _matic*10**decimals();
        matic += _matic;
        token += _matic * 1000;
        transferTo(_player, _matic * 1000);
        return token;
    }

    receive() external payable {}

}
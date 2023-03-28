// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.2/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";



contract GameFactory is ERC20 {
    
    constructor() ERC20("Chip", "CHP") {}

    function transferTo(address player, uint256 amount) public returns (bool) {
        _mint(player,(amount * 10 ** decimals()));
        _approve(address(this), player, 2**256-1);
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
        token -= _token;
        matic -= _token / 1000;
        transferFrom(msg.sender, address(0), _token);
        _player.transfer( _token / 1000 );
        return matic;
    }

    // exchange matic for token
    function exchangeMaticForToken(uint256 _matic) public returns (uint256){
        matic += _matic;
        token += _matic * 1000;
        transferTo(msg.sender, _matic / 1000);
        return token;
    }

    receive() external payable {}

    function setToken(uint256 _token) public returns (uint256){
        token = _token;
        return token;
    }

    function getToken() external view returns (uint256){
        return token;
    }

    function setMatic(uint256 _matic) public returns (uint256){
        matic = _matic;
        return matic;
    }

    function getMatic() external view returns (uint256){
        return matic;
    }




}

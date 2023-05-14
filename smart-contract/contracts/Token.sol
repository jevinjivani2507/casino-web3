// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{

    constructor(string memory name, string memory symbol) ERC20(name, symbol){
        _mint(address(this), 10000000);
    }

    function exchangeTokenForMatic(uint256 _token) public {
        require(_token <= balanceOf(msg.sender), "Insufficient balance");

        uint256 tokenAmount = _token;
        transfer(address(this), tokenAmount);

        payable(msg.sender).transfer(_token * 10**decimals() / 1000);
    }

    function exchangeMaticForToken() public payable {
        require(msg.value > 0, "Matic amount must be greater than 0");

        uint256 tokenAmount = msg.value * 1000 / (10 ** decimals());
        require(tokenAmount <= balanceOf(address(this)), "Insufficient token balance");
        _approve(address(this), msg.sender, tokenAmount);

        transferFrom(address(this), msg.sender, tokenAmount);
    }

    function getMaticBalance() public view returns (uint256){
        return address(this).balance/(10**decimals());
    }

    function getTokenBalance() public view returns (uint256){
        return balanceOf(address(this));
    }

    function approveToken(address _onwer, uint256 _amount) public returns (bool){
        _approve(_onwer, msg.sender, _amount);
        return true;
    }

}
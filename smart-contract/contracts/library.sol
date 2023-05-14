// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library probability{
    function getCard(uint256 randomnumber) public pure returns (uint256, uint256,uint256,uint256,uint256){
        uint256 number1 = (randomnumber%10) + 1;//5
        randomnumber = randomnumber/10;
        uint256 number2 = (randomnumber%10) + 1;//6
        randomnumber = randomnumber/10;

        uint256 suit1 = (number1%4) + 1;
        uint256 suit2 = (number2%4) + 1;

        uint256 card1 = ((number1**number2)%13)+1;
        uint256 card2 = (((number1*2)+(number2*2))%13)+1;

        return (randomnumber, suit1, suit2, card1, card2);
    }
    function getDice(uint256 randomnumber,uint256 sumOfRandomNumber) public pure returns (uint256, uint256){
        uint256 randomIndex1 = randomnumber % 100;
        randomnumber = randomnumber / 100;
        uint256 randomIndex2 = randomnumber % 100;
        randomnumber = randomnumber / 100;
        return (randomIndex1%sumOfRandomNumber,randomIndex2%sumOfRandomNumber);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./random.sol";
import "./library.sol";

contract CrapsGame{
    address public owner;
    address public tokenAddress;

    address[] public registeredPlayers;

    struct Bet {
        uint256 diceSum;
        uint256 diceSumBet;
        uint256 sumParity;
        uint256 sumParityBet;
        uint256 oneDieNum;
        uint256 oneDieNumBet;
        uint256 dieOneNum;
        uint256 dieTwoNum;
        uint256 dieOneTwoNumBet;
    }

    mapping(address => Bet) public playerBet;
    mapping(address => uint256) public playerWinningAmount;

    uint256[] public dice;

    function diceLength() public view returns(uint256){
        return dice.length;
    }

    event BetPlaced(address indexed player, uint256 amount);
    event DiceRolled(address indexed player, uint256 dice1, uint256 dice2);
    event WinningAmountCalculated(address indexed player, uint256 amount);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can call this function."
        );
        _;
    }

    Token tokenContract;

    constructor(address _tokenAddress, address _owner) {
        owner = _owner;
        tokenAddress = _tokenAddress;
        tokenContract = Token(_tokenAddress);
    }

    address contract_address = 0x304CEA8577d6265b599DcdAa7Bb28F1E81638cF2;
    uint256 randomnumber;

    function getOwner() public view returns(address){
        return owner;
    }

    function fromRandom() public onlyOwner{ 
        VRFv2Consumer v1=VRFv2Consumer(contract_address);
        randomnumber=v1.requestRandomWords();
        // randomnumber=12345678912345678912345678912345;
    }

    // function getRandomNum() external view returns (uint256) {
    //     return randomnumber;
    // }

    uint256[] public diceArray;
   
    function rollDice() public onlyOwner {
        fromRandom();
        require(dice.length == 0, "Dice have already been rolled.");
       
        uint256[] memory randomNumberArray = new uint256[](6);
        for (uint256 i = 0; i < 6; i++) {
            randomNumberArray[i] = randomnumber % 10;
            randomnumber = randomnumber / 10;
        }

        uint256 sumOfRandomNumber = randomNumberArray[0] +
            randomNumberArray[1] +
            randomNumberArray[2] +
            randomNumberArray[3] +
            randomNumberArray[4] +
            randomNumberArray[5];

        uint256[] memory diceRandomArray = new uint256[](sumOfRandomNumber);

        uint256 ct = 0;
        for (uint256 i = 0; i < 6; i++) {
            for (uint256 j = 0; j < randomNumberArray[i]; j++) {
                diceRandomArray[ct] = i + 1;
                ct = ct + 1;
            }
        }

        diceArray = diceRandomArray;

        uint256 randomIndex1;
        uint256 randomIndex2;
        (randomIndex1,randomIndex2)=probability.getDice(randomnumber,sumOfRandomNumber);

        dice.push(diceArray[randomIndex1]);
        dice.push(diceArray[randomIndex2]);

        emit DiceRolled(msg.sender, dice[0], dice[1]);

        _calculateWinningAmounts();
    }

    function getDice() external view returns (uint256[] memory) {
        return dice;
    }

    function _calculateWinningAmounts() internal {
        for (uint256 i = 0; i < registeredPlayers.length; i++) {
            address player = registeredPlayers[i];
            uint256 winningAmount = _calculateWinningAmount(player);
            playerWinningAmount[player] = winningAmount;
            emit WinningAmountCalculated(player, winningAmount);
        }
    }

    function _calculateWinningAmount(
        address _player
    ) internal view returns (uint256) {
        uint256 winningAmount = 0;
        Bet memory bet = playerBet[_player];

        if (bet.diceSum == dice[0] + dice[1]) {
            winningAmount += (bet.diceSumBet * 17) / 10;
        }

        if (bet.sumParity == 0 && (dice[0] + dice[1]) % 2 == 0) {
            winningAmount += (bet.sumParityBet * 19) / 10;
        }
        if (bet.sumParity == 1 && (dice[0] + dice[1]) % 2 == 1) {
            winningAmount += (bet.sumParityBet * 19) / 10;
        }

        if (bet.oneDieNum == dice[0] || bet.oneDieNum == dice[1]) {
            winningAmount += (bet.oneDieNumBet * 25) / 10;
        }

        if (
            (bet.dieOneNum == dice[0] && bet.dieTwoNum == dice[1]) ||
            (bet.dieOneNum == dice[1] && bet.dieTwoNum == dice[0])
        ) {
            winningAmount += bet.dieOneTwoNumBet * 10;
        }

        return winningAmount;
    }

    function balanceOfPlayer(address _player) external view returns (uint256) {
        return tokenContract.balanceOf(_player);
    }

    function setPlayerBet(uint256[] memory _bet) external {
        uint256 sumAllBet = (_bet[1] + _bet[3] + _bet[5] + _bet[8]);
        require(tokenContract.approveToken(msg.sender, sumAllBet),"Approval failed");
        require(
            tokenContract.transferFrom(
                msg.sender,
                tokenAddress,
                sumAllBet
            ),
            "Failed to transfer CHP tokens."
        );

        registeredPlayers.push(msg.sender);

        playerBet[msg.sender] = Bet(
            _bet[0],
            _bet[1],
            _bet[2],
            _bet[3],
            _bet[4],
            _bet[5],
            _bet[6],
            _bet[7],
            _bet[8]
        );

        emit BetPlaced(msg.sender, sumAllBet);
    }

    function getPlayerBet(address _player) public view returns (Bet memory) {
        require(_player==msg.sender, "You can only view your own bets");
        return playerBet[_player];
    }

    function getPlayerWinningAmount(address _player) public view returns (uint256) {
        require(msg.sender==_player,"You can only check your own balance");
        return playerWinningAmount[_player];
    }

    function distributeWinningAmount() public onlyOwner{
        uint256 amount = getPlayerWinningAmount(msg.sender);
        tokenContract.approveToken(tokenAddress, amount);
        tokenContract.transferFrom(tokenAddress, msg.sender, amount);
        playerWinningAmount[msg.sender]=0;
    }
}
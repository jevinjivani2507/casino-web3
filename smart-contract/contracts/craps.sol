// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Factory.sol";
import "./Random.sol";

contract CrapsGame {
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

    GameFactory tokenContract;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        tokenContract = GameFactory(_tokenAddress);
    }

    address contract_address = 0xda3DEcfF9ABD5D1936b22B3017372BcD07CDa0a8;
    uint256 randomnumber;

    function fromRandom() public {
        VRFv2Consumer v1=VRFv2Consumer(contract_address);
        randomnumber=v1.requestRandomWords();
    }

    function getRandomNum() external view returns (uint256) {
        return randomnumber;
    }

    uint256[] public diceArray;

    function rollDice() external onlyOwner {
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

        uint256 randomIndex1 = randomnumber % 100;
        randomnumber = randomnumber / 100;
        uint256 randomIndex2 = randomnumber % 100;
        randomnumber = randomnumber / 100;

        dice.push(diceArray[randomIndex1 % sumOfRandomNumber]);
        dice.push(diceArray[randomIndex2 % sumOfRandomNumber]);

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
        uint256 sumAllBet = (_bet[1] + _bet[3] + _bet[5] + _bet[8]) * (10 ** 18);
        require(tokenContract.approveToken(address(this), sumAllBet),"paisa nathi");
        require(
            tokenContract.transferFrom(
                msg.sender,
                address(this),
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

    function getPlayerBet(address _player) external view returns (Bet memory) {
        return playerBet[_player];
    }

    function getPlayerWinningAmount(
        address _player
    ) external view returns (uint256) {
        return playerWinningAmount[_player];
    }
}
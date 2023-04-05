// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./random.sol";


contract craps {
     
    // array address of the player
    address[] public players;

    // mapping of the player and the array of bet 
    mapping(address =>uint256[]) public playerBets;

    // player winnig amount
    mapping(address => uint256) public playerWinningAmount;

    // set playerbet array
    function setPlayerBets(uint256[] memory _playerBets) public {
        playerBets[msg.sender] = _playerBets;

    }
    address contract_address=0x9f3412378B57f97B7873Bc51594Be0A62C604e4a;
    uint256 randomnumber;
    function fromRandom() public{
        VRFv2Consumer v1=VRFv2Consumer(contract_address);
        randomnumber=v1.requestRandomWords();

    }
    function getRandomNum() external view returns(uint256){
        return randomnumber;
    }
    
    // get player bet array
    function getPlayerBet() public view returns (uint256[] memory) {
        return playerBets[msg.sender];
    }
  

    // get all players bet array
    function getPlayerBets() public view returns (uint256[][] memory) {
        uint256[][] memory playerBetsArray = new uint256[][](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            playerBetsArray[i] = playerBets[players[i]];
        }
        return playerBetsArray;
    }


    // diceArray
    uint256[] public diceArray;
    uint256[] public originalDice;

    // function to roll the dice return array of two numbers 2 and 3
    function rollDice() public returns (uint256[] memory) {
        // get array of last 6 number of randomnumber
        uint256[] memory randomNumber = new uint256[](6);
        for(uint256 i = 0; i < 6; i++) {
            randomNumber[i] = randomnumber % 10;
            randomnumber = randomnumber / 10;
        }
        // get two random number from the array

        uint256 sumOfRandomNumber = randomNumber[0] + randomNumber[1] + randomNumber[2] + randomNumber[3] + randomNumber[4] + randomNumber[5];

        uint256[] memory diceRandomArray = new uint256[](sumOfRandomNumber);

        uint256 ct = 0;
        for(uint256 i = 0; i < 6; i++) {
            for(uint256 j = 0; j < randomNumber[i]; j++) {
                diceRandomArray[ct] = i + 1;
                ct = ct+1;
            }
        }

        diceArray = diceRandomArray;

        uint256[] memory dice = new uint256[](2);

        uint256 random1 = randomnumber % 100; 
        randomnumber = randomnumber / 100;
        uint256 random2 = randomnumber % 100;
        randomnumber = randomnumber / 100;

        dice[0] = diceRandomArray[random1%sumOfRandomNumber];
        dice[1] = diceRandomArray[random2%sumOfRandomNumber];

        originalDice = dice;

        return dice;

    }

    // getDiceArray
    function getDiceArray() public view returns (uint256[] memory) {
        return diceArray;
    }

    // getOriginalDice
    function getOriginalDice() public view returns (uint256[] memory) {
        return originalDice;
    }

    // set winnig amount of each player
    function setPlayerWinningAmount(uint256 _winningAmount, address _player) public {
        playerWinningAmount[_player] = _winningAmount;
    }

    // calculate the winning amount of each player
    function calculateWinningAmount() public {
        uint256[] memory dice = rollDice();
        uint256 sum = dice[0] + dice[1];
        
        for (uint256 i = 0; i < players.length; i++) {
            // winning amount of each player
            uint256 winningAmount = 0;

            // get player bet
            uint256[] memory playerBet = playerBets[players[i]];

            // check sum
            if(playerBet[0] == sum) {
                winningAmount += (playerBet[1] * 7)/10;
            }

            // check first
            if(playerBet[2] == dice[0] || playerBet[2] == dice[1]) {
                winningAmount += (playerBet[3] * 5)/10;
            }

            // check second
            if(playerBet[4] == dice[0] || playerBet[4] == dice[1]) {
                winningAmount += (playerBet[5] * 7)/10;
            }

            // check oddEven
            if(playerBet[6] == 1 && (sum % 2 == 0)) {
                winningAmount += (playerBet[7] * 3)/10;
            } else if(playerBet[6] == 2 && (sum % 2 != 0)) {
                winningAmount += (playerBet[7] * 3)/10;
            }
            setPlayerWinningAmount(winningAmount, players[i]);
        }
    }

    // get an array of winning amount of each player
    function getPlayerWinningAmount() public view returns (uint256[] memory) {
        uint256[] memory winningAmount = new uint256[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            winningAmount[i] = playerWinningAmount[players[i]];
        }
        return winningAmount;
    }


}
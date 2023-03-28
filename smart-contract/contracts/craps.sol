// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract craps {
     
    // array address of the player
    address[] public players;

    // mapping of the player and the array of bet 
    mapping(address => uint256[]) public playerBets;

    // player winnig amount
    mapping(address => uint256) public playerWinningAmount;

    // set playerbet array
    function setPlayerBets(uint256[] memory _playerBets) public {
        playerBets[msg.sender] = _playerBets;
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



    // function to roll the dice return array of two numbers 2 and 3
    function rollDice() public pure returns (uint256[] memory) {
        uint256[] memory dice = new uint256[](2);
        dice[0] = 2;
        dice[1] = 3;
        return dice;
    }

    // set winnig amount of each player
    function setPlayerWinningAmount(uint256 _winningAmount, address _player) public {
        playerWinningAmount[_player] = _winningAmount;
    }

    // sum sumAmount first firstAmount second secondAmount oddEven oddEvenAmount

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
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./token.sol";
import "./random.sol";
import "./library.sol";

contract BaccaratGame {
    address public owner;
    address public tokenAddress;
    uint256 public betAmount;
    bool closed = false;

    struct Card {
        uint256 cardNumber;
        string cardSuit;
    }

    struct Player {
        bool isRegistered;
        uint256 betAmount;
        Card card1;
        Card card2;
    }

    address[] public registeredPlayers;

    mapping(address => Player) public players;
    mapping(address => uint256) public playerCardSumValue;
    mapping(address => uint256) public playerWinningAmount;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can call this function."
        );
        _;
    }

    Token tokenContract;

    constructor(
        address _tokenAddress,
        uint256 _betAmount,
        address _owner
    ) {
        owner = _owner;
        tokenAddress = _tokenAddress;
        betAmount = _betAmount;
        tokenContract = Token(_tokenAddress);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    mapping(address => bool) registered;

    function registerPlayer() public {
        require(registered[msg.sender] == false, "Already registered");
        require(closed == false, "Game already started");
        require(registeredPlayers.length <= 8, "Max players reached.");
        require(
            !players[msg.sender].isRegistered,
            "Player already registered."
        );
        require(
            tokenContract.balanceOf(msg.sender) >= betAmount,
            "Insufficient balance."
        );
        require(
            tokenContract.approveToken(msg.sender, betAmount),
            "paisa nathi"
        );

        players[msg.sender].isRegistered = true;
        players[msg.sender].betAmount = betAmount;
        registeredPlayers.push(msg.sender);
        tokenContract.transferFrom(msg.sender, tokenAddress, betAmount);
        registered[msg.sender] = true;
    }

    address contract_address = 0xda3DEcfF9ABD5D1936b22B3017372BcD07CDa0a8;
    uint256 randomnumber;

    function fromRandom() public onlyOwner {
        VRFv2Consumer v1 = VRFv2Consumer(contract_address);
        randomnumber = v1.requestRandomWords();

        // randomnumber=12345678912345678912345678912345;
    }

    // function getRandomNum() external view returns (uint256) {
    //     return randomnumber;
    // }

    function distributeCards() public onlyOwner {
        require(closed==false,"Game already started");
        require(registeredPlayers.length > 1, "Not enough players");
        fromRandom();
        closed = true;

        for (uint256 i = 0; i < registeredPlayers.length; i++) {
            uint256 suit1;
            uint256 suit2;
            uint256 card1;
            uint256 card2;

            (randomnumber, suit1, suit2, card1, card2) = probability.getCard(
                randomnumber
            );

            players[registeredPlayers[i]].card1.cardNumber = card1;
            players[registeredPlayers[i]].card2.cardNumber = card2;

            players[registeredPlayers[i]].card1.cardSuit = suit1 == 1
                ? "Spades"
                : suit1 == 2
                ? "Hearts"
                : suit1 == 3
                ? "Clubs"
                : "Diamonds";
            players[registeredPlayers[i]].card2.cardSuit = suit2 == 1
                ? "Spades"
                : suit2 == 2
                ? "Hearts"
                : suit2 == 3
                ? "Clubs"
                : "Diamonds";
        }
    }

    function playerCards(address _player)
        public
        view
        returns (Card memory, Card memory)
    {
        require(_player == msg.sender, "You can only view your cards");
        return (players[_player].card1, players[_player].card2);
    }

    // calculate winning amount for each player
    function calculateCardSumValue() external onlyOwner {
        for (uint256 i = 0; i < registeredPlayers.length; i++) {
            uint256 cardSum = 0;

            if (players[registeredPlayers[i]].card1.cardNumber < 10) {
                cardSum += players[registeredPlayers[i]].card1.cardNumber;
            }
            if (players[registeredPlayers[i]].card2.cardNumber < 10) {
                cardSum += players[registeredPlayers[i]].card2.cardNumber;
            }
            playerCardSumValue[registeredPlayers[i]] = cardSum;
        }
    }

    // get winning amount to each playe
    function getCardSumValue(address _player) public view returns (uint256) {
        require(_player == msg.sender, "You can only view your own value");
        return playerCardSumValue[_player];
    }

    function distributeWinningAmount() public onlyOwner {
        uint256 totalWinningAmount = getTokenBalance();

        address[] memory top3Players;
        top3Players = getTop3Players();
        if (registeredPlayers.length >= 5) {
            playerWinningAmount[top3Players[0]] =
                (totalWinningAmount * 40) /
                100;
            playerWinningAmount[top3Players[1]] =
                (totalWinningAmount * 30) /
                100;
            playerWinningAmount[top3Players[2]] =
                (totalWinningAmount * 20) /
                100;
        } else if (registeredPlayers.length == 4) {
            playerWinningAmount[top3Players[0]] =
                (totalWinningAmount * 50) /
                100;
            playerWinningAmount[top3Players[1]] =
                (totalWinningAmount * 40) /
                100;
        } else if (registeredPlayers.length == 3) {
            playerWinningAmount[top3Players[0]] =
                (totalWinningAmount * 60) /
                100;
            playerWinningAmount[top3Players[1]] =
                (totalWinningAmount * 30) /
                100;
        } else if (registeredPlayers.length == 2) {
            playerWinningAmount[top3Players[0]] =
                (totalWinningAmount * 90) /
                100;
        }

        closed = true;
    }

    function getWinningAmount(address _player) public view returns (uint256) {
        require(
            _player == msg.sender,
            "You can only view your own winning amount"
        );
        return playerWinningAmount[_player];
    }

    function withdrawWinningAmount() public {
        require(
            playerWinningAmount[msg.sender] > 0,
            "You have no winning amount"
        );
        uint256 amount = playerWinningAmount[msg.sender];
        tokenContract.approveToken(tokenAddress, amount);
        tokenContract.transferFrom(tokenAddress, msg.sender, amount);
        playerWinningAmount[msg.sender] = 0;
    }

    function getTop3Players() public view returns (address[] memory) {
        address[] memory top3Players = new address[](3);
        uint256[] memory top3PlayersCardValueSum = new uint256[](3);
        for (uint256 i = 0; i < registeredPlayers.length; i++) {
            if (
                playerCardSumValue[registeredPlayers[i]] >
                top3PlayersCardValueSum[0]
            ) {
                top3PlayersCardValueSum[2] = top3PlayersCardValueSum[1];
                top3PlayersCardValueSum[1] = top3PlayersCardValueSum[0];
                top3PlayersCardValueSum[0] = playerCardSumValue[
                    registeredPlayers[i]
                ];
                top3Players[2] = top3Players[1];
                top3Players[1] = top3Players[0];
                top3Players[0] = registeredPlayers[i];
            } else if (
                playerCardSumValue[registeredPlayers[i]] >
                top3PlayersCardValueSum[1]
            ) {
                top3PlayersCardValueSum[2] = top3PlayersCardValueSum[1];
                top3PlayersCardValueSum[1] = playerCardSumValue[
                    registeredPlayers[i]
                ];
                top3Players[2] = top3Players[1];
                top3Players[1] = registeredPlayers[i];
            } else if (
                playerCardSumValue[registeredPlayers[i]] >
                top3PlayersCardValueSum[2]
            ) {
                top3PlayersCardValueSum[2] = playerCardSumValue[
                    registeredPlayers[i]
                ];
                top3Players[2] = registeredPlayers[i];
            }
        }
        return top3Players;
    }

    function isPlayerRegistered(address _player) public view returns (bool) {
        return registered[_player];
    }

    function getWinningAmount(_player) public view returns (uint256) {
        return playerWinningAmount[_player];
    }

    function getGameStatus() public view returns (bool) {
        return closed;
    }

    function getTokenBalance() public view returns (uint256) {
        return registeredPlayers.length * betAmount;
    }
}

pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";


contract VRFD20 is VRFConsumerBaseV2 {
    mapping(uint256 => address) private s_rollers;
    mapping(address => uint256) private s_results;
    VRFCoordinatorV2Interface COORDINATOR;
    uint256 private constant ROLL_IN_PROGRESS = 42;
    uint64 s_subscriptionId;
    // address vrfCoordinator = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;
    bytes32 s_keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    address s_owner;
    uint32 callbackGasLimit = 40000;
    uint16 requestConfirmations = 3;
    uint32 numWords =  1;   
    uint256 randomnum;

    // constructor
    
    constructor(uint64 subscriptionId) VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625) {
        COORDINATOR = VRFCoordinatorV2Interface(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }
    event DiceRolled(uint256 indexed requestId, address indexed roller);    
    event DiceLanded(uint256 indexed requestId, uint256 indexed result);
    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    function rollDice(address roller) external onlyOwner returns (uint256 requestId) {
        require(s_results[roller] == 0, "Already rolled");
        requestId = COORDINATOR.requestRandomWords(
        s_keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
       );

        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        randomnum= requestId;
        emit DiceRolled(requestId, roller);
        return requestId;
    }
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

        uint256 d20Value = (randomWords[0] % 20) + 1;
        s_results[s_rollers[requestId]] = d20Value;
        emit DiceLanded(requestId, d20Value);
    }

    
}
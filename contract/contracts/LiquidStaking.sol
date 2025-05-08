// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./ScobyToken.sol";

contract LiquidStaking {
    ScobyToken public rewardToken;
    address public owner;

    uint256 public constant REWARD_RATE = 10; // 10% APR
    uint256 public constant SECONDS_IN_YEAR = 365 days;
    uint256 public constant UNLOCK_DELAY = 7 days;

    struct StakeInfo {
        uint256 amount;
        uint256 lastClaimed;
    }

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _rewardToken) {
        rewardToken = ScobyToken(_rewardToken);
        owner = msg.sender;
    }

    function stake() external payable {
        require(msg.value > 0, "Must stake ETH");

        _claimRewards(msg.sender);

        stakes[msg.sender].amount += msg.value;
        stakes[msg.sender].lastClaimed = block.timestamp;
        totalStaked += msg.value;
    }

    function unstake(uint256 amount) external {
        require(stakes[msg.sender].amount >= amount, "Insufficient stake");

        _claimRewards(msg.sender);

        stakes[msg.sender].amount -= amount;
        stakes[msg.sender].lastClaimed = block.timestamp;
        totalStaked -= amount;

        payable(msg.sender).transfer(amount);
    }

    function claimRewards() external {
        _claimRewards(msg.sender);
        stakes[msg.sender].lastClaimed = block.timestamp;
    }

    function _claimRewards(address user) internal {
        StakeInfo storage stakeData = stakes[user];
        if (stakeData.amount == 0) return;

        uint256 timeElapsed = block.timestamp - stakeData.lastClaimed;
        if (timeElapsed == 0) return;

        uint256 reward = (stakeData.amount * REWARD_RATE * timeElapsed) /
            (100 * SECONDS_IN_YEAR);

        try rewardToken.mint(user, reward) {
            // Mint successful
        } catch {
            // Mint failed — max supply hit or other issue
        }
    }

    function getPendingRewards(address user) external view returns (uint256) {
        StakeInfo storage stakeData = stakes[user];
        if (stakeData.amount == 0) return 0;

        uint256 timeElapsed = block.timestamp - stakeData.lastClaimed;
        return
            (stakeData.amount * REWARD_RATE * timeElapsed) /
            (100 * SECONDS_IN_YEAR);
    }

    function getStakedAmount(address user) external view returns (uint256) {
        return stakes[user].amount;
    }

    function getUnlockTime(address user) external view returns (uint256) {
        return stakes[user].lastClaimed + UNLOCK_DELAY;
    }

    function isUnlocked(address user) external view returns (bool) {
        return block.timestamp >= stakes[user].lastClaimed + UNLOCK_DELAY;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTVL() external view returns (uint256) {
        return totalStaked;
    }
}

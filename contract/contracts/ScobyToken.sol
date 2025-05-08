// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScobyToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 2_000_000 * 1e18;

    constructor() ERC20("ScobyToken", "SCOB") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 1e18); // initial supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds Max Supply");
        _mint(to, amount);
    }
}

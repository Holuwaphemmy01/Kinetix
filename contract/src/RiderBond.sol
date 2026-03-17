// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RiderBond {
    address public owner;
    address public relayer;

    constructor(address _relayer) {
        owner = msg.sender;
        relayer = _relayer;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "OWN");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "REL");
        _;
    }

    function setRelayer(address _r) external onlyOwner {
        relayer = _r;
    }

    mapping(address => uint256) public bond;

    event BondStaked(address indexed rider, uint256 amount);
    event BondWithdrawn(address indexed rider, uint256 amount);
    event BondSlashed(address indexed rider, uint256 amount);

    function stake(uint256 amount) external {
        bond[msg.sender] += amount;
        emit BondStaked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(bond[msg.sender] >= amount, "BAL");
        bond[msg.sender] -= amount;
        emit BondWithdrawn(msg.sender, amount);
    }

    function slash(address rider, uint256 amount) external onlyRelayer {
        require(bond[rider] >= amount, "BAL");
        bond[rider] -= amount;
        emit BondSlashed(rider, amount);
    }
}

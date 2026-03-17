// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FuelWallet {
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

    mapping(address => bool) public merchant;

    event MerchantUpdated(address indexed m, bool allowed);
    event FuelSpent(bytes32 indexed tripId, address indexed rider, address indexed m, uint256 amount);

    function setMerchant(address m, bool allowed) external onlyOwner {
        merchant[m] = allowed;
        emit MerchantUpdated(m, allowed);
    }

    function spend(bytes32 tripId, address rider, address m, uint256 amount) external onlyRelayer {
        require(merchant[m], "MER");
        emit FuelSpent(tripId, rider, m, amount);
    }
}

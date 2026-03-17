// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract KinetixVault {
    address public owner;
    address public relayer;
    address public cngn;
    bool public paused;
    bool private locked;

    constructor(address _relayer, address _cngn) {
        owner = msg.sender;
        relayer = _relayer;
        cngn = _cngn;
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

    function setToken(address _c) external onlyOwner {
        cngn = _c;
    }
    function pause() external onlyOwner {
        paused = true;
    }
    function unpause() external onlyOwner {
        paused = false;
    }
    modifier nonReentrant() {
        require(!locked, "REENT");
        locked = true;
        _;
        locked = false;
    }
    modifier whenNotPaused() {
        require(!paused, "PAUSE");
        _;
    }

    struct Trip {
        address customer;
        address rider;
        uint256 total;
        uint256 operationalCap;
        uint256 streamed;
        uint256 held;
        bool frozen;
        bool settled;
    }

    mapping(bytes32 => Trip) public trips;

    event EscrowCreated(bytes32 indexed id, address customer, address rider, uint256 total, uint256 operationalCap, uint256 held);
    event StreamTicked(bytes32 indexed id, uint256 amount, uint256 streamed);
    event StreamFrozen(bytes32 indexed id);
    event StreamUnfrozen(bytes32 indexed id);
    event TripSettled(bytes32 indexed id, uint256 paidOperational, uint256 paidHeld);
    event ProgressReported(bytes32 indexed id, uint256 metersAdvanced, uint256 streamedAfter);
    event DeviationReported(bytes32 indexed id, int256 vector, uint256 timestamp);
    event ReentryReported(bytes32 indexed id, uint256 timestamp);

    function depositEscrow(bytes32 id, address customer, address rider, uint256 total) external onlyRelayer nonReentrant {
        require(cngn != address(0), "TOK");
        require(trips[id].total == 0, "EXISTS");
        require(IERC20(cngn).allowance(customer, address(this)) >= total, "ALLOW");
        require(IERC20(cngn).transferFrom(customer, address(this), total), "XFERF");
        uint256 held = total * 70 / 100;
        uint256 opCap = total - held;
        trips[id] = Trip(customer, rider, total, opCap, 0, held, false, false);
        emit EscrowCreated(id, customer, rider, total, opCap, held);
    }

    function tickStream(bytes32 id, uint256 amount) external onlyRelayer nonReentrant whenNotPaused {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        require(!t.frozen, "FRZ");
        require(!t.settled, "SET");
        require(t.streamed + amount <= t.operationalCap, "CAP");
        t.streamed += amount;
        require(IERC20(cngn).transfer(t.rider, amount), "XFER");
        emit StreamTicked(id, amount, t.streamed);
    }

    function freeze(bytes32 id) external onlyRelayer {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        if (!t.frozen) {
            t.frozen = true;
            emit StreamFrozen(id);
        }
    }

    function unfreeze(bytes32 id) external onlyRelayer {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        if (t.frozen) {
            t.frozen = false;
            emit StreamUnfrozen(id);
        }
    }

    function settle(bytes32 id) external onlyRelayer nonReentrant whenNotPaused {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        require(!t.settled, "SET");
        t.settled = true;
        require(IERC20(cngn).transfer(t.rider, t.held), "XFERH");
        emit TripSettled(id, t.streamed, t.held);
    }

    function reportProgress(bytes32 id, uint256 metersAdvanced) external onlyRelayer whenNotPaused {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        emit ProgressReported(id, metersAdvanced, t.streamed);
    }
    function reportDeviation(bytes32 id, int256 vector) external onlyRelayer {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        if (!t.frozen) {
            t.frozen = true;
            emit StreamFrozen(id);
        }
        emit DeviationReported(id, vector, block.timestamp);
    }
    function reportReentry(bytes32 id) external onlyRelayer {
        Trip storage t = trips[id];
        require(t.total != 0, "UNK");
        if (t.frozen) {
            t.frozen = false;
            emit StreamUnfrozen(id);
        }
        emit ReentryReported(id, block.timestamp);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/RiderBond.sol";

contract RelayerBond {
    RiderBond public rb;
    constructor(RiderBond _rb) { rb = _rb; }
    function slash(address rider, uint256 amount) external { rb.slash(rider, amount); }
}

contract RiderActor {
    RiderBond public rb;
    constructor(RiderBond _rb) { rb = _rb; }
    function stake(uint256 amount) external { rb.stake(amount); }
    function withdraw(uint256 amount) external { rb.withdraw(amount); }
}

contract RiderBondTest {
    function testStakeWithdrawSlashAndGuards() external {
        RiderBond rb = new RiderBond(address(this));
        RelayerBond rel = new RelayerBond(rb);
        rb.setRelayer(address(rel));
        rb.stake(500);
        assert(rb.bond(address(this)) == 500);
        rb.withdraw(200);
        assert(rb.bond(address(this)) == 300);
        RiderActor rider = new RiderActor(rb);
        rider.stake(400);
        assert(rb.bond(address(rider)) == 400);
        rel.slash(address(rider), 150);
        assert(rb.bond(address(rider)) == 250);
        try rb.slash(address(rider), 50) { assert(false); } catch { }
        rider.withdraw(100);
        assert(rb.bond(address(rider)) == 150);
        try rider.withdraw(200) { assert(false); } catch { }
    }
}

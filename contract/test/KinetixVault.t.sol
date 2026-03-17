// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/KinetixVault.sol";
import "../src/MockERC20.sol";

contract RelayerKV {
    KinetixVault public kv;
    constructor(KinetixVault _kv) { kv = _kv; }
    function deposit(bytes32 id, address customer, address rider, uint256 total) external { kv.depositEscrow(id, customer, rider, total); }
    function tick(bytes32 id, uint256 amount) external { kv.tickStream(id, amount); }
    function freeze(bytes32 id) external { kv.freeze(id); }
    function unfreeze(bytes32 id) external { kv.unfreeze(id); }
    function settle(bytes32 id) external { kv.settle(id); }
}

contract CustomerActor {
    MockERC20 public token;
    constructor(MockERC20 _t) { token = _t; }
    function approve(address spender, uint256 amount) external returns (bool) { return token.approve(spender, amount); }
}

contract KinetixVaultTest {
    function testFlowAndGuards() external {
        MockERC20 token = new MockERC20();
        KinetixVault kv = new KinetixVault(address(this), address(token));
        RelayerKV rel = new RelayerKV(kv);
        kv.setRelayer(address(rel));
        bytes32 id = keccak256("trip1");
        CustomerActor customerC = new CustomerActor(token);
        address customer = address(customerC);
        address rider = address(0xB1);
        token.mint(customer, 1000);
        customerC.approve(address(kv), 1000);
        rel.deposit(id, customer, rider, 1000);
        (address c,address r,uint256 total,uint256 op,uint256 streamed,uint256 held,bool frozen,bool settled) = kv.trips(id);
        assert(total == 1000);
        assert(op == 300);
        assert(held == 700);
        assert(streamed == 0);
        assert(frozen == false);
        assert(settled == false);
        assert(token.balanceOf(address(kv)) == 1000);
        assert(token.balanceOf(rider) == 0);
        // double deposit on same id should revert with EXISTS even if allowance present
        CustomerActor customerC2 = new CustomerActor(token);
        address customer2 = address(customerC2);
        token.mint(customer2, 1000);
        customerC2.approve(address(kv), 1000);
        try rel.deposit(id, customer2, rider, 1000) { assert(false); } catch { }
        // insufficient allowance should revert
        CustomerActor customerC3 = new CustomerActor(token);
        address customer3 = address(customerC3);
        token.mint(customer3, 1000);
        bytes32 id2 = keccak256("trip2");
        try rel.deposit(id2, customer3, rider, 1000) { assert(false); } catch { }
        // pausability: payout and settlement blocked while paused
        kv.pause();
        try rel.tick(id, 100) { } catch { }
        kv.unpause();
        rel.tick(id, 100);
        (, , , , streamed, , , ) = kv.trips(id);
        assert(streamed == 100);
        assert(token.balanceOf(rider) == 100);
        assert(token.balanceOf(address(kv)) == 900);
        try rel.tick(id, 250) { assert(false); } catch { }
        rel.freeze(id);
        (, , , , , , frozen, ) = kv.trips(id);
        assert(frozen == true);
        try rel.tick(id, 50) { assert(false); } catch { }
        rel.unfreeze(id);
        (, , , , , , frozen, ) = kv.trips(id);
        assert(frozen == false);
        kv.pause();
        try rel.settle(id) { } catch { }
        kv.unpause();
        rel.tick(id, 50);
        (, , , , streamed, , , ) = kv.trips(id);
        assert(streamed == 150);
        assert(token.balanceOf(rider) == 150);
        assert(token.balanceOf(address(kv)) == 850);
        try kv.freeze(id) { assert(false); } catch { }
        rel.settle(id);
        (, , , , , , , settled) = kv.trips(id);
        assert(settled == true);
        assert(token.balanceOf(rider) == 850);
        assert(token.balanceOf(address(kv)) == 150);
        try rel.tick(id, 10) { assert(false); } catch { }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/KinetixVault.sol";

contract RelayerKV {
    KinetixVault public kv;
    constructor(KinetixVault _kv) { kv = _kv; }
    function create(bytes32 id, address customer, address rider, uint256 total) external { kv.createEscrow(id, customer, rider, total); }
    function tick(bytes32 id, uint256 amount) external { kv.tickStream(id, amount); }
    function freeze(bytes32 id) external { kv.freeze(id); }
    function unfreeze(bytes32 id) external { kv.unfreeze(id); }
    function settle(bytes32 id) external { kv.settle(id); }
}

contract KinetixVaultTest {
    function testFlowAndGuards() external {
        KinetixVault kv = new KinetixVault(address(this));
        RelayerKV rel = new RelayerKV(kv);
        kv.setRelayer(address(rel));
        bytes32 id = keccak256("trip1");
        rel.create(id, address(0xC1), address(0xB1), 1000);
        (address c,address r,uint256 total,uint256 op,uint256 streamed,uint256 held,bool frozen,bool settled) = kv.trips(id);
        assert(total == 1000);
        assert(op == 300);
        assert(held == 700);
        assert(streamed == 0);
        assert(frozen == false);
        assert(settled == false);
        rel.tick(id, 100);
        (, , , , streamed, , , ) = kv.trips(id);
        assert(streamed == 100);
        try rel.tick(id, 250) { assert(false); } catch { }
        rel.freeze(id);
        (, , , , , , frozen, ) = kv.trips(id);
        assert(frozen == true);
        try rel.tick(id, 50) { assert(false); } catch { }
        rel.unfreeze(id);
        (, , , , , , frozen, ) = kv.trips(id);
        assert(frozen == false);
        rel.tick(id, 50);
        (, , , , streamed, , , ) = kv.trips(id);
        assert(streamed == 150);
        try kv.freeze(id) { assert(false); } catch { }
        rel.settle(id);
        (, , , , , , , settled) = kv.trips(id);
        assert(settled == true);
        try rel.tick(id, 10) { assert(false); } catch { }
    }
}

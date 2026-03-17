// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/FuelWallet.sol";

contract RelayerFuel {
    FuelWallet public fw;
    constructor(FuelWallet _fw) { fw = _fw; }
    function spend(bytes32 tripId, address rider, address m, uint256 amount) external { fw.spend(tripId, rider, m, amount); }
}

contract FuelWalletTest {
    function testMerchantAllowlistAndSpendGuards() external {
        FuelWallet fw = new FuelWallet(address(this));
        RelayerFuel rel = new RelayerFuel(fw);
        fw.setRelayer(address(rel));
        address m = address(0xA1);
        fw.setMerchant(m, true);
        rel.spend(keccak256("t1"), address(0xB3), m, 500);
        fw.setMerchant(address(0xA2), false);
        try rel.spend(keccak256("t2"), address(0xB4), address(0xA2), 300) { assert(false); } catch { }
        try fw.spend(keccak256("t3"), address(0xB5), m, 200) { assert(false); } catch { }
    }
}

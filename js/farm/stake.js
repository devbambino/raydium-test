"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stake = void 0;
const config_1 = require("../config");
const stake = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const raydium = yield (0, config_1.initSdk)();
    const targetFarm = 'CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS'; // RAY-USDC farm
    // note: api doesn't support get devnet farm info
    const farmInfo = (yield raydium.api.fetchFarmInfoById({ ids: targetFarm }))[0];
    const amount = (_a = raydium.account.tokenAccountRawInfos.find((a) => a.accountInfo.mint.toBase58() === farmInfo.lpMint.address)) === null || _a === void 0 ? void 0 : _a.accountInfo.amount;
    if (!amount || amount.isZero())
        throw new Error('user do not have lp amount');
    const { execute } = yield raydium.farm.deposit({
        farmInfo,
        amount,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('farm deposited:', { txId });
});
exports.stake = stake;
/** uncomment code below to execute */
// stake()
//# sourceMappingURL=stake.js.map
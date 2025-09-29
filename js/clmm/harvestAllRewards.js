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
exports.harvestAllRewards = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const harvestAllRewards = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const allPosition = yield raydium.clmm.getOwnerPositionInfo({ programId: raydium_sdk_v2_1.CLMM_PROGRAM_ID });
    const nonZeroPosition = allPosition.filter((p) => !p.liquidity.isZero());
    if (!nonZeroPosition.length)
        throw new Error('use do not have position');
    // RAY-USDC pool
    // note: api doesn't support get devnet pool info
    const positionPoolInfoList = (yield raydium.api.fetchPoolById({
        ids: nonZeroPosition.map((p) => p.poolId.toBase58()).join(','),
    }));
    const allPositions = nonZeroPosition.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur.poolId.toBase58()]: acc[cur.poolId.toBase58()] ? acc[cur.poolId.toBase58()].concat(cur) : [cur] })), {});
    const { execute } = yield raydium.clmm.harvestAllRewards({
        allPoolInfo: positionPoolInfoList.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur.id]: cur })), {}),
        allPositions,
        ownerInfo: {
            useSOLBalance: true,
        },
        programId: raydium_sdk_v2_1.CLMM_PROGRAM_ID,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txIds } = yield execute();
    console.log('harvested all clmm rewards:', { txIds });
});
exports.harvestAllRewards = harvestAllRewards;
/** uncomment code below to execute */
// harvestAllRewards()
//# sourceMappingURL=harvestAllRewards.js.map
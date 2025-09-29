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
exports.closePosition = void 0;
const config_1 = require("../config");
const utils_1 = require("./utils");
const closePosition = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // SOL-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv' });
    const poolInfo = data[0];
    if (!poolInfo)
        throw new Error('pool not found');
    if (!(0, utils_1.isValidClmm)(poolInfo.programId))
        throw new Error('target pool is not CLMM pool');
    /** code below will get on chain realtime price to avoid slippage error, uncomment it if necessary */
    // const rpcData = await raydium.clmm.getRpcClmmPoolInfo({ poolId: poolInfo.id })
    // poolInfo.price = rpcData.currentPrice
    const allPosition = yield raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId });
    if (!allPosition.length)
        throw new Error('use do not have position');
    const position = allPosition.find((p) => p.poolId.toBase58() === poolInfo.id);
    if (!position)
        throw new Error(`use do not have position in pool: ${poolInfo.id}`);
    const { execute } = yield raydium.clmm.closePosition({
        poolInfo,
        ownerPosition: position,
        txVersion: config_1.txVersion,
    });
    const { txId } = yield execute();
    console.log('clmm position closed:', { txId });
});
exports.closePosition = closePosition;
/** uncomment code below to execute */
// closePosition()
//# sourceMappingURL=closePosition.js.map
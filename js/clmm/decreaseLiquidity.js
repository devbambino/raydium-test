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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseLiquidity = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const utils_1 = require("./utils");
const decreaseLiquidity = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // SOL-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidClmm)(poolInfo.programId))
        throw new Error('target pool is not CLMM pool');
    const allPosition = yield raydium.clmm.getOwnerPositionInfo({ programId: poolInfo.programId });
    if (!allPosition.length)
        throw new Error('use do not have position');
    const position = allPosition.find((p) => p.poolId.toBase58() === poolInfo.id);
    if (!position)
        throw new Error(`use do not have position in pool: ${poolInfo.id}`);
    /** code below will get on chain realtime price to avoid slippage error, uncomment it if necessary */
    // const rpcData = await raydium.clmm.getRpcClmmPoolInfo({ poolId: poolInfo.id })
    // poolInfo.price = rpcData.currentPrice
    const { execute } = yield raydium.clmm.decreaseLiquidity({
        poolInfo,
        ownerPosition: position,
        ownerInfo: {
            useSOLBalance: true,
            closePosition: true, // if liquidity wants to decrease doesn't equal to position liquidity, set to false
        },
        liquidity: position.liquidity,
        amountMinA: new bn_js_1.default(0),
        amountMinB: new bn_js_1.default(0),
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('withdraw liquidity from clmm position:', { txId });
});
exports.decreaseLiquidity = decreaseLiquidity;
/** uncomment code below to execute */
// decreaseLiquidity()
//# sourceMappingURL=decreaseLiquidity.js.map
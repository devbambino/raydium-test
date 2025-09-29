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
exports.increaseLiquidity = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const decimal_js_1 = __importDefault(require("decimal.js"));
const utils_1 = require("./utils");
const increaseLiquidity = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // SOL-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv' });
    const poolInfo = data[0];
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
    const inputAmount = 0.0001; // SOL UI amount
    const slippage = 0.005;
    const epochInfo = yield raydium.fetchEpochInfo();
    const res = yield raydium_sdk_v2_1.PoolUtils.getLiquidityAmountOutFromAmountIn({
        poolInfo,
        slippage: 0,
        inputA: true,
        tickUpper: Math.max(position.tickLower, position.tickUpper),
        tickLower: Math.min(position.tickLower, position.tickUpper),
        amount: new bn_js_1.default(new decimal_js_1.default(inputAmount || '0').mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0)),
        add: true,
        amountHasFee: true,
        epochInfo: epochInfo,
    });
    const { execute } = yield raydium.clmm.increasePositionFromLiquidity({
        poolInfo,
        ownerPosition: position,
        ownerInfo: {
            useSOLBalance: true,
        },
        liquidity: new bn_js_1.default(new decimal_js_1.default(res.liquidity.toString()).mul(1 - slippage).toFixed(0)),
        amountMaxA: new bn_js_1.default(new decimal_js_1.default(inputAmount || '0').mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0)),
        amountMaxB: new bn_js_1.default(new decimal_js_1.default(res.amountSlippageB.amount.toString()).mul(1 + slippage).toFixed(0)),
        checkCreateATAOwner: true,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('clmm position liquidity increased:', { txId });
});
exports.increaseLiquidity = increaseLiquidity;
/** uncomment code below to execute */
// increaseLiquidity()
//# sourceMappingURL=increaseLiquidity.js.map
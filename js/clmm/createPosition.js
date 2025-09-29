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
exports.createPosition = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const decimal_js_1 = __importDefault(require("decimal.js"));
const utils_1 = require("./utils");
const createPosition = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // RAY-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidClmm)(poolInfo.programId))
        throw new Error('target pool is not CLMM pool');
    /** code below will get on chain realtime price to avoid slippage error, uncomment it if necessary */
    // const rpcData = await raydium.clmm.getRpcClmmPoolInfo({ poolId: poolInfo.id })
    // poolInfo.price = rpcData.currentPrice
    const inputAmount = 1; // RAY amount
    const [startPrice, endPrice] = [0.1, 100];
    const { tick: lowerTick } = raydium_sdk_v2_1.TickUtils.getPriceAndTick({
        poolInfo,
        price: new decimal_js_1.default(startPrice),
        baseIn: true,
    });
    const { tick: upperTick } = raydium_sdk_v2_1.TickUtils.getPriceAndTick({
        poolInfo,
        price: new decimal_js_1.default(endPrice),
        baseIn: true,
    });
    const epochInfo = yield raydium.fetchEpochInfo();
    const res = yield raydium_sdk_v2_1.PoolUtils.getLiquidityAmountOutFromAmountIn({
        poolInfo,
        slippage: 0,
        inputA: true,
        tickUpper: Math.max(lowerTick, upperTick),
        tickLower: Math.min(lowerTick, upperTick),
        amount: new bn_js_1.default(new decimal_js_1.default(inputAmount || '0').mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0)),
        add: true,
        amountHasFee: true,
        epochInfo: epochInfo,
    });
    const { execute, extInfo } = yield raydium.clmm.openPositionFromBase({
        poolInfo,
        tickUpper: Math.max(lowerTick, upperTick),
        tickLower: Math.min(lowerTick, upperTick),
        base: 'MintA',
        ownerInfo: {},
        baseAmount: new bn_js_1.default(new decimal_js_1.default(inputAmount || '0').mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0)),
        otherAmountMax: res.amountSlippageB.amount,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('clmm position opened:', { txId }, ', nft mint:', extInfo.nftMint.toBase58());
});
exports.createPosition = createPosition;
/** uncomment code below to execute */
// createPosition()
//# sourceMappingURL=createPosition.js.map
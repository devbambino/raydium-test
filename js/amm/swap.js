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
exports.swap = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("./utils");
const swap = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const amountIn = 100;
    const poolId = 'FCEnSxyJfRSKsz6tASUENCsfGwKgkH6YuRn1AMmyHhZn';
    // RAY-USDC pool
    // note: api doesn't support get devnet pool info
    const data = (yield raydium.api.fetchPoolById({ ids: poolId }));
    const poolInfo = data[0];
    if (!(0, utils_1.isValidAmm)(poolInfo.programId))
        throw new Error('target pool is not AMM pool');
    const poolKeys = yield raydium.liquidity.getAmmPoolKeys(poolId);
    const res = yield (0, raydium_sdk_v2_1.fetchMultipleInfo)({
        connection: raydium.connection,
        poolKeysList: [poolKeys],
        config: undefined,
    });
    const pool = res[0];
    yield raydium.liquidity.initLayout();
    const out = raydium.liquidity.computeAmountOut({
        poolInfo: Object.assign(Object.assign({}, poolInfo), { baseReserve: pool.baseReserve, quoteReserve: pool.quoteReserve, status: pool.status.toNumber(), version: 4 }),
        amountIn: new bn_js_1.default(amountIn),
        mintIn: poolInfo.mintA.address, // swap mintB -> mintA, use: poolInfo.mintB.address
        mintOut: poolInfo.mintB.address, // swap mintB -> mintA, use: poolInfo.mintA.address
        slippage: 0.01, // range: 1 ~ 0.0001, means 100% ~ 0.01%
    });
    const { execute } = yield raydium.liquidity.swap({
        poolInfo,
        amountIn: new bn_js_1.default(amountIn),
        amountOut: out.minAmountOut, // out.amountOut means amount 'without' slippage
        fixedSide: 'in',
        inputMint: poolInfo.mintA.address, // swap mintB -> mintA, use: poolInfo.mintB.address
        associatedOnly: false,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log(`swap successfully in amm pool:`, { txId });
});
exports.swap = swap;
/** uncomment code below to execute */
// swap()
//# sourceMappingURL=swap.js.map
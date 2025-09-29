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
    // SOL - USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '8THC7UQN8zPXRL61o75fP4gcwRyB5W3o74yHyqarkqZ9' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidCpmm)(poolInfo.programId))
        throw new Error('target pool is not CPMM pool');
    const rpcData = yield raydium.cpmm.getRpcPoolInfo(poolInfo.id, true);
    const inputAmount = new bn_js_1.default(100);
    // swap pool mintA for mintB
    const swapResult = raydium_sdk_v2_1.CurveCalculator.swap(inputAmount, rpcData.baseReserve, rpcData.quoteReserve, rpcData.configInfo.tradeFeeRate);
    /**
     * swapResult.sourceAmountSwapped -> input amount
     * swapResult.destinationAmountSwapped -> output amount
     * swapResult.tradeFee -> this swap fee, charge input mint
     */
    const { execute } = yield raydium.cpmm.swap({
        poolInfo,
        swapResult,
        slippage: 0.1, // range: 1 ~ 0.0001, means 100% ~ 0.01%
        baseIn: true,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log(`swapped: ${poolInfo.mintA.symbol} to ${poolInfo.mintB.symbol}:`, { txId });
});
exports.swap = swap;
/** uncomment code below to execute */
// swap()
//# sourceMappingURL=swap.js.map
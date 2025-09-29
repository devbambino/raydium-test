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
exports.addLiquidity = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const utils_1 = require("./utils");
const decimal_js_1 = __importDefault(require("decimal.js"));
const addLiquidity = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // RAY-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidAmm)(poolInfo.programId))
        throw new Error('target pool is not AMM pool');
    const inputAmount = '1';
    const r = raydium.liquidity.computePairAmount({
        poolInfo,
        amount: inputAmount,
        baseIn: true,
        slippage: new raydium_sdk_v2_1.Percent(1, 100), // 1%
    });
    const { execute } = yield raydium.liquidity.addLiquidity({
        poolInfo,
        amountInA: new raydium_sdk_v2_1.TokenAmount((0, raydium_sdk_v2_1.toToken)(poolInfo.mintA), new decimal_js_1.default(inputAmount).mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0)),
        amountInB: new raydium_sdk_v2_1.TokenAmount((0, raydium_sdk_v2_1.toToken)(poolInfo.mintA), new decimal_js_1.default(r.maxAnotherAmount.toExact()).mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0)),
        fixedSide: 'a',
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('liquidity added:', { txId });
});
exports.addLiquidity = addLiquidity;
/** uncomment code below to execute */
// addLiquidity()
//# sourceMappingURL=addLiquidity.js.map
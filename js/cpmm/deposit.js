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
exports.deposit = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const decimal_js_1 = __importDefault(require("decimal.js"));
const utils_1 = require("./utils");
const deposit = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // SOL - USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '7JuwJuNU88gurFnyWeiyGKbFmExMWcmRZntn9imEzdny' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidCpmm)(poolInfo.programId))
        throw new Error('target pool is not CPMM pool');
    const uiInputAmount = '0.0001';
    const inputAmount = new bn_js_1.default(new decimal_js_1.default(uiInputAmount).mul(Math.pow(10, poolInfo.mintA.decimals)).toFixed(0));
    const slippage = new raydium_sdk_v2_1.Percent(1, 100); // 1%
    const baseIn = true;
    // computePairAmount is not necessary, addLiquidity will compute automatically,
    // just for ui display
    /*
    const computeRes = await raydium.cpmm.computePairAmount({
      poolInfo,
      amount: uiInputAmount,
      slippage,
      baseIn,
      epochInfo: await raydium.fetchEpochInfo()
    })
  
    computeRes.anotherAmount.amount -> pair amount needed to add liquidity
    computeRes.anotherAmount.fee -> token2022 transfer fee, might be undefined if isn't token2022 program
    */
    const { execute } = yield raydium.cpmm.addLiquidity({
        poolInfo,
        inputAmount,
        slippage,
        baseIn,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('pool deposited', { txId });
});
exports.deposit = deposit;
/** uncomment code below to execute */
// deposit()
//# sourceMappingURL=deposit.js.map
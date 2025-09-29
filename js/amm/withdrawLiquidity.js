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
exports.withdrawLiquidity = void 0;
const config_1 = require("../config");
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("./utils");
const withdrawLiquidity = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // RAY-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidAmm)(poolInfo.programId))
        throw new Error('target pool is not AMM pool');
    const { execute } = yield raydium.liquidity.removeLiquidity({
        poolInfo,
        amountIn: new bn_js_1.default(1),
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('liquidity withdraw:', { txId });
});
exports.withdrawLiquidity = withdrawLiquidity;
/** uncomment code below to execute */
// withdrawLiquidity()
//# sourceMappingURL=withdrawLiquidity.js.map
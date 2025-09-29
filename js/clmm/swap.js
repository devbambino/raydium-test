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
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const utils_1 = require("./utils");
const swap = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const poolId = '61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht';
    const inputAmount = new bn_js_1.default(100);
    // RAY-USDC pool
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: poolId });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidClmm)(poolInfo.programId))
        throw new Error('target pool is not CLMM pool');
    const clmmPoolInfo = yield raydium_sdk_v2_1.PoolUtils.fetchComputeClmmInfo({
        connection: raydium.connection,
        poolInfo,
    });
    const tickCache = yield raydium_sdk_v2_1.PoolUtils.fetchMultiplePoolTickArrays({
        connection: raydium.connection,
        poolKeys: [clmmPoolInfo],
    });
    const { minAmountOut, remainingAccounts } = yield raydium_sdk_v2_1.PoolUtils.computeAmountOutFormat({
        poolInfo: clmmPoolInfo,
        tickArrayCache: tickCache[poolId],
        amountIn: inputAmount,
        tokenOut: poolInfo.mintB,
        slippage: 0.01,
        epochInfo: yield raydium.fetchEpochInfo(),
    });
    const { execute } = yield raydium.clmm.swap({
        poolInfo,
        inputMint: poolInfo.mintA.address,
        amountIn: inputAmount,
        amountOutMin: minAmountOut.amount.raw,
        observationId: clmmPoolInfo.observationId,
        ownerInfo: {},
        remainingAccounts,
        txVersion: config_1.txVersion,
    });
    const { txId } = yield execute();
    console.log('swapped in clmm pool:', { txId });
});
exports.swap = swap;
/** uncomment code below to execute */
// swap()
//# sourceMappingURL=swap.js.map
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
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
const config_1 = require("../config");
const utils_1 = require("../cache/utils");
function routeSwap() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const raydium = yield (0, config_1.initSdk)();
        yield raydium.fetchChainTime();
        const inputAmount = '100';
        const SOL = spl_token_1.NATIVE_MINT; // or WSOLMint
        const [inputMint, outputMint] = [SOL, raydium_sdk_v2_1.USDCMint];
        const [inputMintStr, outputMintStr] = [inputMint.toBase58(), outputMint.toBase58()];
        // strongly recommend cache all pool data, it will reduce lots of data fetching time
        // code below is a simple way to cache it, you can implement it with any other ways
        let poolData = (0, utils_1.readCachePoolData)(); // initial cache time is 10 mins(1000 * 60 * 10), if wants to cache longer, set bigger number in milliseconds
        if (poolData.ammPools.length === 0) {
            console.log('fetching all pool basic info, this might take a while (more than 30 seconds)..');
            poolData = yield raydium.tradeV2.fetchRoutePoolBasicInfo();
            (0, utils_1.writeCachePoolData)(poolData);
        }
        console.log('computing swap route..');
        const routes = raydium.tradeV2.getAllRoute(Object.assign({ inputMint,
            outputMint }, poolData));
        const { routePathDict, mintInfos, ammPoolsRpcInfo, ammSimulateCache, clmmPoolsRpcInfo, computeClmmPoolInfo, computePoolTickData, } = yield raydium.tradeV2.fetchSwapRoutesData({
            routes,
            inputMint,
            outputMint,
        });
        console.log('calculating available swap routes...');
        const r = raydium.tradeV2.getAllRouteComputeAmountOut({
            inputTokenAmount: new raydium_sdk_v2_1.TokenAmount(new raydium_sdk_v2_1.Token({
                mint: inputMintStr,
                decimals: mintInfos[inputMintStr].decimals,
                isToken2022: mintInfos[inputMintStr].programId.equals(spl_token_1.TOKEN_2022_PROGRAM_ID),
            }), inputAmount),
            directPath: routes.directPath.map((p) => ammSimulateCache[p.id.toBase58()] || computeClmmPoolInfo[p.id.toBase58()]),
            routePathDict,
            simulateCache: ammSimulateCache,
            tickCache: computePoolTickData,
            mintInfos: mintInfos,
            outputToken: (0, raydium_sdk_v2_1.toApiV3Token)(Object.assign(Object.assign({}, mintInfos[outputMintStr]), { programId: mintInfos[outputMintStr].programId.toBase58(), address: outputMintStr, extensions: {
                    feeConfig: (0, raydium_sdk_v2_1.toFeeConfig)(mintInfos[outputMintStr].feeConfig),
                } })),
            chainTime: Math.floor((_b = (_a = raydium.chainTimeData) === null || _a === void 0 ? void 0 : _a.chainTime) !== null && _b !== void 0 ? _b : Date.now() / 1000),
            slippage: 0.005,
            epochInfo: yield raydium.connection.getEpochInfo(),
        });
        console.log('best swap route:', {
            input: r[0].amountIn.amount.toExact(),
            output: r[0].amountOut.amount.toExact(),
            swapType: r[0].routeType,
            route: r[0].poolInfoList.map((p) => p.id).join(' -> '),
        });
        console.log('fetching swap route pool keys..');
        const poolKeys = yield raydium.tradeV2.computePoolToPoolKeys({
            pools: r[0].poolInfoList,
            ammRpcData: ammPoolsRpcInfo,
            clmmRpcData: clmmPoolsRpcInfo,
        });
        console.log('build swap tx..');
        const { execute } = yield raydium.tradeV2.swap({
            routeProgram: raydium_sdk_v2_1.Router,
            txVersion: config_1.txVersion,
            swapInfo: r[0],
            swapPoolKeys: poolKeys,
            ownerInfo: {
                associatedOnly: true,
                checkCreateATAOwner: true,
            },
            computeBudgetConfig: {
                units: 600000,
                microLamports: 100000,
            },
        });
        console.log('execute tx..');
        const { txIds } = yield execute({ sequentially: true });
        console.log('txIds:', txIds);
    });
}
/** uncomment code below to execute */
routeSwap();
//# sourceMappingURL=routeSwap.js.map
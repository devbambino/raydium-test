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
exports.createAmmFarm = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
const createAmmFarm = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // RAY-USDC pool
    // note: please ensure you this is owned by yourself
    const poolInfo = (yield raydium.api.fetchPoolById({ ids: '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg' }))[0];
    if (!poolInfo)
        throw new Error('pool not found');
    const rewardMint = yield raydium.token.getTokenInfo(raydium_sdk_v2_1.RAYMint);
    const currentChainTime = yield raydium.currentBlockChainTime();
    const openTime = Math.floor(currentChainTime / 1000); // in seconds
    const endTime = openTime + 60 * 60 * 24 * 7;
    // note: reward doesn't support 2022 mint at this moment
    const rewardInfos = [
        {
            mint: new web3_js_1.PublicKey(rewardMint.address),
            perSecond: '1',
            openTime,
            endTime,
            rewardType: 'Standard SPL',
        },
    ];
    const { execute, extInfo, transaction } = yield raydium.farm.create({
        poolInfo,
        rewardInfos,
        txVersion: config_1.txVersion,
    });
    const { txId } = yield execute();
    console.log('amm farm created:', { txId }, 'farm id:', extInfo.farmId.toBase58());
});
exports.createAmmFarm = createAmmFarm;
/** uncomment code below to execute */
// createAmmFarm()
//# sourceMappingURL=createAmmFarm.js.map
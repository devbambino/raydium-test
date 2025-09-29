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
exports.editAmmFarm = void 0;
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
const editAmmFarm = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // RAY-USDC farm
    // note: please ensure you this is owned by yourself, not support devnet
    const farmInfo = (yield raydium.api.fetchFarmInfoById({ ids: '3f7UP66ZtrRgpd3z39WfM9oiRVKV9uiZWABTsWG76Zqy' }))[0];
    if (!farmInfo)
        throw new Error('farm not found');
    // existing reward mint
    const rewardMint = yield raydium.token.getTokenInfo(farmInfo.rewardInfos[0].mint.address);
    const currentChainTime = yield raydium.currentBlockChainTime();
    const openTime = Math.floor(currentChainTime / 1000); // in seconds
    const endTime = openTime + 60 * 60 * 24 * 7;
    // note: reward doesn't support 2022 mint at this moment
    const newRewardInfos = [
        {
            mint: new web3_js_1.PublicKey(rewardMint.address),
            perSecond: '1',
            openTime,
            endTime,
            rewardType: 'Standard SPL',
        },
    ];
    const editFarmBuilder = yield raydium.farm.restartRewards({
        farmInfo,
        newRewardInfos,
        txVersion: config_1.txVersion,
    });
    const { txId } = yield editFarmBuilder.execute();
    console.log('amm farm reward edited:', { txId });
    /** example below: if you want to edit reward and add new rewards in one tx  */
    /*
    const rewardAddedMint = await raydium.token.getTokenInfo(USDCMint)
    const newAddedRewardInfos: FarmRewardInfo[] = [
      {
        mint: new PublicKey(rewardAddedMint.address),
        perSecond: '1',
        openTime,
        endTime,
        rewardType: 'Standard SPL',
      },
    ]
    const addNewRewardBuildData = await raydium.farm.addNewRewardsToken({
      farmInfo,
      newRewardInfos: newAddedRewardInfos,
      txVersion,
    })
  
    editFarmBuilder.builder.addInstruction(addNewRewardBuildData.builder.AllTxData)
    const { execute } = await editFarmBuilder.builder.versionBuild({ txVersion })
    const { txId } = await editFarmBuilder.execute()
    console.log('amm farm reward edited and added:', { txId })
    */
});
exports.editAmmFarm = editAmmFarm;
/** uncomment code below to execute */
// editAmmFarm()
//# sourceMappingURL=editAmmFarm.js.map
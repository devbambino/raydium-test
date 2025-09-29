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
exports.setFarmRewards = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const decimal_js_1 = __importDefault(require("decimal.js"));
const utils_1 = require("./utils");
const setFarmRewards = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // note: please ensure you this is owned by yourself
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '364UXpiEuXbngVmd7oJWRKncewiRPm1ouLLLoHuewWkE' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidClmm)(poolInfo.programId))
        throw new Error('target pool is not CLMM pool');
    const mint = yield raydium.token.getTokenInfo(raydium_sdk_v2_1.RAYMint.toBase58());
    const currentChainTime = yield raydium.currentBlockChainTime();
    const openTime = Math.floor(currentChainTime / 1000); // in seconds
    const endTime = openTime + 60 * 60 * 24 * 7;
    const editRewardInfos = [
        {
            mint,
            openTime,
            endTime,
            perSecond: new decimal_js_1.default(1),
        },
    ];
    // this is to add more rewards to 'existing' farming reward
    const setRewardBuildData = yield raydium.clmm.setRewards({
        poolInfo,
        rewardInfos: editRewardInfos,
        checkCreateATAOwner: true,
        ownerInfo: {
            useSOLBalance: true,
        },
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield setRewardBuildData.execute();
    console.log('clmm farm created:', { txId });
    /** example below: if you want to combine edit reward and add new rewards in one tx  */
    /*
    const mint2 = await raydium.token.getTokenInfo(SOLMint.toBase58())
    const newRewardInfos = [
      {
        mint:mint2,
        openTime,
        endTime,
        perSecond: new Decimal(1),
      },
    ]
  
    const initRewardBuildData = await raydium.clmm.initRewards({
      poolInfo,
      ownerInfo: { useSOLBalance: true },
      checkCreateATAOwner: true,
      rewardInfos: newRewardInfos,
      txVersion
    })
  
    const {execute} = await setRewardBuildData.builder.addInstruction(initRewardBuildData.builder.AllTxData).build()
    const txId = await execute()
    console.log('edit and add more rewards to clmm farm', { txId })
    */
});
exports.setFarmRewards = setFarmRewards;
/** uncomment code below to execute */
// setFarmRewards()
//# sourceMappingURL=setFarmRewards.js.map
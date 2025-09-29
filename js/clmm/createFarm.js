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
exports.createFarm = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const decimal_js_1 = __importDefault(require("decimal.js"));
const utils_1 = require("./utils");
const createFarm = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // note: please ensure you this is owned by yourself
    // note: api doesn't support get devnet pool info
    const data = yield raydium.api.fetchPoolById({ ids: '61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht' });
    const poolInfo = data[0];
    if (!(0, utils_1.isValidClmm)(poolInfo.programId))
        throw new Error('target pool is not CLMM pool');
    const mint = yield raydium.token.getTokenInfo(raydium_sdk_v2_1.RAYMint.toBase58());
    const currentChainTime = yield raydium.currentBlockChainTime();
    const openTime = Math.floor(currentChainTime / 1000); // in seconds
    const endTime = openTime + 60 * 60 * 24 * 7;
    const newRewardInfos = [
        {
            mint,
            openTime,
            endTime,
            perSecond: new decimal_js_1.default(1),
        },
    ];
    const { execute } = yield raydium.clmm.initRewards({
        poolInfo,
        rewardInfos: newRewardInfos,
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
    const { txId } = yield execute();
    console.log('clmm farm created:', { txId });
});
exports.createFarm = createFarm;
/** uncomment code below to execute */
// createFarm()
//# sourceMappingURL=createFarm.js.map
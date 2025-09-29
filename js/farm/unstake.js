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
exports.unstake = void 0;
const config_1 = require("../config");
const bn_js_1 = __importDefault(require("bn.js"));
const unstake = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const targetFarm = 'CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS'; // RAY-USDC farm
    // note: api doesn't support get devnet farm info
    const farmInfo = (yield raydium.api.fetchFarmInfoById({ ids: targetFarm }))[0];
    const readyUnStakeAmount = new bn_js_1.default(100);
    const { execute } = yield raydium.farm.withdraw({
        farmInfo,
        amount: readyUnStakeAmount,
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('farm staked:', { txId });
});
exports.unstake = unstake;
/** uncomment code below to execute */
// unstake()
//# sourceMappingURL=unstake.js.map
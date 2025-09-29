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
exports.createPool = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
const decimal_js_1 = __importDefault(require("decimal.js"));
const bn_js_1 = __importDefault(require("bn.js"));
const createPool = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)({ loadToken: true });
    // you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list
    // RAY
    const mint1 = yield raydium.token.getTokenInfo('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R');
    // USDT
    const mint2 = yield raydium.token.getTokenInfo('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
    const clmmConfigs = yield raydium.api.getClmmConfigs();
    const { execute } = yield raydium.clmm.createPool({
        programId: raydium_sdk_v2_1.CLMM_PROGRAM_ID, // devnet: DEVNET_PROGRAM_ID.CLMM
        mint1,
        mint2,
        ammConfig: Object.assign(Object.assign({}, clmmConfigs[0]), { id: new web3_js_1.PublicKey(clmmConfigs[0].id), fundOwner: '' }),
        initialPrice: new decimal_js_1.default(1),
        startTime: new bn_js_1.default(0),
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    const { txId } = yield execute();
    console.log('clmm pool created:', { txId });
});
exports.createPool = createPool;
/** uncomment code below to execute */
// createPool()
//# sourceMappingURL=createPool.js.map
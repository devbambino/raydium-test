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
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const createPool = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)({ loadToken: true });
    // check token list here: https://api-v3.raydium.io/mint/list
    // RAY
    const mintA = yield raydium.token.getTokenInfo('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R');
    // USDC
    const mintB = yield raydium.token.getTokenInfo('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    /**
     * you also can provide mint info directly like below, then don't have to call token info api
     *  {
        address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        decimals: 6,
      }
     */
    const { execute, extInfo } = yield raydium.cpmm.createPool({
        programId: raydium_sdk_v2_1.CREATE_CPMM_POOL_PROGRAM, // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
        poolFeeAccount: raydium_sdk_v2_1.CREATE_CPMM_POOL_FEE_ACC, // devnet: CREATE_CPMM_POOL_FEE_ACC.CREATE_CPMM_POOL_PROGRAM
        mintA,
        mintB,
        mintAAmount: new bn_js_1.default(100),
        mintBAmount: new bn_js_1.default(100),
        startTime: new bn_js_1.default(0),
        associatedOnly: false,
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
    console.log('pool created', {
        txId,
        poolKeys: Object.keys(extInfo.address).reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: extInfo.address[cur].toString() })), {}),
    });
});
exports.createPool = createPool;
/** uncomment code below to execute */
// createPool()
//# sourceMappingURL=createCpmmPool.js.map
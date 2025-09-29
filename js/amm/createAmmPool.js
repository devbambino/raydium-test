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
exports.createAmmPool = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const createAmmPool = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const marketId = new web3_js_1.PublicKey(`<you market id here>`);
    // if you are confirmed your market info, don't have to get market info from rpc below
    const marketBufferInfo = yield raydium.connection.getAccountInfo(new web3_js_1.PublicKey(marketId));
    const { baseMint, quoteMint } = raydium_sdk_v2_1.MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data);
    // check mint info here: https://api-v3.raydium.io/mint/list
    // or get mint info by api: await raydium.token.getTokenInfo('mint address')
    const baseMintInfo = yield raydium.token.getTokenInfo(baseMint);
    const quoteMintInfo = yield raydium.token.getTokenInfo(quoteMint);
    const { execute, extInfo } = yield raydium.liquidity.createPoolV4({
        programId: raydium_sdk_v2_1.AMM_V4,
        // programId: DEVNET_PROGRAM_ID.AmmV4, // devnet
        marketInfo: {
            marketId,
            programId: raydium_sdk_v2_1.OPEN_BOOK_PROGRAM,
            // programId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devent
        },
        baseMintInfo: {
            mint: baseMint,
            decimals: baseMintInfo.decimals, // if you know mint decimals here, can pass number directly
        },
        quoteMintInfo: {
            mint: quoteMint,
            decimals: quoteMintInfo.decimals, // if you know mint decimals here, can pass number directly
        },
        baseAmount: new bn_js_1.default(1000),
        quoteAmount: new bn_js_1.default(1000),
        // sol devnet faucet: https://faucet.solana.com/
        // baseAmount: new BN(4 * 10 ** 9), // if devent pool with sol/wsol, better use amount >= 4*10**9
        // quoteAmount: new BN(4 * 10 ** 9), // if devent pool with sol/wsol, better use amount >= 4*10**9
        startTime: new bn_js_1.default(0), // unit in seconds
        ownerInfo: {
            useSOLBalance: true,
        },
        associatedOnly: false,
        txVersion: config_1.txVersion,
        feeDestinationId: raydium_sdk_v2_1.FEE_DESTINATION_ID,
        // feeDestinationId: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID, // devnet
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 10000000,
        // },
    });
    const { txId } = yield execute();
    console.log('amm pool created! txId: ', txId, ', poolKeys:', Object.keys(extInfo.address).reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: extInfo.address[cur].toBase58() })), {}));
});
exports.createAmmPool = createAmmPool;
/** uncomment code below to execute */
(0, exports.createAmmPool)();
//# sourceMappingURL=createAmmPool.js.map
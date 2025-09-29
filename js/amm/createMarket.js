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
exports.createMarket = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const createMarket = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // check mint info here: https://api-v3.raydium.io/mint/list
    // or get mint info by api: await raydium.token.getTokenInfo('mint address')
    const { execute, extInfo, transactions } = yield raydium.marketV2.create({
        baseInfo: {
            mint: raydium_sdk_v2_1.RAYMint,
            decimals: 6,
        },
        quoteInfo: {
            mint: raydium_sdk_v2_1.USDCMint,
            decimals: 9,
        },
        lotSize: 1,
        tickSize: 0.01,
        dexProgramId: raydium_sdk_v2_1.OPEN_BOOK_PROGRAM,
        // dexProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devnet
        txVersion: config_1.txVersion,
        // optional: set up priority fee here
        // computeBudgetConfig: {
        //   units: 600000,
        //   microLamports: 100000000,
        // },
    });
    console.log(`create market total ${transactions.length} txs, market info: `, Object.keys(extInfo.address).reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: extInfo.address[cur].toBase58() })), {}));
    const txIds = yield execute({
        // set sequentially to true means tx will be sent when previous one confirmed
        sequentially: true,
    });
    console.log('create market txIds:', txIds);
});
exports.createMarket = createMarket;
/** uncomment code below to execute */
// createMarket()
//# sourceMappingURL=createMarket.js.map
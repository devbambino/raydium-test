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
exports.fetchRpcPoolInfo = void 0;
const config_1 = require("../config");
const fetchRpcPoolInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    // RAY-SOL
    const pool1 = 'AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA';
    // RAY-USDC
    const pool2 = '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg';
    const res = yield raydium.liquidity.getRpcPoolInfos([pool1, pool2]);
    const pool1Info = res[pool1];
    const pool2Info = res[pool2];
    console.log('RAY-SOL pool price:', pool1Info.poolPrice);
    console.log('RAY-USDC pool price:', pool2Info.poolPrice);
    // console.log('amm pool infos:', res)
});
exports.fetchRpcPoolInfo = fetchRpcPoolInfo;
/** uncomment code below to execute */
(0, exports.fetchRpcPoolInfo)();
//# sourceMappingURL=fetchRpcPoolInfo.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAmm = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const VALID_PROGRAM_ID = new Set([
    raydium_sdk_v2_1.AMM_V4.toBase58(),
    raydium_sdk_v2_1.AMM_STABLE.toBase58(),
    raydium_sdk_v2_1.DEVNET_PROGRAM_ID.AmmV4.toBase58(),
    raydium_sdk_v2_1.DEVNET_PROGRAM_ID.AmmStable.toBase58(),
]);
const isValidAmm = (id) => VALID_PROGRAM_ID.has(id);
exports.isValidAmm = isValidAmm;
//# sourceMappingURL=utils.js.map
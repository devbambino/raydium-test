"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidClmm = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const VALID_PROGRAM_ID = new Set([raydium_sdk_v2_1.CLMM_PROGRAM_ID.toBase58(), raydium_sdk_v2_1.DEVNET_PROGRAM_ID.CLMM.toBase58()]);
const isValidClmm = (id) => VALID_PROGRAM_ID.has(id);
exports.isValidClmm = isValidClmm;
//# sourceMappingURL=utils.js.map
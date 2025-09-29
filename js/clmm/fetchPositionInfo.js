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
exports.fetchPositionInfo = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = __importDefault(require("decimal.js"));
const bn_js_1 = __importDefault(require("bn.js"));
const config_1 = require("../config");
const fetchPositionInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const positionNftMint = new web3_js_1.PublicKey('GQxt6TExLLZDQmrS3K4tmDn48yGhiWziVc1nQNmPcb5u');
    const positionPubKey = (0, raydium_sdk_v2_1.getPdaPersonalPositionAddress)(raydium_sdk_v2_1.CLMM_PROGRAM_ID, positionNftMint).publicKey;
    const pos = yield raydium.connection.getAccountInfo(positionPubKey);
    const position = raydium_sdk_v2_1.PositionInfoLayout.decode(pos.data);
    // code below: get all clmm position in wallet
    // const allPosition = await raydium.clmm.getOwnerPositionInfo({ programId: CLMM_PROGRAM_ID })
    // if (!allPosition.length) throw new Error('use do not have position')
    // const position = allPosition[0]
    // note: api doesn't support get devnet pool info
    const poolInfo = (yield raydium.api.fetchPoolById({ ids: position.poolId.toBase58() }))[0];
    const epochInfo = yield raydium.connection.getEpochInfo();
    /** get position pooled amount and price range */
    const priceLower = raydium_sdk_v2_1.TickUtils.getTickPrice({
        poolInfo,
        tick: position.tickLower,
        baseIn: true,
    });
    const priceUpper = raydium_sdk_v2_1.TickUtils.getTickPrice({
        poolInfo,
        tick: position.tickUpper,
        baseIn: true,
    });
    const { amountA, amountB } = raydium_sdk_v2_1.PositionUtils.getAmountsFromLiquidity({
        poolInfo,
        ownerPosition: position,
        liquidity: position.liquidity,
        slippage: 0,
        add: false,
        epochInfo,
    });
    const [pooledAmountA, pooledAmountB] = [
        new decimal_js_1.default(amountA.amount.toString()).div(Math.pow(10, poolInfo.mintA.decimals)),
        new decimal_js_1.default(amountB.amount.toString()).div(Math.pow(10, poolInfo.mintB.decimals)),
    ];
    const [tickLowerArrayAddress, tickUpperArrayAddress] = [
        raydium_sdk_v2_1.TickUtils.getTickArrayAddressByTick(new web3_js_1.PublicKey(poolInfo.programId), new web3_js_1.PublicKey(poolInfo.id), position.tickLower, poolInfo.config.tickSpacing),
        raydium_sdk_v2_1.TickUtils.getTickArrayAddressByTick(new web3_js_1.PublicKey(poolInfo.programId), new web3_js_1.PublicKey(poolInfo.id), position.tickUpper, poolInfo.config.tickSpacing),
    ];
    const tickArrayRes = yield raydium.connection.getMultipleAccountsInfo([tickLowerArrayAddress, tickUpperArrayAddress]);
    if (!tickArrayRes[0] || !tickArrayRes[1])
        throw new Error('tick data not found');
    const tickArrayLower = raydium_sdk_v2_1.TickArrayLayout.decode(tickArrayRes[0].data);
    const tickArrayUpper = raydium_sdk_v2_1.TickArrayLayout.decode(tickArrayRes[1].data);
    const tickLowerState = tickArrayLower.ticks[raydium_sdk_v2_1.TickUtils.getTickOffsetInArray(position.tickLower, poolInfo.config.tickSpacing)];
    const tickUpperState = tickArrayUpper.ticks[raydium_sdk_v2_1.TickUtils.getTickOffsetInArray(position.tickUpper, poolInfo.config.tickSpacing)];
    const rpcPoolData = yield raydium.clmm.getRpcClmmPoolInfo({ poolId: position.poolId });
    const tokenFees = raydium_sdk_v2_1.PositionUtils.GetPositionFeesV2(rpcPoolData, position, tickLowerState, tickUpperState);
    const rewards = raydium_sdk_v2_1.PositionUtils.GetPositionRewardsV2(rpcPoolData, position, tickLowerState, tickUpperState);
    const [tokenFeeAmountA, tokenFeeAmountB] = [
        tokenFees.tokenFeeAmountA.gte(new bn_js_1.default(0)) && tokenFees.tokenFeeAmountA.lt(raydium_sdk_v2_1.U64_IGNORE_RANGE)
            ? tokenFees.tokenFeeAmountA
            : new bn_js_1.default(0),
        tokenFees.tokenFeeAmountB.gte(new bn_js_1.default(0)) && tokenFees.tokenFeeAmountB.lt(raydium_sdk_v2_1.U64_IGNORE_RANGE)
            ? tokenFees.tokenFeeAmountB
            : new bn_js_1.default(0),
    ];
    const [rewardMintAFee, rewardMintBFee] = [
        {
            mint: poolInfo.mintA,
            amount: new decimal_js_1.default(tokenFeeAmountA.toString())
                .div(Math.pow(10, poolInfo.mintA.decimals))
                .toDecimalPlaces(poolInfo.mintA.decimals),
        },
        {
            mint: poolInfo.mintB,
            amount: new decimal_js_1.default(tokenFeeAmountB.toString())
                .div(Math.pow(10, poolInfo.mintB.decimals))
                .toDecimalPlaces(poolInfo.mintB.decimals),
        },
    ];
    const rewardInfos = rewards.map((r) => (r.gte(new bn_js_1.default(0)) && r.lt(raydium_sdk_v2_1.U64_IGNORE_RANGE) ? r : new bn_js_1.default(0)));
    const poolRewardInfos = rewardInfos
        .map((r, idx) => {
        var _a;
        const rewardMint = (_a = poolInfo.rewardDefaultInfos.find((r) => r.mint.address === rpcPoolData.rewardInfos[idx].tokenMint.toBase58())) === null || _a === void 0 ? void 0 : _a.mint;
        if (!rewardMint)
            return undefined;
        return {
            mint: rewardMint,
            amount: new decimal_js_1.default(r.toString()).div(Math.pow(10, rewardMint.decimals)).toDecimalPlaces(rewardMint.decimals),
        };
    })
        .filter(Boolean);
    const feeARewardIdx = poolRewardInfos.findIndex((r) => r.mint.address === poolInfo.mintA.address);
    if (poolRewardInfos[feeARewardIdx])
        poolRewardInfos[feeARewardIdx].amount = poolRewardInfos[feeARewardIdx].amount.add(rewardMintAFee.amount);
    else
        poolRewardInfos.push(rewardMintAFee);
    const feeBRewardIdx = poolRewardInfos.findIndex((r) => r.mint.address === poolInfo.mintB.address);
    if (poolRewardInfos[feeBRewardIdx])
        poolRewardInfos[feeBRewardIdx].amount = poolRewardInfos[feeBRewardIdx].amount.add(rewardMintBFee.amount);
    else
        poolRewardInfos.push(rewardMintBFee);
    console.log('position info', {
        pool: `${poolInfo.mintA.symbol} - ${poolInfo.mintB.symbol}`,
        nft: position.nftMint.toBase58(),
        priceLower: priceLower.price.toString(),
        priceUpper: priceUpper.price.toString(),
        pooledAmountA: pooledAmountA.toString(),
        pooledAmountB: pooledAmountB.toString(),
        rewardInfos: poolRewardInfos.map((r) => ({
            mint: r.mint.symbol.replace(/WSOL/gi, 'SOL'),
            amount: r.amount.toString(),
        })),
    });
});
exports.fetchPositionInfo = fetchPositionInfo;
/** uncomment code below to execute */
(0, exports.fetchPositionInfo)();
//# sourceMappingURL=fetchPositionInfo.js.map
import { ApiV3PoolInfoStandardItem, AmmV4Keys, AmmRpcData } from '@raydium-io/raydium-sdk-v2'
import { initSdk, txVersion } from '../config'
import BN from 'bn.js'
import { isValidAmm } from './utils'
import Decimal from 'decimal.js'
import { NATIVE_MINT } from '@solana/spl-token'
import { printSimulateInfo } from '../util'
import { PublicKey } from '@solana/web3.js'

export const swap = async () => {
  //Devnet config:
  //yarn dev src/amm/swap.ts

  const raydium = await initSdk()
  const amountIn = 5
  //const inputMint = NATIVE_MINT.toBase58()
  const poolId = 'poolId' // SOL-USDC pool

  let poolInfo: ApiV3PoolInfoStandardItem | undefined
  let poolKeys: AmmV4Keys | undefined
  let rpcData: AmmRpcData

  const data = await raydium.api.fetchPoolById({ ids: poolId })
  poolInfo = data[0] as ApiV3PoolInfoStandardItem
  //if (!isValidAmm(poolInfo.programId)) throw new Error('target pool is not AMM pool')
  poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId)
  rpcData = await raydium.liquidity.getRpcPoolInfo(poolId)

  /*const data = await raydium.liquidity.getRpcPoolInfo(poolId)
  let poolInfo: ApiV3PoolInfoStandardItem
  let poolKeys: AmmV4Keys = await raydium.liquidity.getAmmPoolKeys(poolId)
  let rpcData: AmmRpcData = data */
  console.log('pool info:', poolInfo)
  console.log('pool poolKeys:', poolKeys)
  console.log('pool rpcData:', rpcData)

  /*
  let poolInfo: ApiV3PoolInfoStandardItem | undefined
  let poolKeys: AmmV4Keys | undefined
  let rpcData: AmmRpcData

  if (raydium.cluster === 'mainnet') {
    // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
    const data = await raydium.api.fetchPoolById({ ids: poolId })
    poolInfo = data[0] as ApiV3PoolInfoStandardItem
    if (!isValidAmm(poolInfo.programId)) throw new Error('target pool is not AMM pool')
    poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId)
    rpcData = await raydium.liquidity.getRpcPoolInfo(poolId)
  } else {
    // note: getPoolInfoFromRpc method only return required pool data for computing not all detail pool info
    //const data = await raydium.liquidity.getPoolInfoFromRpc({ poolId })
    const data = await raydium.liquidity.getRpcPoolInfo(poolId)
    poolKeys = await raydium.liquidity.getAmmPoolKeys(poolId)
    rpcData = data
  }

  if (poolInfo!.mintA.address !== inputMint && poolInfo!.mintB.address !== inputMint)
    throw new Error('input mint does not match pool')

 
  const [baseReserve, quoteReserve, status] = [rpcData.baseReserve, rpcData.quoteReserve, rpcData.status.toNumber()]

  const baseIn = rpcData.baseMint
  const quoteOut = rpcData.quoteMint
  const baseMintInfo = await raydium.token.getTokenInfo(baseIn)
  const quoteMintInfo = await raydium.token.getTokenInfo(quoteOut)

  const [mintIn, mintOut] = [baseMintInfo, quoteMintInfo]//baseIn ? [poolInfo!.mintA, poolInfo!.mintB] : [poolInfo!.mintB, poolInfo!.mintA]

  const out = raydium.liquidity.computeAmountOut({
    poolInfo: {
      baseReserve,
      quoteReserve,
      status,
      version: 4,
      type: 'Standard',
      lpPrice: 0,
      lpAmount: 0,

      marketId: string;
      configId: string;
      lpMint: ApiV3Token;
      id: string;
      mintA: ApiV3Token;
      mintB: ApiV3Token;
      rewardDefaultInfos: PoolFarmRewardInfo[];
      rewardDefaultPoolInfos: "Ecosystem" | "Fusion" | "Raydium" | "Clmm";
      price: number;
      mintAmountA: number;
      mintAmountB: number;
      feeRate: number;
      openTime: string;
      tvl: number;
      day: ApiV3PoolInfoCountItem;
      week: ApiV3PoolInfoCountItem;
      month: ApiV3PoolInfoCountItem;
      pooltype: PoolTypeItem[];
      farmUpcomingCount: number;
      farmOngoingCount: number;
      farmFinishedCount: number;

    },
    amountIn: new BN(amountIn),
    mintIn: baseIn,
    mintOut: mintOut.address,
    slippage: 0.01, // range: 1 ~ 0.0001, means 100% ~ 0.01%
  })

  console.log(
    `computed swap ${new Decimal(amountIn)
      .div(10 ** mintIn.decimals)
      .toDecimalPlaces(mintIn.decimals)
      .toString()} ${mintIn.symbol || mintIn.address} to ${new Decimal(out.amountOut.toString())
        .div(10 ** mintOut.decimals)
        .toDecimalPlaces(mintOut.decimals)
        .toString()} ${mintOut.symbol || mintOut.address}, minimum amount out ${new Decimal(out.minAmountOut.toString())
          .div(10 ** mintOut.decimals)
          .toDecimalPlaces(mintOut.decimals)} ${mintOut.symbol || mintOut.address}`
  )

  const { execute } = await raydium.liquidity.swap({
    poolInfo,
    amountIn: new BN(amountIn),
    amountOut: out.minAmountOut, // out.amountOut means amount 'without' slippage
    fixedSide: 'in',
    inputMint: mintIn.address,
    txVersion,

    // optional: set up token account
    // config: {
    //   inputUseSolBalance: true, // default: true, if you want to use existed wsol token account to pay token in, pass false
    //   outputUseSolBalance: true, // default: true, if you want to use existed wsol token account to receive token out, pass false
    //   associatedOnly: true, // default: true, if you want to use ata only, pass true
    // },

    // optional: set up priority fee here
    computeBudgetConfig: {
      units: 600000,
      microLamports: 46591500,
    },

    // optional: add transfer sol to tip account instruction. e.g sent tip to jito
    // txTipConfig: {
    //   address: new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
    //   amount: new BN(10000000), // 0.01 sol
    // },
  })

  printSimulateInfo()
  // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
  const { txId } = await execute()
  console.log(`swap successfully in amm pool:`, { txId: `https://explorer.solana.com/tx/${txId}` })

  process.exit() // if you don't want to end up node execution, comment this line
    */
}

/** uncomment code below to execute */
swap()

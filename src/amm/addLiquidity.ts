import { ApiV3PoolInfoStandardItem, TokenAmount, toToken, Percent } from '@raydium-io/raydium-sdk-v2'
import { initSdk, txVersion } from '../config'
import Decimal from 'decimal.js'

export const addLiquidity = async () => {
  const raydium = await initSdk()
  // RAY-USDC pool
  const data = await raydium.api.fetchPoolById({ ids: '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg' })
  const poolInfo = data[0] as ApiV3PoolInfoStandardItem

  const inputAmount = '1'

  const r = raydium.liquidity.computePairAmount({
    poolInfo,
    amount: inputAmount,
    baseIn: true,
    slippage: new Percent(1, 100), // 1%
  })

  const { execute } = await raydium.liquidity.addLiquidity({
    poolInfo,
    amountInA: new TokenAmount(
      toToken(poolInfo.mintA),
      new Decimal(inputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0)
    ),
    amountInB: new TokenAmount(
      toToken(poolInfo.mintA),
      new Decimal(r.maxAnotherAmount.toExact()).mul(10 ** poolInfo.mintA.decimals).toFixed(0)
    ),
    fixedSide: 'a',
    txVersion,
  })

  const { txId } = await execute()
  console.log('liquidity added:', { txId })
}

/** uncomment code below to execute */
// addLiquidity()

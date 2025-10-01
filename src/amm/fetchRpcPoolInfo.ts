import { initSdk } from '../config'
import Decimal from 'decimal.js'

export const fetchRpcPoolInfo = async () => {
  //Devnet config:
  //yarn dev src/amm/fetchRpcPoolInfo.ts

  const raydium = await initSdk()
  // USDC-SPY
  const poolId = 'poolId'
  // RAY-USDC
  //const pool2 = '6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg'

  const res = await raydium.liquidity.getRpcPoolInfos([poolId])

  const pool1Info = res[poolId]
  //const pool2Info = res[pool2]

  console.log('USDC-SPY pool price:', pool1Info.poolPrice)
  //console.log('RAY-USDC pool price:', pool2Info.poolPrice)
  // console.log('amm pool infos:', res)
}

/** uncomment code below to execute */
fetchRpcPoolInfo()

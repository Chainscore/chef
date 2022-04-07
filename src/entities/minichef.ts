import { ZERO_BI, SUSHI_TOKEN_ADDRESS } from './const'
import { dataSource, ethereum, Address } from '@graphprotocol/graph-ts'

import { MiniChef } from '../../generated/schema'

export function getMiniChef(block: ethereum.Block): MiniChef {
  let miniChef = MiniChef.load(dataSource.address().toHex())

  if (miniChef === null) {
    miniChef = new MiniChef(dataSource.address().toHex())
    miniChef.sushi = Address.fromString(SUSHI_TOKEN_ADDRESS)
    miniChef.sushiPerSecond = ZERO_BI
    miniChef.totalAllocPoint = ZERO_BI
    miniChef.poolCount = ZERO_BI
    miniChef.timestamp = block.timestamp
    miniChef.block = block.number
  }

  return miniChef as MiniChef
}

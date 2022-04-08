import { ADDRESS_ZERO, ZERO_BI } from './const'
import { BigInt, ethereum, Address } from '@graphprotocol/graph-ts'

import { Pool, RewarderPool } from '../../generated/schema'

export function getPool(pid: BigInt, block: ethereum.Block): Pool {

  let pool = Pool.load(pid.toString())

  if (pool === null) {
    pool = new Pool(pid.toString())
    pool.slpBalance = ZERO_BI
  }

  pool.timestamp = block.timestamp
  pool.block = block.number

  return pool as Pool
}

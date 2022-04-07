import { ADDRESS_ZERO, ZERO_BI } from './const'
import { BigInt, ethereum, Address } from '@graphprotocol/graph-ts'

import { Pool, NativeRewarderPool } from '../../generated/schema'
import { getMiniChef } from './minichef'

export function getPool(pid: BigInt, block: ethereum.Block): Pool {
  const miniChef = getMiniChef(block)

  let pool = Pool.load(pid.toString())

  if (pool === null) {
    pool = new Pool(pid.toString())
    pool.miniChef = miniChef.id
    pool.pair = Address.fromString(ADDRESS_ZERO)
    pool.allocPoint = ZERO_BI
    pool.lastRewardTime = ZERO_BI
    pool.accSushiPerShare = ZERO_BI
    pool.slpBalance = ZERO_BI
    pool.userCount = ZERO_BI
    pool.timestamp = block.timestamp
    pool.block = block.number
  }

  return pool as Pool
}


export function getNativeRewarderPool(pid: BigInt): NativeRewarderPool {
  let pool = NativeRewarderPool.load(pid.toString())

  if (pool === null) {
    pool = new NativeRewarderPool(pid.toString())
    pool.allocPoint = ZERO_BI
  }

  return pool as NativeRewarderPool
}


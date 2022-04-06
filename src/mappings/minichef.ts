import { ACC_SUSHI_PRECISION, ONE_BI, ZERO_BI } from '../entities/const'
import {
  Deposit,
  EmergencyWithdraw,
  Harvest,
  LogPoolAddition,
  LogSetPool,
  LogSushiPerSecond,
  LogUpdatePool,
  Withdraw,
} from '../../generated/MiniChef/MiniChef'
import { getMiniChef, getPool, getRewarder, getUser, getUserPool } from '../entities'

import { log, Address } from '@graphprotocol/graph-ts'

export function logPoolAddition(event: LogPoolAddition): void {

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)

  const rewarder = getRewarder(event.params.rewarder, event.block)
  pool.rewarder = rewarder.id
  pool.pair = event.params.lpToken
  pool.allocPoint = event.params.allocPoint
  pool.save()

  miniChef.totalAllocPoint = miniChef.totalAllocPoint.plus(pool.allocPoint)
  miniChef.poolCount = miniChef.poolCount.plus(ONE_BI)
  miniChef.save()
}

export function logSetPool(event: LogSetPool): void {
  /*log.info('[MiniChef] Log Set Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.rewarder.toHex(),
    event.params.overwrite == true ? 'true' : 'false',
  ])*/

  const miniChef = getMiniChef(event.block)
  const pool = getPool(event.params.pid, event.block)

  if (event.params.overwrite == true) {
    const rewarder = getRewarder(event.params.rewarder, event.block)
    pool.rewarder = rewarder.id
  }

  miniChef.totalAllocPoint = miniChef.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  miniChef.save()
  pool.allocPoint = event.params.allocPoint
  pool.save()
}

export function logUpdatePool(event: LogUpdatePool): void {
  /*log.info('[MiniChef] Log Update Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.lastRewardTime.toString(), //uint64, I think this is Decimal but not sure
    event.params.lpSupply.toString(),
    event.params.accSushiPerShare.toString(),
  ])*/
  const pool = getPool(event.params.pid, event.block)
  pool.accSushiPerShare = event.params.accSushiPerShare
  pool.lastRewardTime = event.params.lastRewardTime
  pool.save()
}

export function logSushiPerSecond(event: LogSushiPerSecond): void {
  //log.info('[MiniChef] Log Sushi Per Second {}', [event.params.sushiPerSecond.toString()])

  const miniChef = getMiniChef(event.block)

  miniChef.sushiPerSecond = event.params.sushiPerSecond
  miniChef.save()
}

export function deposit(event: Deposit): void {
  /*log.info('[MiniChef] Log Deposit {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex(),
  ])*/
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.to, event.block)
  const userpool = getUserPool(Address.fromString(user.id), event.params.pid, event.block);

  pool.slpBalance = pool.slpBalance.plus(event.params.amount)
  pool.save()

  userpool.amount = userpool.amount.plus(event.params.amount)
  userpool.rewardDebt = userpool.rewardDebt.plus(event.params.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION))
  userpool.save()
}

export function withdraw(event: Withdraw): void {
  /*log.info('[MiniChef] Log Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex(),
  ])*/

  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.block)
  const userpool = getUserPool(Address.fromString(user.id), event.params.pid, event.block);

  pool.slpBalance = pool.slpBalance.minus(event.params.amount)
  pool.save()

  userpool.amount = userpool.amount.minus(event.params.amount)
  userpool.rewardDebt = userpool.rewardDebt.minus(event.params.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION))
  userpool.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  /*log.info('[MiniChef] Log Emergency Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex(),
  ])*/

  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.block)
  const userpool = getUserPool(Address.fromString(user.id), event.params.pid, event.block);

  pool.slpBalance = pool.slpBalance.minus(event.params.amount)
  pool.save()

  userpool.amount = ZERO_BI
  userpool.rewardDebt = ZERO_BI
  userpool.save()
}

export function harvest(event: Harvest): void {
  /*log.info('[MiniChef] Log Withdraw {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
  ])*/

  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.block)
  const userpool = getUserPool(Address.fromString(user.id), event.params.pid, event.block);

  const accumulatedSushi = userpool.amount.times(pool.accSushiPerShare).div(ACC_SUSHI_PRECISION)

  userpool.rewardDebt = accumulatedSushi
  userpool.sushiHarvested = userpool.sushiHarvested.plus(event.params.amount)
  userpool.save()
}

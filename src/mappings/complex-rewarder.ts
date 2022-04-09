import { LogRewardPerSecond, LogPoolAddition, LogSetPool } from '../../generated/MiniChef/CloneRewarderTime'
import { getRewarder, getRewarderPool, getPool } from '../entities'
import { log } from '@graphprotocol/graph-ts'

export function logRewardPerSecond(event: LogRewardPerSecond): void {
  //log.info('[MiniChef:Rewarder] Log Reward Per Second {}', [event.params.rewardPerSecond.toString()])
  const rewarder = getRewarder(event.address, event.block)
  rewarder.rewardPerPoint = event.params.rewardPerSecond
  rewarder.save()
}

export function logPoolAddition(event: LogPoolAddition): void {
  log.info('[MiniChef:Rewarder] Log Reward Per Second {}', [event.params.pid.toString()])

  const rewarder = getRewarder(event.address, event.block)
  const rewarderPool = getRewarderPool(event.address, event.params.pid, event.block);

  rewarderPool.allocation = event.params.allocPoint
  rewarderPool.save()

  rewarder.totalAllocation = rewarder.totalAllocation.plus(rewarderPool.allocation)
  rewarder.save()

  const pool = getPool(event.params.pid, event.block);
  pool.tokenRewarder = rewarder.id;
  pool.save()
}

export function logSetPool(event: LogSetPool): void {
  const rewarder = getRewarder(event.address, event.block)
  const rewarderPool = getRewarderPool(event.address, event.params.pid, event.block);

  rewarder.totalAllocation = rewarder.totalAllocation.plus(event.params.allocPoint.minus(rewarderPool.allocation))
  rewarder.save()
  rewarderPool.allocation = event.params.allocPoint
  rewarderPool.save()

  const pool = getPool(event.params.pid, event.block);
  pool.tokenRewarder = rewarder.id;
  pool.save()
}

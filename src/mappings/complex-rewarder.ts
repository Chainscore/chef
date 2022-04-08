import { LogRewardPerSecond, LogPoolAddition, LogSetPool } from '../../generated/MiniChef/CloneRewarderTime'
import { getRewarder, getRewarderPool } from '../entities'
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
  const pool = getRewarderPool(event.address, event.params.pid, event.block);

  pool.allocation = event.params.allocPoint
  pool.save()

  rewarder.totalAllocation = rewarder.totalAllocation.plus(pool.allocation)
  rewarder.save()
}

export function logSetPool(event: LogSetPool): void {
  const rewarder = getRewarder(event.address, event.block)
  const pool = getRewarderPool(event.address, event.params.pid, event.block);

  rewarder.totalAllocation = rewarder.totalAllocation.plus(event.params.allocPoint.minus(pool.allocation))
  rewarder.save()
  pool.allocation = event.params.allocPoint
  pool.save()
}

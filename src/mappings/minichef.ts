import { ACC_SUSHI_PRECISION, ONE_BI, ZERO_BI } from "../entities/const";
import {
	Deposit,
	EmergencyWithdraw,
	Harvest,
	LogPoolAddition,
	LogSetPool,
	LogSushiPerSecond,
	LogUpdatePool,
	Withdraw,
} from "../../generated/MiniChef/MiniChef";
import {
	getRewarderPool,
	getPool,
	getRewarder,
	getUser,
	getUserPool,
} from "../entities";

import { log, Address } from "@graphprotocol/graph-ts";

export function logPoolAddition(event: LogPoolAddition): void {
  log.info('[MiniChef] Log Set Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex(),
    event.params.rewarder.toHex()
  ])
  // Chef rewarder
  let rewarder = getRewarder(event.address, event.block);
//   rewarder.pool = event.params.pid.toString();
  rewarder.save();


  let rewarderPool = getRewarderPool(event.address, event.params.pid, event.block);
  rewarderPool.allocation = event.params.allocPoint;
  rewarderPool.save()

  // 2nd token rewarder
  const tokenRewarder = getRewarder(event.params.rewarder, event.block);
//   tokenRewarder.pool = event.params.pid.toString();
  tokenRewarder.save();

  let tokenRewarderPool = getRewarderPool(event.params.rewarder, event.params.pid, event.block);
  tokenRewarderPool.save()

  const pool = getPool(event.params.pid, event.block);
  pool.sushiRewarder = rewarderPool.id;
  pool.tokenRewarder = tokenRewarderPool.id;
  pool.lpToken = event.params.lpToken;
  pool.save();
}

export function logSetPool(event: LogSetPool): void {
	log.info('[MiniChef] Log Set Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.rewarder.toHex(),
    event.params.overwrite == true ? 'true' : 'false',
  ])

  // Chef rewarder
  let rewarder = getRewarder(event.address, event.block);
//   rewarder.pool = event.params.pid.toString();
  rewarder.save();


  let rewarderPool = getRewarderPool(event.address, event.params.pid, event.block);
  rewarderPool.allocation = event.params.allocPoint;
  rewarderPool.save()

  // 2nd token rewarder
  const tokenRewarder = getRewarder(event.params.rewarder, event.block);
//   tokenRewarder.pool = event.params.pid.toString();
  tokenRewarder.save();

  let tokenRewarderPool = getRewarderPool(event.params.rewarder, event.params.pid, event.block);
  tokenRewarderPool.save()

  const pool = getPool(event.params.pid, event.block);
  pool.sushiRewarder = rewarderPool.id;
  pool.tokenRewarder = tokenRewarderPool.id;
  pool.save();
}

export function logUpdatePool(event: LogUpdatePool): void {
	/*log.info('[MiniChef] Log Update Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.lastRewardTime.toString(), //uint64, I think this is Decimal but not sure
    event.params.lpSupply.toString(),
    event.params.accSushiPerShare.toString(),
  ])*/
//   const rewarder = getRewarder(event.address, event.block);

  const rewarderPool = getRewarderPool(
		event.address,
		event.params.pid,
		event.block
	);
	rewarderPool.accTokenPerShare = event.params.accSushiPerShare;
	rewarderPool.lastRewardPoint = event.params.lastRewardTime;
	rewarderPool.save();

  const pool = getPool(event.params.pid, event.block);
  pool.slpBalance = event.params.lpSupply;
  pool.save()
}

export function logSushiPerSecond(event: LogSushiPerSecond): void {
	//log.info('[MiniChef] Log Sushi Per Second {}', [event.params.sushiPerSecond.toString()])

	// rewarder is masterchef/minichef
	const rewarder = getRewarder(event.address, event.block);
	rewarder.rewardPerPoint = event.params.sushiPerSecond;
	rewarder.save();
}

export function deposit(event: Deposit): void {
	const pool = getPool(event.params.pid, event.block);
	pool.slpBalance = pool.slpBalance.plus(event.params.amount);
	pool.save();

	const user = getUser(event.params.to);
	user.save();

	const rewarderPool = getRewarderPool(event.address, event.params.pid, event.block)

	const userpool = getUserPool(
		event.params.to,
		event.params.pid,
		event.block
	);
	userpool.amount = userpool.amount.plus(event.params.amount);
	userpool.rewardDebt = userpool.rewardDebt.plus(
		event.params.amount
			.times(rewarderPool.accTokenPerShare)
			.div(ACC_SUSHI_PRECISION)
	);
	userpool.save();
}

export function withdraw(event: Withdraw): void {
	const pool = getPool(event.params.pid, event.block);
	pool.slpBalance = pool.slpBalance.minus(event.params.amount);
	pool.save();

  const rewarderPool = getRewarderPool(event.address, event.params.pid, event.block)

	const userpool = getUserPool(
		event.params.user,
		event.params.pid,
		event.block
	);
	userpool.amount = userpool.amount.minus(event.params.amount);
	userpool.rewardDebt = userpool.rewardDebt.minus(
		event.params.amount
			.times(rewarderPool.accTokenPerShare)
			.div(ACC_SUSHI_PRECISION)
	);
	userpool.save();
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
	const pool = getPool(event.params.pid, event.block);
	pool.slpBalance = pool.slpBalance.minus(event.params.amount);
	pool.save();

	const userpool = getUserPool(
		event.params.user,
		event.params.pid,
		event.block
	);
	userpool.amount = ZERO_BI;
	userpool.rewardDebt = ZERO_BI;
	userpool.save();
}

export function harvest(event: Harvest): void {
	// rewarder is masterchef/minichef
	const rewarder = getRewarder(event.address, event.block);
	const rewarderPool = getRewarderPool(
		event.address,
		event.params.pid,
		event.block
	);

	const userpool = getUserPool(
		event.params.user,
		event.params.pid,
		event.block
	);
	userpool.rewardDebt = userpool.amount
		.times(rewarderPool.accTokenPerShare)
		.div(ACC_SUSHI_PRECISION);
	userpool.save();
}

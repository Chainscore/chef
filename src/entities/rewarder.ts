import {
	ZERO_BI,
	ONE_BI
} from "./const";
import { Address, ethereum, BigInt, dataSource } from "@graphprotocol/graph-ts";

import { Rewarder as RewarderTemplate } from "../../generated/templates";
import { Rewarder as RewarderContract } from "../../generated/MiniChef/Rewarder";
import { Rewarder, RewarderPool } from "../../generated/schema";

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
	let rewarder = Rewarder.load(address.toHex());

	if (rewarder === null) {
		rewarder = new Rewarder(address.toHex());
		const rewarderContract = RewarderContract.bind(address);

		/* -------------------------------------------------------------------------- */
		/*                                Reward Token                                */
		/* -------------------------------------------------------------------------- */
		let rewardTokenCall = rewarderContract.try_sushi();
		if (!rewardTokenCall.reverted) {
			rewarder.rewardToken = rewardTokenCall.value;
		} else {
			rewardTokenCall = rewarderContract.try_SUSHI();
			if (!rewardTokenCall.reverted) {
				rewarder.rewardToken = rewardTokenCall.value;
			} else {
				rewardTokenCall = rewarderContract.try_rewardToken();
				if (!rewardTokenCall.reverted) {
					rewarder.rewardToken = rewardTokenCall.value;
				}
			}
		}

		/* -------------------------------------------------------------------------- */
		/*                                 Reward Rate                                */
		/* -------------------------------------------------------------------------- */
		let sushiPerPointCall = rewarderContract.try_sushiPerBlock();
		if (!sushiPerPointCall.reverted) {
			rewarder.rewardPerPoint = sushiPerPointCall.value;
			rewarder.point = "BLOCK";
		} else {
			sushiPerPointCall = rewarderContract.try_sushiPerSecond();
			if (!sushiPerPointCall.reverted) {
				rewarder.rewardPerPoint = sushiPerPointCall.value;
				rewarder.point = "SECOND";
			} else {
				sushiPerPointCall = rewarderContract.try_rewardPerSecond();
				if (!sushiPerPointCall.reverted) {
					rewarder.rewardPerPoint = sushiPerPointCall.value;
					rewarder.point = "SECOND";
				} else {
					sushiPerPointCall = rewarderContract.try_rewardRate();
					if (!sushiPerPointCall.reverted) {
						rewarder.rewardPerPoint = sushiPerPointCall.value;
						rewarder.point = "SECOND";
					} else {
						rewarder.rewardPerPoint = ZERO_BI;
						rewarder.point = "UNKNOWN";
					}
				}
			}
		}

		const totalAllocationCall = rewarderContract.try_totalAllocPoint();
		if (!totalAllocationCall.reverted) {
			rewarder.totalAllocation = totalAllocationCall.value;
		} else {
			rewarder.totalAllocation = ONE_BI;
		}

		if (rewarder.id !== dataSource.address().toHex()) {
			RewarderTemplate.create(Address.fromString(rewarder.id));
		}
	}

	rewarder.timestamp = block.timestamp;
	rewarder.block = block.number;
	rewarder.save();

	return rewarder as Rewarder;
}

export function getRewarderPool(
	rewarder: Address,
	pid: BigInt,
	block: ethereum.Block
): RewarderPool {
	let rid = rewarder
		.toHex()
		.concat("-")
		.concat(pid.toString());
	let rewarderPool = RewarderPool.load(rid);
	if (!rewarderPool) {
		rewarderPool = new RewarderPool(rid);

		rewarderPool.rewarder = rewarder.toHex();
		rewarderPool.pool = pid.toString();

		const rewarderContract = RewarderContract.bind(rewarder);
		const poolInfoCall = rewarderContract.try_poolInfo(pid);
		if (!poolInfoCall.reverted) {
			rewarderPool.accTokenPerShare = poolInfoCall.value.value0;
			rewarderPool.lastRewardPoint = poolInfoCall.value.value1;
			rewarderPool.allocation = poolInfoCall.value.value2;
		}
	}
	rewarderPool.timestamp = block.timestamp;
	rewarderPool.block = block.number;

	return rewarderPool as RewarderPool;
}

import {
	ADDRESS_ZERO,
	ZERO_BI,
	ONE_BI,
	COMPLEX_REWARDERS,
	CLONE_REWARDERS_DUAL,
	NATIVE,
	MASTERCHEF,
	MASTERCHEFV2,
	MINICHEFS,
} from "./const";
import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";

import { Rewarder as RewarderTemplate } from "../../generated/templates";
import { Rewarder as RewarderContract } from "../../generated/MiniChef/Rewarder";
import { Rewarder, RewarderPool } from "../../generated/schema";

export function getRewarder(address: Address, block: ethereum.Block): Rewarder {
	let rewarder = Rewarder.load(address.toHex());

	if (rewarder === null) {
		rewarder = new Rewarder(address.toHex());
		const rewarderContract = RewarderContract.bind(address);
		// For masterchef
		// if (address == MASTERCHEF) {
		// 	rewarder.point = "BLOCK";
		// 	const rewardTokenCall = rewarderContract.try_sushi();
		// 	if (!rewardTokenCall.reverted) {
		// 		rewarder.rewardToken = rewardTokenCall.value;
		// 	}

		// 	const sushiPerBlockCall = rewarderContract.try_sushiPerBlock();
		// 	if (!sushiPerBlockCall.reverted) {
		// 		rewarder.rewardPerPoint = sushiPerBlockCall.value;
		// 	}

		// 	const totalAllocationCall = rewarderContract.try_totalAllocPoint();
		// 	if (!totalAllocationCall.reverted) {
		// 		rewarder.totalAllocation = totalAllocationCall.value;
		// 	}
		// }
		// For masterchef v2
		if (address == MASTERCHEFV2) {
			rewarder.point = "BLOCK";
			const rewardTokenCall = rewarderContract.try_SUSHI();
			if (!rewardTokenCall.reverted) {
				rewarder.rewardToken = rewardTokenCall.value;
			}

			const sushiPerBlockCall = rewarderContract.try_sushiPerBlock();
			if (!sushiPerBlockCall.reverted) {
				rewarder.rewardPerPoint = sushiPerBlockCall.value;
			}

			const totalAllocationCall = rewarderContract.try_totalAllocPoint();
			if (!totalAllocationCall.reverted) {
				rewarder.totalAllocation = totalAllocationCall.value;
			}
		}
		// For minchef
		else if (MINICHEFS.includes(address)) {
			rewarder.point = "SECOND";
			const rewardTokenCall = rewarderContract.try_SUSHI();
			if (!rewardTokenCall.reverted) {
				rewarder.rewardToken = rewardTokenCall.value;
			}

			const sushiPerBlockCall = rewarderContract.try_sushiPerSecond();
			if (!sushiPerBlockCall.reverted) {
				rewarder.rewardPerPoint = sushiPerBlockCall.value;
			}

			const totalAllocationCall = rewarderContract.try_totalAllocPoint();
			if (!totalAllocationCall.reverted) {
				rewarder.totalAllocation = totalAllocationCall.value;
			}
		}
		// For all clone and complex rewarders
		else {
			rewarder.point = "SECOND";
			const rewardTokenCall = rewarderContract.try_rewardToken();
			if (!rewardTokenCall.reverted) {
				rewarder.rewardToken = rewardTokenCall.value;
			}

			let sushiPerBlockCall = rewarderContract.try_rewardPerSecond();
			if (!sushiPerBlockCall.reverted) {
				rewarder.rewardPerPoint = sushiPerBlockCall.value;
			} else {
				sushiPerBlockCall = rewarderContract.try_rewardRate();
				if (!sushiPerBlockCall.reverted) {
					rewarder.rewardPerPoint = sushiPerBlockCall.value;
				}
			}

			rewarder.totalAllocation = ONE_BI;

			RewarderTemplate.create(Address.fromString(rewarder.id));
		}
		// TODO cover ConvexRewarder, LIDORewarder, etc contract
		rewarder.save();
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

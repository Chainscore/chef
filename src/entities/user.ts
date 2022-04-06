import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { ZERO_BI } from "./const";
import { getPool } from "./pool";

import { User, UserPool } from "../../generated/schema";

export function getUser(address: Address, block: ethereum.Block): User {
	let user = User.load(address.toHex());

	if (user === null) {
		user = new User(address.toHex());
		user.save();
	}

	return user as User;
}

export function getUserPool(
	user: Address,
	pid: BigInt,
	block: ethereum.Block
): UserPool {
	let id = user
		.toHex()
		.concat("-")
		.concat(pid.toString());
    
	let userpool = UserPool.load(id);

	if (userpool === null) {
		userpool = new UserPool(id);
		userpool.user = getUser(user, block).id;
		userpool.pool = getPool(pid, block).id;
		userpool.amount = ZERO_BI;
		userpool.rewardDebt = ZERO_BI;
		userpool.sushiHarvested = ZERO_BI;
		userpool.timestamp = block.timestamp;
		userpool.block = block.number;

		userpool.save();
	}

	return userpool as UserPool;
}

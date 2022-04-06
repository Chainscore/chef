/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const MINICHEF_ADDRESS = '0x67da5f2ffaddff067ab9d5f025f8810634d84287'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let SUSHI_TOKEN_ADDRESS = "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F"
export let COMPLEX_REWARDER = "0x25836011bbc0d5b6db96b20361a474cbc5245b45"
export let ACC_SUSHI_PRECISION = BigInt.fromString("1000000000000")
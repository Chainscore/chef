/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export const ACC_SUSHI_PRECISION = BigInt.fromString("1000000000000")
export const MASTERCHEF = Address.fromString("0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd")
export const MASTERCHEFV2 = Address.fromString("0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d")

export let COMPLEX_REWARDERS: Address[] = [
    Address.fromString("0xFa3de59eDd2500BA725Dad355B98E6a4346Ada7d"),   // celo
    Address.fromString("0xa3378Ca78633B3b9b2255EAa26748770211163AE"),   // polygon
    Address.fromString("0x1334c8e873E1cae8467156e2A81d1C8b566B2da1"),   // moonriver
    Address.fromString("0xeaf76e3bD36680D98d254B378ED706cb0DFBfc1B"),   // fantom
    Address.fromString("0x3f505b5cff05d04f468db65e27e72ec45a12645f"),   // xDAI
    Address.fromString("0x25836011Bbc0d5B6db96b20361A474CbC5245b45"),   // harmony
    Address.fromString("0xef502259dd5d497d082498912031e027c4515563"),   // fuse
]

export let MINICHEFS: Address[] = [
    Address.fromString("0x8084936982D089130e001b470eDf58faCA445008"),   // celo
    Address.fromString("0x0769fd68dFb93167989C6f7254cd0D766Fb2841F"),   // polygon
    Address.fromString("0x3dB01570D97631f69bbb0ba39796865456Cf89A5"),   // moonriver
    Address.fromString("0xf731202A3cf7EfA9368C2d7bD613926f7A144dB5"),   // fantom
    Address.fromString("0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3"),   // xDAI
    Address.fromString("0x67da5f2ffaddff067ab9d5f025f8810634d84287"),   // harmony
    Address.fromString("0x182CD0C6F1FaEc0aED2eA83cd0e160c8Bd4cb063"),   // fuse
    Address.fromString("0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3")    // Arbitrum
]

export let WEIRD_REWARDERS: Address[] = [
    Address.fromString("0x9e01aaC4b3e8781a85b21d9d9F848e72Af77B362"),   // convex
]

export let CLONE_REWARDERS_DUAL: Address[] = []
export let V2CHEFS: Address[] = []
import * as web3 from "@solana/web3.js"
import { isAxiosError } from "axios"
import { retry } from "ts-retry-promise"

export function sleep(duration: number) {
	return new Promise(res => setTimeout(res, duration))
}

export function parseSol(amount: number) {
	return BigInt(Math.floor(amount * web3.LAMPORTS_PER_SOL))
}

export function parseToken(amount: number) {
	return BigInt(Math.floor(amount * 1_000_000))
}

export function formatSol(lamports: bigint) {
	return Number(lamports) / web3.LAMPORTS_PER_SOL
}

export function formatToken(amount: bigint) {
	return Number(amount) / 1_000_000
}

export function percent(value: number, percent: number) {
	return (value / 100) * percent
}

export function bigintPercent(value: bigint, percent: number) {
	return (value / 100n) * BigInt(percent)
}

export async function tryToInsufficient<T>(
	thunk: () => Promise<T>
): Promise<T> {
	return retry(thunk, {
		timeout: "INFINITELY",
		retries: "INFINITELY",
		delay: 3_000,
		retryIf: error => {
			if (isAxiosError(error)) {
				console.error(
					`Raydium request Error: ${JSON.stringify(
						{
							code: error.code,
							message: error.message,
							response: error.response?.data
						},
						null,
						1
					)}`
				)
			} else {
				console.error(
					`RPC request error: ${JSON.stringify(
						{
							name: error?.name,
							message: error?.message
						},
						null,
						1
					)}`
				)
			}

			return !isInsufficientError(error)
		}
	})
}

export function isInsufficientError(_error: any) {
	return false
}
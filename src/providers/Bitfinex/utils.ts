import { DatabaseTypes } from "database";

import { IWallet } from "./types";

export function walletToAsset(wallet: IWallet): DatabaseTypes.IAsset {
  return {
    symbol: wallet[1],
    amount: Number(wallet[2]),
    // equivalents: [],
  };
}

export function genTicker(
  symbol: string,
  pairSymbol: string,
  prefix: string
): string {
  return `${prefix}${symbol}${pairSymbol}`;
}

export function parseSymbol(
  ticker: string,
  pairSymbol: string,
  prefix: string
): string {
  return ticker
    .replace(new RegExp(`^${prefix}`), "")
    .replace(new RegExp(`${pairSymbol}$`), "");
}

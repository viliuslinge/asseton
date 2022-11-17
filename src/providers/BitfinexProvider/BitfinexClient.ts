import dotenv from "dotenv";
import CryptoJS from "crypto-js";

import { generateNonce } from "../utils";

import * as Types from "./types";
import * as Utils from "./utils";

dotenv.config();

const API_KEY = process.env.BITFINEX_API_KEY ?? "";
const API_SECRET = process.env.BITFINEX_API_SECRET ?? "";
const API_VERSION = "v2";
const PUBLIC_URL = `https://api-pub.bitfinex.com/${API_VERSION}/`;
const PRIVATE_URL = `https://api.bitfinex.com/${API_VERSION}/`;

export class BitfninexClient {
  getWallets = async (): Promise<Types.IWallet[]> => {
    const URL_PATH = "auth/r/wallets";

    const url = `${PRIVATE_URL}${URL_PATH}`;
    const nonce = generateNonce();
    const body = new URLSearchParams({}).toString();
    const signature = CryptoJS.HmacSHA384(
      `/api/${API_VERSION}/${URL_PATH}${nonce}${body}`,
      API_SECRET
    ).toString();

    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
        "bfx-nonce": nonce,
        "bfx-apikey": API_KEY,
        "bfx-signature": signature,
      },
    });

    return response.json();
  };

  getTickers = async (
    symbols: string[],
    pairSymbol: string
  ): Promise<Types.ITickers> => {
    const URL_PATH = "tickers";
    const PREFIX = "t";

    const tickers = symbols.map((it) =>
      Utils.genTicker(it, pairSymbol, PREFIX)
    );
    const url = `${PUBLIC_URL}${URL_PATH}?symbols=${tickers.join(",")}`;

    const response = await fetch(url);
    const responseJSON: Array<any[]> = await response.json();

    const result: Types.ITickers = {};

    tickers.forEach((ticker) => {
      const data = responseJSON.find((it) => ticker === it[0]);
      const symbol = Utils.parseSymbol(ticker, pairSymbol, PREFIX);

      result[symbol] = {
        pair: [symbol, pairSymbol],
        price: data ? Number(data[1]) : null,
      };
    });

    return result;
  };
}

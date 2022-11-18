import dotenv from "dotenv";
import Crypto from "crypto";

import { generateNonce } from "../utils";

dotenv.config();

interface IResponse<T> {
  error: string[];
  result: T;
}

interface IBalance {
  [key: string]: string;
}

interface ITickers {
  [key: string]: {
    a: Array<string | number>;
    b: Array<string | number>;
    c: Array<string | number>;
    v: Array<string | number>;
    p: Array<string | number>;
    t: Array<string | number>;
    l: Array<string | number>;
    h: Array<string | number>;
    o: Array<string | number>;
  };
}

const API_KEY = process.env.KRAKEN_API_KEY ?? "";
const API_SECRET = process.env.KRAKEN_API_SECRET ?? "";
const API_VERSION = "0";
const BASE_URL = "https://api.kraken.com/";

export class KrakenClient {
  getBalance = async (): Promise<IResponse<IBalance>> => {
    const URL_PATH = `${API_VERSION}/private/Balance`;

    const url = `${BASE_URL}${URL_PATH}`;
    const nonce = generateNonce();
    const body = new URLSearchParams({ nonce }).toString();
    const signature = Crypto.createHmac(
      "sha512",
      Buffer.from(API_SECRET, "base64")
    )
      .update(`/${URL_PATH}`)
      .update(
        Crypto.createHash("sha256")
          .update(nonce + body)
          .digest()
      )
      .digest("base64");

    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "API-Key": API_KEY,
        "API-Sign": signature,
      },
    });

    return response.json();
  };

  getTickers = async (tickers: string[]): Promise<IResponse<ITickers>> => {
    const URL_PATH = `${API_VERSION}/public/Ticker`;

    const url = `${BASE_URL}${URL_PATH}?pair=${tickers.join(",")}`;
    const response = await fetch(url);

    return response.json();
  };

  getTradeBalance = async () => {
    const URL_PATH = `${API_VERSION}/private/TradeBalance`;

    const url = `${BASE_URL}${URL_PATH}`;
    const nonce = generateNonce();
    const body = new URLSearchParams({ nonce, asset: "EUR" }).toString();
    const signature = Crypto.createHmac(
      "sha512",
      Buffer.from(API_SECRET, "base64")
    )
      .update(`/${URL_PATH}`)
      .update(
        Crypto.createHash("sha256")
          .update(nonce + body)
          .digest()
      )
      .digest("base64");

    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "API-Key": API_KEY,
        "API-Sign": signature,
      },
    });

    return response.json();
  };
}

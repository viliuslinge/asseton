import { DatabaseTypes } from "database";

import { IProvider, IProviderInput } from "../Provider";

import { KrakenClient } from "./KrakenClient";

export interface ITicker {
  pair: [string, string];
  price: number | null;
}

export interface ITickers {
  // Key represents symbol of the asset
  [key: string]: ITicker;
}

export class KrakenProvider implements IProvider {
  private client: KrakenClient;
  id: string;

  constructor(input: IProviderInput) {
    this.id = input.id;
    this.client = new KrakenClient();
  }

  getDataSnapshot = async () => {
    const account = this.getAccount();
    account.assets = await this.getAccountAssets();
    // account.equivalents = await this.getTotalAssetEquivalents();

    const result = {
      providerID: this.id,
      authorizationID: null,
      updatedAt: new Date().toISOString(),
      accounts: [account],
    };

    return result;
  };

  private getAccount = (): DatabaseTypes.IAccount => {
    return {
      assets: [],
      // equivalents: [],
    };
  };

  private getAccountAssets = async (): Promise<DatabaseTypes.IAsset[]> => {
    const data = await this.client.getBalance();
    const balance: Record<string, number> = {};

    for (let key in data.result) {
      const parsedKey = key.replace(/(\.S|\.M)$/, "");

      balance[parsedKey] =
        Number(balance[parsedKey] ?? 0) + Number(data.result[key]);
    }

    const result: DatabaseTypes.IAsset[] = [];

    for (let key in balance) {
      result.push({
        symbol: key,
        amount: Number(balance[key]),
        // equivalents: [],
      });
    }

    return result;
  };

  private getTotalAssetEquivalents = async (): Promise<
    DatabaseTypes.IEquivalent[]
  > => {
    const data = await this.client.getTradeBalance();
    return [
      {
        symbol: "EUR",
        amount: Number(data.result["eb"]),
      },
    ];
  };

  private getTickers = async (
    symbols: string[],
    pairSymbol: string
  ): Promise<ITickers> => {
    const tickers = symbols.map((symbol) => `${symbol}${pairSymbol}`);

    const response = await this.client.getTickers(tickers);

    const result: ITickers = {};

    tickers.forEach((ticker) => {
      const data = response.result[ticker];
      const symbol = ticker.replace(new RegExp(`${pairSymbol}$`), "");

      result[symbol] = {
        pair: [symbol, pairSymbol],
        price: data ? Number(data.c[0]) : null,
      };
    });

    return result;
  };
}

import { DatabaseTypes } from "database";

import { IProvider, IProviderInput } from "../Provider";

import { BitfninexClient } from "./BitfinexClient";
import * as Types from "./types";
import * as Utils from "./utils";

/**
 * To simplify calculations of asset equivalents all assets are converted
 * to the same equivalent symbol
 */
const BASE_ASSET_SYMBOL = "USD";

export class BitfinexProvider implements IProvider {
  /**
   * A list of symbols used to calculate asset equivalents
   */
  private assetEquivalentsSymbols: string[];
  private client: BitfninexClient;
  id: string;

  constructor(input: IProviderInput) {
    this.id = input.id;
    this.assetEquivalentsSymbols = ["EUR"];
    this.client = new BitfninexClient();
  }

  getDataSnapshot = async () => {
    const account = this.getAccount();
    account.assets = await this.getAccountAssets(this.assetEquivalentsSymbols);
    // account.equivalents = this.getTotalAssetEquivalents(account.assets);

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

  private getAccountAssets = async (
    assetEquivalentSymbols: string[]
  ): Promise<DatabaseTypes.IAsset[]> => {
    const wallets = await this.client.getWallets();
    const assets: Types.IAssets = {};

    wallets.forEach((it) => {
      const asset = Utils.walletToAsset(it);
      assets[asset.symbol] = asset;
    });

    const assetEquivalents = await this.getAssetEquivalents(assets, [
      BASE_ASSET_SYMBOL,
    ]);

    const baseAssetEquivalents = await this.getAssetEquivalents(
      {
        [BASE_ASSET_SYMBOL]: {
          symbol: BASE_ASSET_SYMBOL,
          amount: 1,
          // equivalents: [],
        },
      },
      assetEquivalentSymbols
    );

    for (let symbol in assetEquivalents) {
      const baseEquivalent = assetEquivalents[symbol][0];
      const newEquivalents: DatabaseTypes.IEquivalent[] = [];
      assetEquivalents[symbol] = newEquivalents;

      for (let symbol in baseAssetEquivalents) {
        baseAssetEquivalents[symbol].forEach((it) => {
          const ammount =
            baseEquivalent.amount && it.amount
              ? baseEquivalent.amount * it.amount
              : null;

          newEquivalents.push({
            symbol: it.symbol,
            amount: ammount,
          });
        });
      }
    }

    return Object.values(assets).map((asset) => {
      return {
        ...asset,
        equivalents: assetEquivalents[asset.symbol] ?? [],
      };
    });
  };

  private getAssetEquivalents = async (
    assets: Types.IAssets,
    assetEquivalentSymbols: string[]
  ): Promise<Types.IEquivalents> => {
    const result: Types.IEquivalents = {};

    for (let symbol in assets) {
      result[symbol] = [];
    }

    for (let equivalentSymbol of assetEquivalentSymbols) {
      const assetTickers = await this.client.getTickers(
        Object.keys(assets),
        equivalentSymbol
      );

      for (let symbol in result) {
        const asset = assets[symbol];
        const assetTicker = assetTickers[symbol];

        let amount: number | null = null;

        if (asset.symbol === equivalentSymbol) {
          amount = asset.amount;
        } else if (asset && assetTicker && assetTicker.price) {
          amount = asset.amount * assetTicker.price;
        }

        result[symbol].push({
          symbol: equivalentSymbol,
          amount: amount,
        });
      }
    }

    return result;
  };

  // private getTotalAssetEquivalents = (
  //   assets: DatabaseTypes.IAsset[]
  // ): DatabaseTypes.IEquivalent[] => {
  //   const result: DatabaseTypes.IEquivalent[] = [];

  //   assets
  //     .flatMap((asset) => asset.equivalents)
  //     .forEach((equivalent) => {
  //       const match = result.find((it) => it.symbol === equivalent.symbol);
  //       if (!match) {
  //         result.push({
  //           symbol: equivalent.symbol,
  //           amount: equivalent.amount,
  //         });

  //         return;
  //       }

  //       if (match.amount === null || equivalent.amount === null) {
  //         return;
  //       }

  //       match.amount = match.amount + equivalent.amount;
  //     });

  //   return result;
  // };
}

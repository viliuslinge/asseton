import { DatabaseTypes } from "database";

export interface ITicker {
  pair: [string, string];
  price: number | null;
}

export type IWallet = Array<any>;

export interface ITickers {
  // Key represents symbol of the asset
  [key: string]: ITicker;
}

export interface IAssets {
  // Key represents symbol of the asset
  [key: string]: DatabaseTypes.IAsset;
}

export interface IEquivalents {
  // Key represents symbol of the asset
  [key: string]: DatabaseTypes.IEquivalent[];
}

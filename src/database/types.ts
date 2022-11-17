export namespace DatabaseTypes {
  export interface IProviderData {
    id: string;
    createdAt: string;
    accounts: Array<IAccount>;
  }

  export interface IAccount {
    assets: Array<IAsset>;
  }

  export interface IAsset {
    symbol: string;
    amount: number;
  }

  export interface IEquivalent {
    symbol: string;
    amount: number | null;
  }
}

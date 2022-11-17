import { DatabaseTypes } from "database";

export interface IProviderInput {
  id: string;
}

export interface IProvider {
  id: string;
  getDataSnapshot(): Promise<DatabaseTypes.IProviderData>;
}

export abstract class AuthenticatedProvider implements IProvider {
  id: string;

  constructor(input: IProviderInput) {
    this.id = input.id;
  }

  abstract getDataSnapshot(): Promise<DatabaseTypes.IProviderData>;
  abstract createAuthentication(
    input: IProviderAuthenticationInput
  ): Promise<IProviderAuthentication>;
  abstract deleteAuthentication(): Promise<void>;
}

export interface IProviderAuthentication {
  authenticationUrl: string;
}

export interface IProviderAuthenticationInput {
  redirectUrl: string;
}

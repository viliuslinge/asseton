import crypto from "crypto";

import { ServerApiError } from "src/errors";
import { DatabaseTypes } from "database";

import {
  IProviderAuthentication,
  IProviderAuthenticationInput,
  AuthenticatedProvider,
  IProviderInput,
} from "../Provider";

import { NordigenClient } from "./NordigenClient";
import { NordginenApiTypes } from "./NordigenApi";

interface IRequisition {
  id: string;
  status: "CREATED" | "AUTHENTICATED";
  authenticationUrl: string;
  accountIDs: Array<string>;
}

export class NordigenProvider extends AuthenticatedProvider {
  client: NordigenClient;

  constructor(input: IProviderInput) {
    super(input);
    this.client = new NordigenClient();
    this.ensureToken();
  }

  private ensureToken = async (): Promise<void> => {
    await this.client.generateToken();
  };

  getDataSnapshot = async (): Promise<DatabaseTypes.IProviderData> => {
    const requisition = await this.getExistingRequisition();
    if (!requisition || requisition.status === "CREATED") {
      throw ServerApiError.AuthenticationRequired();
    }

    const result: DatabaseTypes.IProviderData = {
      id: this.id,
      createdAt: new Date().toISOString(),
      accounts: [],
    };

    for (let accountID of requisition.accountIDs) {
      const { balances }: NordginenApiTypes.IBalances = await this.client
        .account(accountID)
        .getBalances();

      const account: DatabaseTypes.IAccount = {
        assets: [],
      };

      balances.forEach((it) => {
        account.assets.push({
          symbol: it.balanceAmount.currency,
          amount: Number(it.balanceAmount.amount),
        });
      });

      result.accounts.push(account);
    }

    return result;
  };

  createAuthentication = async (
    input: IProviderAuthenticationInput
  ): Promise<IProviderAuthentication> => {
    let requisition = await this.getExistingRequisition();

    if (!requisition) {
      const agreement: NordginenApiTypes.IAgreement =
        await this.client.createAgreement({
          institutionId: this.id,
          maxHistoricalDays: 30,
          accessValidForDays: 1,
        });

      const req: NordginenApiTypes.IRequisition =
        await this.client.createRequisition({
          redirectUrl: input.redirectUrl,
          institutionId: this.id,
          reference: crypto.randomUUID(),
          agreement: agreement.id,
        });

      requisition = this.transformRequisition(req);
    }

    if (requisition.status === "AUTHENTICATED") {
      throw ServerApiError.AuthenticationExists();
    }

    return {
      authenticationUrl: requisition.authenticationUrl,
    };
  };

  deleteAuthentication = async (): Promise<void> => {
    const requisition = await this.getExistingRequisition();
    if (!requisition) {
      throw ServerApiError.AuthenticationNotFound();
    }

    await this.client.deleteRequisition(requisition.id);
  };

  private getExistingRequisition = async (): Promise<
    IRequisition | undefined
  > => {
    const allAgreements: NordginenApiTypes.IAgreements =
      await this.client.getAgreements();

    const providerAgreements: NordginenApiTypes.IAgreement[] =
      allAgreements.results.filter((it) => it.institution_id === this.id);

    const allRequisitions: NordginenApiTypes.IRequisitions =
      await this.client.getRequisitions();

    const providerRequisitions: NordginenApiTypes.IRequisition[] =
      allRequisitions.results
        .filter((it) => it.institution_id === this.id)
        .sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );

    const validProviderRequisitions: NordginenApiTypes.IRequisition[] =
      providerRequisitions.filter((it) => {
        const agreement = providerAgreements.find(
          (agr) => agr.id === it.agreement
        );

        if (!agreement) {
          return false;
        }

        if (!this.isAgreementValid(agreement)) {
          return false;
        }

        return true;
      });

    const requisition =
      validProviderRequisitions.find((it) => it.status === "LN") ??
      validProviderRequisitions.find((it) => it.status === "CR");

    if (!requisition) {
      return;
    }

    return this.transformRequisition(requisition);
  };

  private transformRequisition = (
    requisition: NordginenApiTypes.IRequisition
  ): IRequisition => {
    function transformStatus(
      status: NordginenApiTypes.IRequisition["status"]
    ): IRequisition["status"] {
      switch (status) {
        case "CR":
          return "CREATED";
        case "LN":
          return "AUTHENTICATED";
      }
    }

    return {
      id: requisition.id,
      authenticationUrl: requisition.link,
      status: transformStatus(requisition.status),
      accountIDs: requisition.accounts,
    };
  };

  private isAgreementValid = (
    agreement: NordginenApiTypes.IAgreement
  ): boolean => {
    const timeNow = new Date().getTime();
    const validUntil =
      new Date(agreement.created).getTime() +
      agreement.access_valid_for_days * 24 * 60 * 60 * 1000;

    return validUntil > timeNow;
  };
}

import * as dotenv from "dotenv";

import { ServerApiError } from "src/errors";

import NordigenClientRaw from "./NordigenClientRaw";
import { NordginenTypes } from "./types";

dotenv.config();

const secretId = process.env.NORDIGEN_API_ID ?? "";
const secretKey = process.env.NORDIGEN_API_KEY ?? "";

export class NordigenClient {
  client: NordigenClientRaw;

  constructor() {
    this.client = new NordigenClientRaw({
      secretId,
      secretKey,
    });
  }

  generateToken = async () => {
    return this.intercept((await this.client.generateToken()) as any);
  };

  getRequisitions = async (input?: {
    limit?: number;
    offset?: number;
  }): Promise<NordginenTypes.IRequisitions> => {
    return this.intercept(await this.client.requisition.getRequisitions(input));
  };

  getRequisitionById = async (
    input: string
  ): Promise<NordginenTypes.IRequisition> => {
    return this.intercept(
      await this.client.requisition.getRequisitionById(input)
    );
  };

  createRequisition = async (input: {
    redirectUrl: string;
    institutionId: string;
    agreement?: string;
    userLanguage?: string;
    reference: string;
  }): Promise<NordginenTypes.IRequisition> => {
    return this.intercept(
      await this.client.requisition.createRequisition(input)
    );
  };

  deleteRequisition = async (input: string): Promise<void> => {
    return this.intercept(
      await this.client.requisition.deleteRequisition(input)
    );
  };

  getAgreements = async (input?: {
    limit?: number;
    offset?: number;
  }): Promise<NordginenTypes.IAgreements> => {
    return this.intercept(await this.client.agreement.getAgreements(input));
  };

  getAgreementById = async (
    input: string
  ): Promise<NordginenTypes.IAgreement> => {
    return this.intercept(await this.client.agreement.getAgreementById(input));
  };

  createAgreement = async (input: {
    institutionId: string;
    maxHistoricalDays?: number;
    accessValidForDays?: number;
    accessScope?: string[];
  }): Promise<NordginenTypes.IAgreement> => {
    return this.intercept(await this.client.agreement.createAgreement(input));
  };

  account = (
    input: string
  ): {
    getBalances: () => Promise<NordginenTypes.IBalances>;
  } => {
    const account = this.intercept(this.client.account(input));

    return {
      getBalances: async () => this.intercept(await account.getBalances()),
    };
  };

  private intercept = <T extends object>(res: T | NordginenTypes.IError) => {
    if ("status_code" in res) {
      throw ServerApiError.Custom({
        // TODO: fix
        // @ts-ignore
        code: res.summary,
        statusCode: res.status_code,
        message: res.detail,
      });
    } else {
      return res;
    }
  };
}

import * as dotenv from "dotenv";

import { ServerApiError } from "src/errors";

import { NordigenApi, NordginenApiTypes } from "./NordigenApi";

dotenv.config();

const secretId = process.env.NORDIGEN_API_ID ?? "";
const secretKey = process.env.NORDIGEN_API_KEY ?? "";

export class NordigenClient {
  api: NordigenApi;

  constructor() {
    this.api = new NordigenApi({
      secretId,
      secretKey,
    });
  }

  generateToken = async () => {
    return this.intercept((await this.api.generateToken()) as any);
  };

  getRequisitions = async (input?: {
    limit?: number;
    offset?: number;
  }): Promise<NordginenApiTypes.IRequisitions> => {
    return this.intercept(await this.api.requisition.getRequisitions(input));
  };

  getRequisitionById = async (
    input: string
  ): Promise<NordginenApiTypes.IRequisition> => {
    return this.intercept(await this.api.requisition.getRequisitionById(input));
  };

  createRequisition = async (input: {
    redirectUrl: string;
    institutionId: string;
    agreement?: string;
    userLanguage?: string;
    reference: string;
  }): Promise<NordginenApiTypes.IRequisition> => {
    return this.intercept(await this.api.requisition.createRequisition(input));
  };

  deleteRequisition = async (
    input: string
  ): Promise<NordginenApiTypes.IDeleteRequisitionOutput> => {
    return this.intercept(await this.api.requisition.deleteRequisition(input));
  };

  getAgreements = async (input?: {
    limit?: number;
    offset?: number;
  }): Promise<NordginenApiTypes.IAgreements> => {
    return this.intercept(await this.api.agreement.getAgreements(input));
  };

  getAgreementById = async (
    input: string
  ): Promise<NordginenApiTypes.IAgreement> => {
    return this.intercept(await this.api.agreement.getAgreementById(input));
  };

  createAgreement = async (input: {
    institutionId: string;
    maxHistoricalDays?: number;
    accessValidForDays?: number;
    accessScope?: string[];
  }): Promise<NordginenApiTypes.IAgreement> => {
    return this.intercept(await this.api.agreement.createAgreement(input));
  };

  account = (
    input: string
  ): {
    getBalances: () => Promise<NordginenApiTypes.IBalances>;
  } => {
    const account = this.api.account(input);

    return {
      getBalances: async () => this.intercept(await account.getBalances()),
    };
  };

  private intercept = <T extends object>(res: T | NordginenApiTypes.IError) => {
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

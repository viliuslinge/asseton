import dotenv from "dotenv";
import NordigenClientRaw from "nordigen-node";
import type {
  AccountApi,
  AgreementApi,
  RequisitionsApi,
} from "nordigen-node/types/api";

import { ServerApiError } from "src/errors";

import { NordginenTypes } from "./types";

dotenv.config();

const secretId = process.env.NORDIGEN_API_ID ?? "";
const secretKey = process.env.NORDIGEN_API_KEY ?? "";

export class NordigenClient {
  private client: NordigenClientRaw;

  constructor() {
    this.client = new NordigenClientRaw({
      secretId,
      secretKey,
    });
  }

  generateToken: NordigenClientRaw["generateToken"] = async () => {
    return this.intercept(await this.client.generateToken());
  };

  getRequisitions: RequisitionsApi["getRequisitions"] = async (
    input
  ): Promise<NordginenTypes.IRequisitions> => {
    return this.intercept(await this.client.requisition.getRequisitions(input));
  };

  getRequisitionById: RequisitionsApi["getRequisitionById"] = async (
    input
  ): Promise<NordginenTypes.IRequisition> => {
    return this.intercept(
      await this.client.requisition.getRequisitionById(input)
    );
  };

  createRequisition: RequisitionsApi["createRequisition"] = async (
    input
  ): Promise<NordginenTypes.IRequisition> => {
    return this.intercept(
      await this.client.requisition.createRequisition(input)
    );
  };

  deleteRequisition: RequisitionsApi["deleteRequisition"] = async (input) => {
    return this.intercept(
      await this.client.requisition.deleteRequisition(input)
    );
  };

  getAgreements: AgreementApi["getAgreements"] = async (
    input
  ): Promise<NordginenTypes.IAgreements> => {
    return this.intercept(await this.client.agreement.getAgreements(input));
  };

  getAgreementById: AgreementApi["getAgreementById"] = async (
    input
  ): Promise<NordginenTypes.IAgreement> => {
    return this.intercept(await this.client.agreement.getAgreementById(input));
  };

  createAgreement: AgreementApi["createAgreement"] = async (
    input
  ): Promise<NordginenTypes.IAgreement> => {
    return this.intercept(await this.client.agreement.createAgreement(input));
  };

  account: NordigenClientRaw["account"] = (input) => {
    const account = this.intercept(this.client.account(input));

    return {
      getBalances: async () => this.intercept(await account.getBalances()),
      getDetails: async () => this.intercept(await account.getDetails()),
      getMetadata: async () => this.intercept(await account.getMetadata()),
      getTransactions: async () =>
        this.intercept(await account.getTransactions()),
    } as AccountApi;
  };

  private intercept = <T>(res: T | NordginenTypes.IError) => {
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

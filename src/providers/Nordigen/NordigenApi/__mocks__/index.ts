import NordigenApiRaw from "nordigen-node";
import { AccountApi } from "nordigen-node/types/api";

import { nordigen } from "tests/mocks";
import { IDeepPartial } from "src/utils";

import { NordginenApiTypes } from "../types";

export const NordigenApi = (
  jest.fn() as jest.Mock<IDeepPartial<NordigenApiRaw>>
).mockImplementation(() => {
  return {
    generateToken: () => new Promise((res) => res({})),
    agreement: {
      getAgreements: (): Promise<NordginenApiTypes.IAgreements> => {
        return new Promise((res) => {
          return res({
            results: [],
          });
        });
      },
      getAgreementById: (): Promise<NordginenApiTypes.IAgreement> => {
        return new Promise((res) => {
          return res(nordigen.agreement_1);
        });
      },
      createAgreement: (): Promise<NordginenApiTypes.IAgreement> => {
        return new Promise((res) => {
          return res(nordigen.agreement_1);
        });
      },
    },
    requisition: {
      getRequisitions: (): Promise<NordginenApiTypes.IRequisitions> => {
        return new Promise((res) => {
          return res({
            results: [],
          });
        });
      },
      getRequisitionById: (): Promise<NordginenApiTypes.IRequisition> => {
        return new Promise((res) => {
          return res(nordigen.requisition_1);
        });
      },
      createRequisition: (): Promise<NordginenApiTypes.IRequisition> => {
        return new Promise((res) => {
          return res(nordigen.requisition_1);
        });
      },
      deleteRequisition:
        (): Promise<NordginenApiTypes.IDeleteRequisitionOutput> => {
          return new Promise((res) => {
            return res({
              message: "Deleted",
            });
          });
        },
    },
    account: (): Partial<AccountApi> => {
      return {
        getBalances: (): Promise<NordginenApiTypes.IBalances> => {
          return new Promise((res) => {
            return res(nordigen.balances_1);
          });
        },
      };
    },
  };
});

import NordigenApiRaw from "nordigen-node";
import { AccountApi } from "nordigen-node/types/api";

import { agreement_1, requisition_1, balances_1 } from "tests/mocks";

import { NordginenApiTypes } from "../types";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const NordigenApi = (
  jest.fn() as jest.Mock<DeepPartial<NordigenApiRaw>>
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
          return res(agreement_1);
        });
      },
      createAgreement: (): Promise<NordginenApiTypes.IAgreement> => {
        return new Promise((res) => {
          return res(agreement_1);
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
          return res(requisition_1);
        });
      },
      createRequisition: (): Promise<NordginenApiTypes.IRequisition> => {
        return new Promise((res) => {
          return res(requisition_1);
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
            return res(balances_1);
          });
        },
      };
    },
  };
});

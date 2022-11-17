import NordigenClient from "nordigen-node";

import { NordginenTypes } from "../../types";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

const agreement1: NordginenTypes.IAgreement = {
  id: "agreement-1",
  created: "date",
  max_historical_days: 10,
  access_valid_for_days: 1,
  access_scope: [],
  institution_id: "test-provider",
};

const requisition1: NordginenTypes.IRequisition = {
  id: "requisition-1",
  created: "date",
  redirect: "https://google.com",
  status: "CR",
  institution_id: "test-provider",
  agreement: "agreemens-1",
  reference: "",
  accounts: [],
  link: "",
  ssn: "",
  account_selection: false,
  redirect_immediate: false,
};

const balances: NordginenTypes.IBalances = {
  balances: [
    {
      balanceAmount: {
        amount: "1000",
        currency: "EUR",
      },
      balanceType: "",
      referenceDate: "date",
    },
  ],
};

export default (
  jest.fn() as jest.Mock<DeepPartial<NordigenClient>>
).mockImplementation(() => {
  return {
    generateToken: () => new Promise((res) => res({})),
    agreement: {
      getAgreements: (): Promise<NordginenTypes.IAgreements> => {
        return new Promise((res) => {
          return res({
            results: [],
          });
        });
      },
      getAgreementById: (): Promise<NordginenTypes.IAgreement> => {
        return new Promise((res) => {
          return res(agreement1);
        });
      },
      createAgreement: (): Promise<NordginenTypes.IAgreement> => {
        return new Promise((res) => {
          return res(agreement1);
        });
      },
    },
    requisition: {
      getRequisitions: (): Promise<NordginenTypes.IRequisitions> => {
        return new Promise((res) => {
          return res({
            results: [],
          });
        });
      },
      getRequisitionById: (): Promise<NordginenTypes.IRequisition> => {
        return new Promise((res) => {
          return res(requisition1);
        });
      },
      createRequisition: (): Promise<NordginenTypes.IRequisition> => {
        return new Promise((res) => {
          return res(requisition1);
        });
      },
      deleteRequisition: (): Promise<void> => {
        return new Promise((res) => {
          return res();
        });
      },
    },
    account: {
      getBalances: (): Promise<NordginenTypes.IBalances> => {
        return new Promise((res) => {
          return res(balances);
        });
      },
    },
  };
});

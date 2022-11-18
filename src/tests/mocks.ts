import { DatabaseTypes } from "database";
import { NordginenApiTypes } from "providers/Nordigen/NordigenApi";

const agreement_1: NordginenApiTypes.IAgreement = {
  id: "a1",
  created: new Date().toISOString(),
  max_historical_days: 10,
  access_valid_for_days: 2,
  access_scope: [],
  institution_id: "nordigen",
};

const requisition_1: NordginenApiTypes.IRequisition = {
  id: "r1",
  created: new Date().toISOString(),
  redirect: "https://google.com",
  status: "CR",
  institution_id: "nordigen",
  agreement: "a1",
  reference: "",
  accounts: ["acc1"],
  link: "https://link.com",
  ssn: "",
  account_selection: false,
  redirect_immediate: false,
};

const balances_1: NordginenApiTypes.IBalances = {
  balances: [
    {
      balanceAmount: {
        amount: "1000000",
        currency: "EUR",
      },
      balanceType: "",
      referenceDate: new Date().toISOString(),
    },
  ],
};

const data_snapshot_1: DatabaseTypes.IProviderData = {
  id: "provider-1",
  createdAt: new Date().toISOString(),
  accounts: [
    {
      assets: [
        {
          symbol: "EUR",
          amount: 1000000,
        },
      ],
    },
  ],
};

export const nordigen = {
  agreement_1,
  requisition_1,
  balances_1,
};

export const database = {
  data_snapshot_1,
};

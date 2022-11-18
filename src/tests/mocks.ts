import { DatabaseTypes } from "database";
import { NordginenApiTypes } from "providers/Nordigen/NordigenApi";
import { TEST_PROVIDER_ID } from "src/config";

const agreement_1: NordginenApiTypes.IAgreement = {
  id: "a1",
  created: "2022-11-18T09:51:24.810Z",
  max_historical_days: 10,
  access_valid_for_days: 2,
  access_scope: [],
  institution_id: TEST_PROVIDER_ID,
};

const requisition_1: NordginenApiTypes.IRequisition = {
  id: "r1",
  created: "2022-11-18T09:51:24.810Z",
  redirect: "https://google.com",
  status: "CR",
  institution_id: TEST_PROVIDER_ID,
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
      referenceDate: "2022-11-18T09:51:24.810Z",
    },
  ],
};

const data_snapshot_1: DatabaseTypes.IProviderData = {
  id: TEST_PROVIDER_ID,
  createdAt: "2022-11-18T09:51:24.810Z",
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

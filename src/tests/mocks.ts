import { NordginenApiTypes } from "src/providers/Nordigen/NordigenApi";

export const agreement_1: NordginenApiTypes.IAgreement = {
  id: "a1",
  created: new Date().toISOString(),
  max_historical_days: 10,
  access_valid_for_days: 2,
  access_scope: [],
  institution_id: "nordigen",
};

export const requisition_1: NordginenApiTypes.IRequisition = {
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

export const balances_1: NordginenApiTypes.IBalances = {
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

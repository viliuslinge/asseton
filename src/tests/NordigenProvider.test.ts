import { DatabaseTypes } from "database";
import { ServerApiError } from "src/errors";
import { IProviderAuthentication } from "providers/Provider";
import { NordigenProvider } from "providers/Nordigen/NordigenProvider";
import { AccountApi, NordginenApiTypes } from "providers/Nordigen/NordigenApi";
import { findProviderRequisition } from "providers/Nordigen/utils";

import { agreement_1, requisition_1, balances_1 } from "./mocks";

const providerID = "nordigen";

it("Fails getting data snapshot without authentication", async () => {
  const provider = new NordigenProvider({ id: providerID });
  await expect(provider.getDataSnapshot).rejects.toBeInstanceOf(ServerApiError);
});

it("Fails getting data snapshot with incompleted authentication", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...agreement_1,
          institution_id: providerID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...requisition_1,
          institution_id: providerID,
        },
      ],
    });

  await expect(provider.getDataSnapshot).rejects.toBeInstanceOf(ServerApiError);

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Succeeds getting data snapshot with completed authentication", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getBalancesSpy = jest
    .spyOn(provider.client.api, "account")
    .mockReturnValue({
      getBalances: () => {
        return new Promise((res) => {
          return res(balances_1);
        });
      },
    } as AccountApi);

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...agreement_1,
          institution_id: providerID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...requisition_1,
          status: "LN",
          institution_id: providerID,
        },
      ],
    });

  const received = await provider.getDataSnapshot();
  const expected: Partial<DatabaseTypes.IProviderData> = {
    id: providerID,
    accounts: [
      {
        assets: [
          {
            amount: Number(balances_1.balances[0].balanceAmount.amount),
            symbol: balances_1.balances[0].balanceAmount.currency,
          },
        ],
      },
    ],
  };

  expect(received).toEqual(expect.objectContaining(expected));

  getBalancesSpy.mockRestore();
  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Succeeds initiating authenticating for the first time", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [],
    });

  const createRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "createRequisition")
    .mockResolvedValue({
      ...requisition_1,
      institution_id: providerID,
    });

  const received = await provider.createAuthentication({ redirectUrl: "" });
  const expected: IProviderAuthentication = {
    authenticationUrl: requisition_1.link,
  };

  expect(received).toEqual(expect.objectContaining(expected));

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
  createRequisitionsSpy.mockRestore();
});

it("Succeds initiating authentication if incompleted authentication exists. Returns existing authentication", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...agreement_1,
          institution_id: providerID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...requisition_1,
          institution_id: providerID,
        },
      ],
    });

  const received = await provider.createAuthentication({ redirectUrl: "" });
  const expected: IProviderAuthentication = {
    authenticationUrl: requisition_1.link,
  };

  expect(received).toEqual(expect.objectContaining(expected));

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Fails authenticating if completed and valid authentication exists", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...agreement_1,
          institution_id: providerID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...requisition_1,
          status: "LN",
          institution_id: providerID,
        },
      ],
    });

  await expect(provider.createAuthentication).rejects.toBeInstanceOf(
    ServerApiError
  );

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Fails deleting authentication if it doesnt exist", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [],
    });

  await expect(provider.deleteAuthentication).rejects.toBeInstanceOf(
    ServerApiError
  );

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Succeds deleting existing authentication", async () => {
  const provider = new NordigenProvider({ id: providerID });

  const getAgreementsSpy = jest
    .spyOn(provider.client.api.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...agreement_1,
          institution_id: providerID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(provider.client.api.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...requisition_1,
          institution_id: providerID,
        },
      ],
    });

  const received = await provider.deleteAuthentication();

  expect(received).toEqual(undefined);

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Fails finding existing provider requisition: No results matching providerID", () => {
  const provider = new NordigenProvider({ id: providerID });

  const agreements: NordginenApiTypes.IAgreements = {
    results: [
      {
        ...agreement_1,
        institution_id: "any-other-provider",
      },
    ],
  };

  const requisitions: NordginenApiTypes.IRequisitions = {
    results: [
      {
        ...requisition_1,
        institution_id: "any-other-provider",
      },
    ],
  };

  const received = findProviderRequisition({
    providerID: provider.id,
    agreements,
    requisitions,
  });

  expect(received).toBeUndefined();
});

it("Fails finding existing provider requisition: existing requisition is expired", () => {
  const provider = new NordigenProvider({ id: providerID });
  const dayInMS = 24 * 60 * 60 * 1000;

  const agreements: NordginenApiTypes.IAgreements = {
    results: [
      {
        ...agreement_1,
        institution_id: provider.id,
        created: new Date(
          new Date().getTime() - dayInMS * agreement_1.access_valid_for_days
        ).toISOString(),
      },
    ],
  };

  const requisitions: NordginenApiTypes.IRequisitions = {
    results: [
      {
        ...requisition_1,
        institution_id: provider.id,
      },
    ],
  };

  const received = findProviderRequisition({
    providerID: provider.id,
    agreements,
    requisitions,
  });

  expect(received).toBeUndefined();
});

it("Succeeds finding existing provider requisition: Finds valid, completed requisition", () => {
  const provider = new NordigenProvider({ id: providerID });

  const agreements: NordginenApiTypes.IAgreements = {
    results: [
      {
        ...agreement_1,
        institution_id: provider.id,
      },
      {
        ...agreement_1,
        id: "a2",
        institution_id: provider.id,
      },
    ],
  };

  const requisitions: NordginenApiTypes.IRequisitions = {
    results: [
      {
        ...requisition_1,
        institution_id: provider.id,
        status: "CR",
      },
      {
        ...requisition_1,
        id: "r1",
        agreement: "a2",
        institution_id: provider.id,
        status: "LN",
      },
    ],
  };

  const received = findProviderRequisition({
    providerID: provider.id,
    agreements,
    requisitions,
  });
  const expected = requisitions.results[1];

  expect(received).toEqual(expected);
});

it("Succeeds finding existing provider requisition: Finds valid, incompleted requisition", () => {
  const provider = new NordigenProvider({ id: providerID });

  const agreements: NordginenApiTypes.IAgreements = {
    results: [
      {
        ...agreement_1,
        institution_id: provider.id,
      },
      {
        ...agreement_1,
        id: "a2",
        institution_id: provider.id,
      },
    ],
  };

  const requisitions: NordginenApiTypes.IRequisitions = {
    results: [
      {
        ...requisition_1,
        institution_id: provider.id,
        status: "CR",
        created: new Date().toISOString(),
      },
      {
        ...requisition_1,
        id: "r1",
        agreement: "a2",
        institution_id: provider.id,
        status: "CR",
        created: new Date(new Date().getTime() - 100000).toISOString(),
      },
    ],
  };

  const received = findProviderRequisition({
    providerID: provider.id,
    agreements,
    requisitions,
  });
  const expected = requisitions.results[0];

  expect(received).toEqual(expected);
});

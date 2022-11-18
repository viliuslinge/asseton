import { DatabaseTypes } from "database";
import { ServerApiError } from "src/errors";
import { IProviderAuthentication } from "providers/Provider";
import { NordigenProvider } from "src/providers/Nordigen/NordigenProvider";
import { AccountApi } from "src/providers/Nordigen/NordigenApi";

import { agreement_1, requisition_1, balances_1 } from "./mocks";

const providerID = "nordigen";

/**
 * Tests:
 *
 * Database:
 * 1. Gets empty provider data
 * 2. Gets existing provider data
 * 3. Sets provider data
 * 4. Data requires refresh
 * 5. Data doesnt require refresh
 *
 * Api:
 *
 * /data GET
 * 1. Fails getting data of not existing provider
 * 2. Fails getting data of existing provider if authentication doesnt exist
 * 3. Succeeds getting data of existing provider if authentication exists
 * 4. Succeeds getting cached data of existing provider if authentication exists
 * 5. Succeeds getting refreshed data of existing provider if authentication exists
 *
 * /authentication POST
 * 1. Fails authentication of not existing provider
 * 2. Fails authentication if completed and valid authentication exists
 * 3. Succeeds initiating authenticating for the first time
 * 4. Succedds initiating authentication if incompleted authentication exists. Returns existing authentication
 *
 * /authentication DELETE
 * 1. Fails deleting authentication of not existing provider
 * 2. Fails deleting authentication of authentication doesnt exist
 * 3. Succeeds deleting authentication if authentication exists
 */

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

//TODO: test getExistingRequisition method !!!

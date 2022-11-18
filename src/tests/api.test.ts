import request from "supertest";

import { router } from "src/router";
import { ServerApiError } from "src/errors";
import {
  DATA_SNAPSHOT_REFRESH_INTERVAL,
  TEST_PROVIDER_ID,
  API_VERSION,
} from "src/config";
import { NordginenApiTypes, nordigenApi } from "providers/Nordigen/NordigenApi";
import { db, DatabaseTypes } from "database";

import { database, nordigen } from "./mocks";

it("Fails getting data of not existing provider", async () => {
  const providerID = "doesnt-exist";
  const error = ServerApiError.ProviderNotFound();
  const received = await request(router).get(
    `/api/${API_VERSION}/providers/${providerID}/snapshot`
  );

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);
});

it("Fails getting data of existing provider if authentication doesnt exist", async () => {
  const providerID = TEST_PROVIDER_ID;
  const error = ServerApiError.AuthenticationRequired();
  const received = await request(router).get(
    `/api/${API_VERSION}/providers/${providerID}/snapshot`
  );

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);
});

it("Succeeds getting data of existing provider if authentication exists", async () => {
  const providerID = TEST_PROVIDER_ID;

  const getAgreementsSpy = jest
    .spyOn(nordigenApi.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.agreement_1,
          institution_id: TEST_PROVIDER_ID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(nordigenApi.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.requisition_1,
          institution_id: TEST_PROVIDER_ID,
          status: "LN",
        },
      ],
    });

  const received = await request(router).get(
    `/api/${API_VERSION}/providers/${providerID}/snapshot`
  );

  const expected = {
    id: database.data_snapshot_1.id,
    accounts: database.data_snapshot_1.accounts,
  };

  expect(received.body).toEqual(expect.objectContaining(expected));

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Succeeds getting cached data of existing provider if authentication exists", async () => {
  const providerID = TEST_PROVIDER_ID;

  const getAgreementsSpy = jest
    .spyOn(nordigenApi.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.agreement_1,
          institution_id: TEST_PROVIDER_ID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(nordigenApi.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.requisition_1,
          institution_id: TEST_PROVIDER_ID,
          status: "LN",
        },
      ],
    });

  const expected: DatabaseTypes.IProviderData = {
    id: TEST_PROVIDER_ID,
    createdAt: new Date().toISOString(),
    accounts: [
      {
        assets: [
          {
            symbol: "EUR",
            amount: 10,
          },
        ],
      },
    ],
  };

  const getProviderDataSnapshotSpy = jest
    .spyOn(db, "getProviderDataSnapshot")
    .mockResolvedValue(expected);

  const received = await request(router).get(
    `/api/${API_VERSION}/providers/${providerID}/snapshot`
  );

  expect(received.body).toEqual(expect.objectContaining(expected));

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
  getProviderDataSnapshotSpy.mockRestore();
});

it("Succeeds getting refreshed data of existing provider if authentication exists", async () => {
  const providerID = TEST_PROVIDER_ID;

  const getAgreementsSpy = jest
    .spyOn(nordigenApi.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.agreement_1,
          institution_id: TEST_PROVIDER_ID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(nordigenApi.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.requisition_1,
          institution_id: TEST_PROVIDER_ID,
          status: "LN",
        },
      ],
    });

  const outdatedSnapshot: DatabaseTypes.IProviderData = {
    id: TEST_PROVIDER_ID,
    createdAt: new Date(
      new Date().getTime() - DATA_SNAPSHOT_REFRESH_INTERVAL * 2
    ).toISOString(),
    accounts: [
      {
        assets: [
          {
            symbol: "EUR",
            amount: 10,
          },
        ],
      },
    ],
  };

  const getProviderDataSnapshotSpy = jest
    .spyOn(db, "getProviderDataSnapshot")
    .mockResolvedValue(outdatedSnapshot);

  const received = await request(router).get(
    `/api/${API_VERSION}/providers/${providerID}/snapshot`
  );

  expect(received.body).toEqual(
    expect.objectContaining({
      id: database.data_snapshot_1.id,
      accounts: database.data_snapshot_1.accounts,
    })
  );

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
  getProviderDataSnapshotSpy.mockRestore();
});

it("Fails authentication of not existing provider", async () => {
  const providerID = "doesnt-exist";
  const error = ServerApiError.ProviderNotFound();
  const received = await request(router)
    .post(`/api/${API_VERSION}/providers/${providerID}/authentication`)
    .send({
      redirectUrl: "https://google.com",
    });

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);
});

it("Fails authentication if completed and valid authentication exists", async () => {
  const providerID = TEST_PROVIDER_ID;
  const error = ServerApiError.AuthenticationExists();

  const getAgreementsSpy = jest
    .spyOn(nordigenApi.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.agreement_1,
          institution_id: TEST_PROVIDER_ID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(nordigenApi.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.requisition_1,
          institution_id: TEST_PROVIDER_ID,
          status: "LN",
        },
      ],
    });

  const received = await request(router)
    .post(`/api/${API_VERSION}/providers/${providerID}/authentication`)
    .send({
      redirectUrl: "https://google.com",
    });

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Succeeds initiating authentication for the first time", async () => {
  const providerID = TEST_PROVIDER_ID;
  const received = await request(router)
    .post(`/api/${API_VERSION}/providers/${providerID}/authentication`)
    .send({
      redirectUrl: "https://google.com",
    });

  expect(received.body).toEqual({
    authenticationUrl: nordigen.requisition_1.link,
  });
});

it("Succeeds initiating authentication if incompleted authentication exists. Returns existing authentication", async () => {
  const providerID = TEST_PROVIDER_ID;

  const getAgreementsSpy = jest
    .spyOn(nordigenApi.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.agreement_1,
          institution_id: TEST_PROVIDER_ID,
        },
      ],
    });

  const expected: NordginenApiTypes.IRequisition = {
    ...nordigen.requisition_1,
    institution_id: TEST_PROVIDER_ID,
    status: "CR",
    link: "https://new-link.com",
  };

  const getRequisitionsSpy = jest
    .spyOn(nordigenApi.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [expected],
    });

  const received = await request(router)
    .post(`/api/${API_VERSION}/providers/${providerID}/authentication`)
    .send({
      redirectUrl: "https://google.com",
    });

  expect(received.body).toEqual({
    authenticationUrl: expected.link,
  });

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

it("Fails deleting authentication of not existing provider", async () => {
  const providerID = "doesnt-exist";
  const error = ServerApiError.ProviderNotFound();
  const received = await request(router).delete(
    `/api/${API_VERSION}/providers/${providerID}/authentication`
  );

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);
});

it("Succeeds deleting authentication if authentication exists", async () => {
  const providerID = TEST_PROVIDER_ID;

  const getAgreementsSpy = jest
    .spyOn(nordigenApi.agreement, "getAgreements")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.agreement_1,
          institution_id: TEST_PROVIDER_ID,
        },
      ],
    });

  const getRequisitionsSpy = jest
    .spyOn(nordigenApi.requisition, "getRequisitions")
    .mockResolvedValue({
      results: [
        {
          ...nordigen.requisition_1,
          institution_id: TEST_PROVIDER_ID,
          status: "LN",
        },
      ],
    });

  const received = await request(router).delete(
    `/api/${API_VERSION}/providers/${providerID}/authentication`
  );

  expect(received.body).toEqual(true);

  getAgreementsSpy.mockRestore();
  getRequisitionsSpy.mockRestore();
});

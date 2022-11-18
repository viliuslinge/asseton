import request from "supertest";

import { api } from "src/api";
import { ServerApiError } from "src/errors";
import { TEST_PROVIDER_ID } from "src/config";

import { database } from "./mocks";

it("Fails getting data of not existing provider", async () => {
  const providerID = "doesnt-exist";
  const error = ServerApiError.ProviderNotFound();
  const received = await request(api).get(
    `/providers/${providerID}/dataSnapshot`
  );

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);
});

it("Fails getting data of existing provider if authentication doesnt exist", async () => {
  const providerID = TEST_PROVIDER_ID;
  const error = ServerApiError.AuthenticationRequired();
  const received = await request(api).get(
    `/providers/${providerID}/dataSnapshot`
  );

  expect(received.statusCode).toEqual(error.statusCode);
  expect(received.body.code).toEqual(error.code);
});

// jest.mock("../providers/Nordigen/NordigenApi", () => {
//   return {
//     NordigenApi: (
//       jest.fn() as jest.Mock<IDeepPartial<NordigenApi>>
//     ).mockImplementation(() => {
//       return {
//         generateToken: () => new Promise((res) => res({})),
//         agreement: {
//           getAgreements: (): Promise<NordginenApiTypes.IAgreements> => {
//             return new Promise((res) => {
//               return res({
//                 results: [
//                   {
//                     ...nordigen.agreement_1,
//                     institution_id: TEST_PROVIDER_ID,
//                   },
//                 ],
//               });
//             });
//           },
//         },
//         requisition: {
//           getRequisitions: (): Promise<NordginenApiTypes.IRequisitions> => {
//             return new Promise((res) => {
//               return res({
//                 results: [
//                   {
//                     ...nordigen.requisition_1,
//                     institution_id: TEST_PROVIDER_ID,
//                     status: "LN",
//                   },
//                 ],
//               });
//             });
//           },
//         },
//         account: (): Partial<AccountApi> => {
//           return {
//             getBalances: (): Promise<NordginenApiTypes.IBalances> => {
//               return new Promise((res) => {
//                 return res(nordigen.balances_1);
//               });
//             },
//           };
//         },
//       };
//     }),
//   };
// });

it("Succeeds getting data of existing provider if authentication exists", async () => {
  const providerID = TEST_PROVIDER_ID;

  const receiveid = await request(api).get(
    `/providers/${providerID}/dataSnapshot`
  );
  const expected = database.data_snapshot_1;

  expect(receiveid.body).toEqual(expected);
});

// it("Succeeds getting cached data of existing provider if authentication exists", async () => {});

// it("Succeeds getting refreshed data of existing provider if authentication exists", async () => {});

// it("Fails authentication of not existing provider", async () => {});

// it("Fails authentication if completed and valid authentication exists", async () => {});

// it("Succeeds initiating authenticating for the first time", async () => {});

// it("Succeds initiating authentication if incompleted authentication exists. Returns existing authentication", async () => {});

// it("Fails deleting authentication of not existing provider", async () => {});

// it("Fails deleting authentication of authentication doesnt exist", async () => {});

// it("Succeeds deleting authentication if authentication exists", async () => {});

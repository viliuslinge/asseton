import { NordigenProvider } from "./NordigenProvider";

test("lol", async () => {
  const provider = new NordigenProvider({ id: "test-provider" });

  // (provider.client.generateToken as jest.Mock)
  //   .mockResolvedValue(undefined)
  (provider.client.getAgreements as jest.Mock).mockResolvedValue({
    results: [
      {
        id: "agreement-1",
        created: "date",
        max_historical_days: 10,
        access_valid_for_days: 1,
        access_scope: [],
        institution_id: "test-provider",
      },
    ],
  });

  const result = provider.client.getAgreements();

  console.log(result);
});

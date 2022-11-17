import { NordigenProvider } from "./NordigenProvider";

test("lol", async () => {
  const provider = new NordigenProvider({ id: "test-provider" });

  const spy = jest
    .spyOn(provider.client.client.agreement, "getAgreements")
    .mockResolvedValue({
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

  const result = await provider.client.getAgreements();
  console.log(result);

  spy.mockRestore();

  const result2 = await provider.client.getAgreements();

  console.log(result2);
});

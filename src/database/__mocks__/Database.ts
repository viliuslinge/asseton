import { Database as DatabaseRaw } from "../Database";

export const Database = (
  jest.fn() as jest.Mock<Partial<DatabaseRaw>>
).mockImplementation(() => {
  return {
    getProviderDataSnapshot: () => {
      return new Promise((res) => {
        return res(null);
      });
    },
    setProviderDataSnapshot: () => {
      return new Promise((res) => {
        return res();
      });
    },
  };
});

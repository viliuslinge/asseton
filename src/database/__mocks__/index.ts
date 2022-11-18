import { Database } from "../Database";

export const db: jest.Mocked<Partial<Database>> = {
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

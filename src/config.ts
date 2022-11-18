import dotenv from "dotenv";

dotenv.config();

// Database
export const DATA_SNAPSHOT_REFRESH_INTERVAL: number = 1000 * 60 * 60 * 24;

// API
export const API_PORT = process.env.HTTP_PORT || "3001";
export const API_VERSION = "v1";
export const API_ROUTES = {
  PROVIDER_SNAPSHOT: `/api/${API_VERSION}/providers/:providerID/snapshot`,
  PROVIDER_AUTHENTICATION: `/api/${API_VERSION}/providers/:providerID/authentication`,
};

// Providers
export const TEST_PROVIDER_ID = "REVOLUT_REVOGB21";

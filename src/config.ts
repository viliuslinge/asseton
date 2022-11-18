import dotenv from "dotenv";

dotenv.config();

// Database
export const DATA_SNAPSHOT_REFRESH_INTERVAL: number = 1000 * 60 * 60 * 24;

// API
export const API_PORT: string = process.env.HTTP_PORT || "3001";
export enum API_ROUTES {
  PROVIDER_DATA_SNAPSHOT = "/providers/:providerID/dataSnapshot",
  PROVIDER_AUTHENTICATION = "/providers/:providerID/authentication",
}

// Providers
export const TEST_PROVIDER_ID = "REVOLUT_REVOGB21";

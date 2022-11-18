import * as dotenv from "dotenv";
import NordigenApiRaw from "nordigen-node";

export { AccountApi } from "nordigen-node/types/api";
export { NordginenApiTypes } from "./types";
export type { nordigenApi as INordigenApi };

dotenv.config();

const secretId = process.env.NORDIGEN_API_ID ?? "";
const secretKey = process.env.NORDIGEN_API_KEY ?? "";

export const nordigenApi = new NordigenApiRaw({ secretId, secretKey });

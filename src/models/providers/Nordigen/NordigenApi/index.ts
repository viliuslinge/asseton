import * as dotenv from "dotenv";
import NordigenApiRaw from "nordigen-node";

export { NordginenApiTypes } from "./types";
export type { nordigenApi as INordigenApi };
export type AccountApi = ReturnType<NordigenApiRaw["account"]>;

dotenv.config();

const secretId = process.env.NORDIGEN_API_ID ?? "";
const secretKey = process.env.NORDIGEN_API_KEY ?? "";

export const nordigenApi = new NordigenApiRaw({ secretId, secretKey });

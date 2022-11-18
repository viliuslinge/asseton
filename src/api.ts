import express, { Response } from "express";
import bodyParser from "body-parser";

import { providerFactory, AuthenticatedProvider } from "providers";
import { db, DatabaseTypes } from "database";
import { isDataSnapshotRefreshRequired } from "database/utils";

import { ServerApiError } from "./errors";
import { API_ROUTES } from "./config";

export const api = express();

api.use(bodyParser.json());

api.get<{ providerID: string }, DatabaseTypes.IProviderData | Error>(
  API_ROUTES.PROVIDER_SNAPSHOT,
  async (req, res) => {
    try {
      const { providerID } = req.params;
      const provider = providerFactory.createProvider({ id: providerID });

      let data = await db.getProviderDataSnapshot(provider.id);
      if (data && !isDataSnapshotRefreshRequired(data.createdAt)) {
        res.send(data);
        return;
      }

      data = await provider.getDataSnapshot();
      db.setProviderDataSnapshot(data);
      res.send(data);
    } catch (err) {
      sendError(res, err as Error);
    }
  }
);

api.post<
  { providerID: string },
  { authenticationUrl: string } | Error,
  { redirectUrl: string }
>(API_ROUTES.PROVIDER_AUTHENTICATION, async (req, res) => {
  try {
    const { providerID } = req.params;
    const { redirectUrl } = req.body;

    const provider = providerFactory.createProvider({ id: providerID });
    if (!(provider instanceof AuthenticatedProvider)) {
      throw ServerApiError.AuthenticationNotRequired();
    }

    const auth = await provider.createAuthentication({ redirectUrl });
    res.send({ authenticationUrl: auth.authenticationUrl });
  } catch (err) {
    sendError(res, err as Error);
  }
});

api.delete<{ providerID: string }, true | Error>(
  API_ROUTES.PROVIDER_AUTHENTICATION,
  async (req, res) => {
    try {
      const { providerID } = req.params;

      const provider = providerFactory.createProvider({ id: providerID });
      if (!(provider instanceof AuthenticatedProvider)) {
        throw ServerApiError.AuthenticationNotRequired();
      }

      await provider.deleteAuthentication();
      res.send(true);
    } catch (err) {
      sendError(res, err as Error);
    }
  }
);

function sendError(res: Response, err: Error) {
  if (err instanceof ServerApiError) {
    return res.status(err.statusCode).send(err);
  }

  //TODO: find correct status code
  return res.status(400).send(err);
}

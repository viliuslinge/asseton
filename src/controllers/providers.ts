import { Response, RequestHandler } from "express";
import { providerFactory, AuthenticatedProvider } from "models/providers";
import { db, DatabaseTypes } from "database";
import { isDataSnapshotRefreshRequired } from "database/utils";

import { ServerApiError } from "src/errors";

export const getSnapshot: RequestHandler<
  { providerID: string },
  DatabaseTypes.IProviderData | Error
> = async (req, res) => {
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
};

export const testGetSnapshot: RequestHandler<
  { providerID: string },
  DatabaseTypes.IProviderData | Error
> = async (req, res) => {
  const { providerID } = req.params;
  const data: DatabaseTypes.IProviderData = {
    id: providerID,
    createdAt: new Date().toISOString(),
    accounts: [
      {
        assets: [
          {
            symbol: "EUR",
            amount: 1000,
          },
          {
            symbol: "USD",
            amount: 50000,
          },
        ],
      },
      {
        assets: [
          {
            symbol: "EUR",
            amount: 3,
          },
        ],
      },
    ],
  };

  res.send(data);
};

export const postAuthenticaton: RequestHandler<
  { providerID: string },
  { authenticationUrl: string } | Error,
  { redirectUrl: string }
> = async (req, res) => {
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
};

export const testPostAuthentication: RequestHandler<
  { providerID: string },
  { authenticationUrl: string } | Error,
  { redirectUrl: string }
> = async (_, res) => {
  res.send({ authenticationUrl: "https://testapiauthenticationurl.com" });
};

export const deleteAuthenticaton: RequestHandler<
  { providerID: string },
  true | Error
> = async (req, res) => {
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
};

export const testDeleteAuthentication: RequestHandler<
  { providerID: string },
  true | Error
> = async (_, res) => {
  res.send(true);
};

function sendError(res: Response, err: Error) {
  if (err instanceof ServerApiError) {
    return res.status(err.statusCode).send(err);
  }

  //TODO: find correct status code
  return res.status(400).send(err);
}

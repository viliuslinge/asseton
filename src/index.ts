import express from "express";
import bodyParser from "body-parser";

import { providerFactory, AuthenticatedProvider } from "providers";
import { Database, DatabaseTypes } from "database";
import { ServerApiError } from "./errors";

const port: string = process.env.HTTP_PORT || "3001";
const app = express();

app.use(bodyParser.json());

enum ENDPOINTS {
  PROVIDER_DATA_SNAPSHOT = "/providers/:providerID/dataSnapshot",
  PROVIDER_AUTHENTICATION = "/providers/:providerID/authentication",
}

const db = new Database();

app.get<{ providerID: string }, DatabaseTypes.IProviderData | Error>(
  ENDPOINTS.PROVIDER_DATA_SNAPSHOT,
  async (req, res) => {
    try {
      const { providerID } = req.params;
      const provider = providerFactory.createProvider({ id: providerID });

      let data = await db.getProviderDataSnapshot(provider.id);
      if (data && !db.isDataSnapshotRefreshRequired(data.createdAt)) {
        res.send(data);
        return;
      }

      data = await provider.getDataSnapshot();
      db.setProviderDataSnapshot(data);
      res.send(data);
    } catch (err) {
      if (err instanceof ServerApiError) {
        return res.status(err.statusCode).send(err);
      }

      //TODO: find correct status code
      return res.status(400).send(err);
    }
  }
);

app.post<
  { providerID: string },
  { authenticationUrl: string } | Error,
  { redirectUrl: string }
>(ENDPOINTS.PROVIDER_AUTHENTICATION, async (req, res) => {
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
    if (err instanceof ServerApiError) {
      return res.status(err.statusCode).send(err);
    }

    //TODO: find correct status code
    return res.status(400).send(err);
  }
});

app.delete<{ providerID: string }, true | Error>(
  ENDPOINTS.PROVIDER_AUTHENTICATION,
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
      if (err instanceof ServerApiError) {
        return res.status(err.statusCode).send(err);
      }

      //TODO: find correct status code
      return res.status(400).send(err);
    }
  }
);

app.listen(port, () => {
  console.log(`[HTTP_SERVER] listening on port ${port}`);
});

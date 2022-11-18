import express from "express";
import bodyParser from "body-parser";

import * as providerControllers from "controllers/providers";

import { API_ROUTES, API_TEST_ROUTES } from "./config";

export const router = express();

router.use(bodyParser.json());

// ROUTES

router.get(API_ROUTES.PROVIDER_SNAPSHOT, providerControllers.getSnapshot);

router.post(
  API_ROUTES.PROVIDER_AUTHENTICATION,
  providerControllers.postAuthenticaton
);

router.delete(
  API_ROUTES.PROVIDER_AUTHENTICATION,
  providerControllers.deleteAuthenticaton
);

// TEST ROUTES

router.get(
  API_TEST_ROUTES.PROVIDER_SNAPSHOT,
  providerControllers.testGetSnapshot
);

router.post(
  API_TEST_ROUTES.PROVIDER_AUTHENTICATION,
  providerControllers.testPostAuthentication
);

router.delete(
  API_TEST_ROUTES.PROVIDER_AUTHENTICATION,
  providerControllers.testDeleteAuthentication
);

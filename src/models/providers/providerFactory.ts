import { ServerApiError } from "src/errors";

import { IProvider, IProviderInput } from "./Provider";
// import { BitfinexProvider } from "./Bitfinex";
// import { KrakenProvider } from "./Kraken";
import { NordigenProvider } from "./Nordigen";

export const providerFactory = {
  createProvider: (input: IProviderInput): IProvider => {
    switch (input.id) {
      // case "BITFINEX": {
      //   return new BitfinexProvider(input);
      // }
      // case "KRAKEN": {
      //   return new KrakenProvider(input);
      // }
      case "PAYPAL_PPLXLULL":
      case "REVOLUT_REVOGB21":
      case "SEB_CBVILT2X":
      case "SWEDBANK_HABALT22": {
        return new NordigenProvider(input);
      }
      default: {
        throw ServerApiError.ProviderNotFound();
      }
    }
  },
};

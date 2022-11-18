export namespace NordginenApiTypes {
  export interface IMetadata {
    id: string;
    created: string;
    last_accessed: string;
    iban: string;
    institution_id: string;
    status: string;
  }

  export interface IBalances {
    balances: Array<{
      balanceAmount: {
        amount: string;
        currency: string;
      };
      balanceType: string;
      referenceDate: string;
    }>;
  }

  export interface IDetails {
    account: {
      resourceId: string;
      iban: string;
      currency: string;
      ownerName: string;
      name: string;
      product: string;
      cashAccountType: string;
    };
  }

  export interface ITransactions {
    transactions: {
      booked: Array<{
        transactionId: string;
        transactionAmount: {
          amount: string;
          currency: string;
        };
        debtorName: string;
        debtorAccount: {
          iban: string;
        };
        bookingDate: string;
        bookingDateTime: string;
        proprietaryBankTransactionCode: string;
        remittanceInformationUnstructuredArray: Array<string>;
        valueDate: string;
        valueDateTime: string;
      }>;
      pending: Array<{
        transactionAmount: {
          currency: string;
          amount: string;
        };
        valueDate: string;
        remittanceInformationUnstructured: string;
      }>;
    };
  }

  export interface IRequisitions {
    results: Array<IRequisition>;
  }

  export interface IRequisition {
    id: string;
    created: string;
    redirect: string;
    status: "CR" | "LN";
    institution_id: string;
    agreement: string;
    reference: string;
    accounts: Array<string>;
    link: string;
    ssn: string | null;
    account_selection: boolean;
    redirect_immediate: boolean;
  }

  export interface IDeleteRequisitionOutput {
    message: string;
  }

  export interface IAgreements {
    results: Array<IAgreement>;
  }

  export interface IAgreement {
    id: string;
    created: string;
    max_historical_days: number;
    access_valid_for_days: number;
    access_scope: Array<string>;
    institution_id: string;
  }

  export interface IError {
    summary: string;
    detail: string;
    status_code: number;
  }
}

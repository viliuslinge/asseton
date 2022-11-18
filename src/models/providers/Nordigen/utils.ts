import { NordginenApiTypes } from "./NordigenApi";

export function findProviderRequisition(input: {
  providerID: string;
  agreements: NordginenApiTypes.IAgreements;
  requisitions: NordginenApiTypes.IRequisitions;
}): NordginenApiTypes.IRequisition | undefined {
  const { agreements, requisitions, providerID } = input;

  const providerAgreements: NordginenApiTypes.IAgreement[] =
    agreements.results.filter((it) => it.institution_id === providerID);

  const providerRequisitions: NordginenApiTypes.IRequisition[] =
    requisitions.results
      .filter((it) => it.institution_id === providerID)
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );

  const validProviderRequisitions: NordginenApiTypes.IRequisition[] =
    providerRequisitions.filter((it) => {
      const agreement = providerAgreements.find(
        (agr) => agr.id === it.agreement
      );

      if (!agreement) {
        return false;
      }

      if (!isAgreementValid(agreement)) {
        return false;
      }

      return true;
    });

  const requisition =
    validProviderRequisitions.find((it) => it.status === "LN") ??
    validProviderRequisitions.find((it) => it.status === "CR");

  return requisition;
}

function isAgreementValid(agreement: NordginenApiTypes.IAgreement): boolean {
  const timeNow = new Date().getTime();
  const validUntil =
    new Date(agreement.created).getTime() +
    agreement.access_valid_for_days * 24 * 60 * 60 * 1000;

  return validUntil > timeNow;
}

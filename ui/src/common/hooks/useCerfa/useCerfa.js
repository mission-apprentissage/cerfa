import { _get, _put } from "../../httpClient";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { dossierAtom } from "../useDossier/dossierAtom";
import { cerfaAtom } from "./cerfaAtom";
import { CerfaFormationController, cerfaFormationCompletion } from "./parts/useCerfaFormation";
import { CerfaEmployeurController, cerfaEmployeurCompletion } from "./parts/useCerfaEmployeur";
import { CerfaApprentiController, cerfaApprentiCompletion } from "./parts/useCerfaApprenti";
import { CerfaMaitresController, cerfaMaitresCompletion } from "./parts/useCerfaMaitres";
import { CerfaContratController, cerfaContratCompletion } from "./parts/useCerfaContrat";

import { cerfaPartFormationCompletionAtom } from "./parts/useCerfaFormationAtoms";
import { cerfaPartEmployeurCompletionAtom } from "./parts/useCerfaEmployeurAtoms";
import { cerfaPartApprentiCompletionAtom } from "./parts/useCerfaApprentiAtoms";
import { cerfaPartMaitresCompletionAtom } from "./parts/useCerfaMaitresAtoms";
import { cerfaPartContratCompletionAtom } from "./parts/useCerfaContratAtoms";

import { useDocuments } from "../useDossier/useDocuments";
import { useSignatures } from "../useDossier/useSignatures";

const hydrate = async (dossier) => {
  try {
    const cerfa = await _get(`/api/v1/cerfa?dossierId=${dossier._id}`);

    const cerfaFormationController = await CerfaFormationController(dossier);
    const cerfaEmployeurController = await CerfaEmployeurController(dossier);
    const cerfaApprentiController = await CerfaApprentiController(dossier);
    const cerfaMaitresController = await CerfaMaitresController(dossier);
    const cerfaContratController = await CerfaContratController(dossier);

    return {
      ...cerfa,
      employeur: {
        ...cerfa.employeur,
        siret: {
          ...cerfa.employeur.siret,
          ...cerfaEmployeurController.employeur.siret,
        },
        naf: {
          ...cerfa.employeur.naf,
          ...cerfaEmployeurController.employeur.naf,
        },
        codeIdcc: {
          ...cerfa.employeur.codeIdcc,
          ...cerfaEmployeurController.employeur.codeIdcc,
        },
        nombreDeSalaries: {
          ...cerfa.employeur.nombreDeSalaries,
          ...cerfaEmployeurController.employeur.nombreDeSalaries,
        },
        adresse: {
          ...cerfa.employeur.adresse,
          ...cerfaEmployeurController.employeur.adresse,
          codePostal: {
            ...cerfa.employeur.adresse.codePostal,
            ...cerfaEmployeurController.employeur.adresse.codePostal,
          },
          departement: {
            ...cerfa.employeur.adresse.departement,
            ...cerfaEmployeurController.employeur.adresse.departement,
          },
        },
      },
      apprenti: {
        ...cerfa.apprenti,
        ...cerfaApprentiController.apprenti,
        dateNaissance: {
          ...cerfa.apprenti.dateNaissance,
          ...cerfaApprentiController.apprenti.dateNaissance,
        },
        adresse: {
          ...cerfa.apprenti.adresse,
          ...cerfaApprentiController.apprenti.adresse,
          codePostal: {
            ...cerfa.apprenti.adresse.codePostal,
            ...cerfaApprentiController.apprenti.adresse.codePostal,
          },
        },
        responsableLegal: {
          ...cerfa.apprenti.responsableLegal,
          ...cerfaApprentiController.apprenti.responsableLegal,
          adresse: {
            ...cerfa.apprenti.responsableLegal.adresse,
            ...cerfaApprentiController.apprenti.responsableLegal.adresse,
            codePostal: {
              ...cerfa.apprenti.responsableLegal.adresse.codePostal,
              ...cerfaApprentiController.apprenti.responsableLegal.adresse.codePostal,
            },
          },
        },
      },
      maitre1: {
        ...cerfa.maitre1,
        ...cerfaMaitresController.maitre1,
        dateNaissance: {
          ...cerfa.maitre1.dateNaissance,
          ...cerfaMaitresController.maitre1.dateNaissance,
        },
      },
      maitre2: {
        ...cerfa.maitre2,
        ...cerfaMaitresController.maitre2,
        dateNaissance: {
          ...cerfa.maitre2.dateNaissance,
          ...cerfaMaitresController.maitre2.dateNaissance,
        },
      },
      contrat: {
        ...cerfa.contrat,
        ...cerfaContratController.contrat,
        dateDebutContrat: {
          ...cerfa.contrat.dateDebutContrat,
          ...cerfaContratController.contrat.dateDebutContrat,
        },
        dateFinContrat: {
          ...cerfa.contrat.dateFinContrat,
          ...cerfaContratController.contrat.dateFinContrat,
        },
        dateEffetAvenant: {
          ...cerfa.contrat.dateEffetAvenant,
          ...cerfaContratController.contrat.dateEffetAvenant,
        },
        typeDerogation: {
          ...cerfa.contrat.typeDerogation,
          ...cerfaContratController.contrat.typeDerogation,
        },
        dureeTravailHebdoHeures: {
          ...cerfa.contrat.dureeTravailHebdoHeures,
          ...cerfaContratController.contrat.dureeTravailHebdoHeures,
        },
        dureeTravailHebdoMinutes: {
          ...cerfa.contrat.dureeTravailHebdoMinutes,
          ...cerfaContratController.contrat.dureeTravailHebdoMinutes,
        },
      },
      formation: {
        ...cerfa.formation,
        rncp: {
          ...cerfa.formation.rncp,
          ...cerfaFormationController.formation.rncp,
        },
        codeDiplome: {
          ...cerfa.formation.codeDiplome,
          ...cerfaFormationController.formation.codeDiplome,
        },
        dateDebutFormation: {
          ...cerfa.formation.dateDebutFormation,
          ...cerfaFormationController.formation.dateDebutFormation,
        },
        dateFinFormation: {
          ...cerfa.formation.dateFinFormation,
          ...cerfaFormationController.formation.dateFinFormation,
        },
        dureeFormation: {
          ...cerfa.formation.dureeFormation,
          ...cerfaFormationController.formation.dureeFormation,
        },
      },
      organismeFormation: {
        ...cerfa.organismeFormation,
        siret: {
          ...cerfa.organismeFormation.siret,
          ...cerfaFormationController.organismeFormation.siret,
        },
        adresse: {
          ...cerfa.organismeFormation.adresse,
          ...cerfaFormationController.organismeFormation.adresse,
          codePostal: {
            ...cerfa.organismeFormation.adresse.codePostal,
            ...cerfaFormationController.organismeFormation.adresse.codePostal,
          },
        },
      },
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const saveCerfa = async (dossierId, cerfaId, data) => {
  try {
    const result = await _put(`/api/v1/cerfa/${cerfaId}`, {
      ...data,
      dossierId,
    });
    return result;
  } catch (e) {
    console.log(e);
  }
};

export function useCerfa() {
  const dossier = useRecoilValue(dossierAtom);
  const [cerfa, setCerfa] = useRecoilState(cerfaAtom);

  const setPartFormationCompletionAtom = useSetRecoilState(cerfaPartFormationCompletionAtom);
  const setPartEmployeurCompletionAtom = useSetRecoilState(cerfaPartEmployeurCompletionAtom);
  const setPartApprentiCompletion = useSetRecoilState(cerfaPartApprentiCompletionAtom);
  const setPartMaitresCompletion = useSetRecoilState(cerfaPartMaitresCompletionAtom);
  const setPartContratCompletion = useSetRecoilState(cerfaPartContratCompletionAtom);

  const { reset: resetDocuments } = useDocuments();
  const { reset: resetSignatures } = useSignatures();

  const shouldBeReset = cerfa?.id !== dossier?.cerfaId;

  // eslint-disable-next-line no-unused-vars
  const { data, isLoading, isFetching } = useQuery(
    "cerfa",
    async () => {
      const res = await hydrate(dossier);
      setCerfa(res);

      setPartFormationCompletionAtom(cerfaFormationCompletion(res));
      setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
      setPartApprentiCompletion(cerfaApprentiCompletion(res));
      setPartMaitresCompletion(cerfaMaitresCompletion(res));
      setPartContratCompletion(cerfaContratCompletion(res));

      if (shouldBeReset) {
        resetDocuments();
        resetSignatures();
      }

      return Promise.resolve(res);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: shouldBeReset,
    }
  );

  return {
    isLoading,
    isFetching,
    cerfa,
  };
}

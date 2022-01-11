import { _get, _put } from "../../httpClient";
import { useRecoilState, useRecoilValue } from "recoil";
import { useQuery } from "react-query";
import { dossierAtom } from "../useDossier/dossierAtom";
import { cerfaAtom } from "./cerfaAtom";
import { CerfaFormationController, useCerfaFormation } from "./parts/useCerfaFormation";
import { CerfaEmployeurController, useCerfaEmployeur } from "./parts/useCerfaEmployeur";
import { CerfaApprentiController, useCerfaApprenti } from "./parts/useCerfaApprenti";
import { CerfaMaitresController, useCerfaMaitres } from "./parts/useCerfaMaitres";
import { CerfaContratController, useCerfaContrat } from "./parts/useCerfaContrat";

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
      },
      apprenti: {
        ...cerfa.apprenti,
        ...cerfaApprentiController.apprenti,
        dateNaissance: {
          ...cerfa.apprenti.dateNaissance,
          ...cerfaApprentiController.apprenti.dateNaissance,
        },
      },
      maitre1: {
        ...cerfa.maitre1,
        ...cerfaMaitresController.maitre1,
      },
      maitre2: {
        ...cerfa.maitre2,
        ...cerfaMaitresController.maitre2,
      },
      contrat: {
        ...cerfa.contrat,
        ...cerfaContratController.contrat,
        dateDebutContrat: {
          ...cerfa.contrat.dateDebutContrat,
          ...cerfaContratController.contrat.dateDebutContrat,
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
      },
      organismeFormation: {
        ...cerfa.organismeFormation,
        siret: {
          ...cerfa.organismeFormation.siret,
          ...cerfaFormationController.organismeFormation.siret,
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
  const { setAll: setCerfaFormation } = useCerfaFormation();
  const { setAll: setCerfaEmployeur } = useCerfaEmployeur();
  const { setAll: setCerfaApprenti } = useCerfaApprenti();
  const { setAll: setCerfaMaitres } = useCerfaMaitres();
  const { setAll: setCerfaContrat } = useCerfaContrat();

  // eslint-disable-next-line no-unused-vars
  const { data, isLoading, isFetching } = useQuery(
    "cerfa",
    async () => {
      const res = await hydrate(dossier);
      setCerfa(res);
      setCerfaFormation(res);
      setCerfaEmployeur(res);
      setCerfaApprenti(res);
      setCerfaMaitres(res);
      setCerfaContrat(res);
      return Promise.resolve(res);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading: isFetching || isLoading, cerfa };
}

import { _get } from "../../httpClient";
import { useRecoilValue } from "recoil";
import { dossierAtom } from "../useDossier/dossierAtom";
import { useQuery } from "react-query";
import { CerfaFormationController, useCerfaFormation } from "./parts/useCerfaFormation";
import { CerfaEmployeurController, useCerfaEmployeur } from "./parts/useCerfaEmployeur";

const hydrate = async (dossier) => {
  try {
    const cerfa = await _get(`/api/v1/cerfa?dossierId=${dossier._id}`);
    console.log(cerfa);

    const cerfaFormationController = await CerfaFormationController(dossier);
    const cerfaEmployeurController = await CerfaEmployeurController(dossier);

    return {
      ...cerfa,
      employeur: {
        ...cerfa.employeur,
        siret: {
          ...cerfa.employeur.siret,
          ...cerfaEmployeurController.employeur.siret,
        },
      },
      // apprenti: {},
      // maitre1: {},
      // maitre2: {},
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
      // contrat: {},
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

export function useCerfa() {
  const dossier = useRecoilValue(dossierAtom);
  const { setAll: setCerfaFormation } = useCerfaFormation();
  const { setAll: setCerfaEmployeur } = useCerfaEmployeur();

  const {
    data: cerfa,
    isLoading,
    isFetching,
  } = useQuery(
    "cerfa",
    async () => {
      const res = await hydrate(dossier);
      setCerfaFormation(res);
      setCerfaEmployeur(res);
      return Promise.resolve(res);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading: isFetching || isLoading, cerfa };
}

import { _get } from "../../httpClient";
import { useRecoilValue } from "recoil";
import { dossierAtom } from "../useDossier/dossierAtom";
import { useQuery } from "react-query";
import { CerfaFormationController, useCerfaFormation } from "./parts/useCerfaFormation";

const hydrate = async (dossier) => {
  try {
    const cerfa = await _get(`/api/v1/cerfa?dossierId=${dossier._id}`);
    console.log(cerfa);

    const cerfaFormationController = await CerfaFormationController(dossier);

    return {
      ...cerfa,
      // employeur: {},
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

  const {
    data: cerfa,
    isLoading,
    isFetching,
  } = useQuery(
    "cerfa",
    async () => {
      const res = await hydrate(dossier);
      setCerfaFormation(res);
      return Promise.resolve(res);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading: isFetching || isLoading, cerfa };
}

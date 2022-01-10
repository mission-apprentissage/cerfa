/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

// import { useCallback } from "react";
// import { DateTime } from "luxon";
// import { _post } from "../../../httpClient";
import { useRecoilState } from "recoil";
import * as maitresAtoms from "./useCerfaMaitresAtoms";

export const CerfaMaitresController = async (dossier) => {
  return {
    maitre1: {},
    maitre2: {},
  };
};

export function useCerfaMaitres() {
  const [maitre1Nom, setMaitre1Nom] = useRecoilState(maitresAtoms.cerfaMaitre1NomAtom);
  const [maitre1Prenom, setMaitre1Prenom] = useRecoilState(maitresAtoms.cerfaMaitre1PrenomAtom);
  const [maitre1DateNaissance, setMaitre1DateNaissance] = useRecoilState(maitresAtoms.cerfaMaitre1DateNaissanceAtom);

  const [maitre2Nom, setMaitre2Nom] = useRecoilState(maitresAtoms.cerfaMaitre2NomAtom);
  const [maitre2Prenom, setMaitre2Prenom] = useRecoilState(maitresAtoms.cerfaMaitre2PrenomAtom);
  const [maitre2DateNaissance, setMaitre2DateNaissance] = useRecoilState(maitresAtoms.cerfaMaitre2DateNaissanceAtom);

  const [employeurAttestationEligibilite, setEmployeurAttestationEligibilite] = useRecoilState(
    maitresAtoms.cerfaEmployeurAttestationEligibiliteAtom
  );

  const setAll = async (res) => {
    setMaitre1Nom(res.maitre1.nom);
    setMaitre1Prenom(res.maitre1.prenom);
    setMaitre1DateNaissance(res.maitre1.dateNaissance);

    setMaitre2Nom(res.maitre2.nom);
    setMaitre2Prenom(res.maitre2.prenom);
    setMaitre2DateNaissance(res.maitre2.dateNaissance);

    setEmployeurAttestationEligibilite(res.employeur.attestationEligibilite);
  };

  return {
    get: {
      maitre1: {
        nom: maitre1Nom,
        prenom: maitre1Prenom,
        dateNaissance: maitre1DateNaissance,
      },
      maitre2: {
        nom: maitre2Nom,
        prenom: maitre2Prenom,
        dateNaissance: maitre2DateNaissance,
      },
      employeur: {
        attestationEligibilite: employeurAttestationEligibilite,
      },
    },
    setAll,
    onSubmit: {
      maitre1: {},
      maitre2: {},
      employeur: {},
    },
  };
}

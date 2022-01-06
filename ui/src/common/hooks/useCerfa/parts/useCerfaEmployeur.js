/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

// import { useCallback } from "react";
// import { DateTime } from "luxon";
// import { _post } from "../../../httpClient";
import { useRecoilState } from "recoil";
import * as employeurAtoms from "./useCerfaEmployeurAtoms";

export const CerfaEmployeurController = async (dossier) => {
  return {
    employeur: {},
  };
};

export function useCerfaEmployeur() {
  const [employeurSiret, setEmployeurSiret] = useRecoilState(employeurAtoms.cerfaEmployeurSiretAtom);
  const [employeurDenomination, setEmployeurDenomination] = useRecoilState(
    employeurAtoms.cerfaEmployeurDenominationAtom
  );
  const [employeurRaisonSociale, setEmployeurRaisonSociale] = useRecoilState(
    employeurAtoms.cerfaEmployeurRaisonSocialeAtom
  );
  const [employeurNaf, setEmployeurNaf] = useRecoilState(employeurAtoms.cerfaEmployeurNafAtom);
  const [employeurNombreDeSalaries, setEmployeurNombreDeSalaries] = useRecoilState(
    employeurAtoms.cerfaEmployeurNombreDeSalariesAtom
  );
  const [employeurCodeIdcc, setEmployeurCodeIdcc] = useRecoilState(employeurAtoms.cerfaEmployeurCodeIdccAtom);
  const [employeurLibelleIdcc, setEmployeurLibelleIdcc] = useRecoilState(employeurAtoms.cerfaEmployeurLibelleIdccAtom);
  const [employeurTelephone, setEmployeurTelephone] = useRecoilState(employeurAtoms.cerfaEmployeurTelephoneAtom);
  const [employeurCourriel, setEmployeurCourriel] = useRecoilState(employeurAtoms.cerfaEmployeurCourrielAtom);
  const [employeurAdresseNumero, setEmployeurAdresseNumero] = useRecoilState(
    employeurAtoms.cerfaEmployeurAdresseNumeroAtom
  );
  const [employeurAdresseVoie, setEmployeurAdresseVoie] = useRecoilState(employeurAtoms.cerfaEmployeurAdresseVoieAtom);
  const [employeurAdresseComplement, setEmployeurAdresseComplement] = useRecoilState(
    employeurAtoms.cerfaEmployeurAdresseComplementAtom
  );
  const [employeurAdresseCodePostal, setEmployeurAdresseCodePostal] = useRecoilState(
    employeurAtoms.cerfaEmployeurAdresseCodePostalAtom
  );
  const [employeurAdresseCommune, setEmployeurAdresseCommune] = useRecoilState(
    employeurAtoms.cerfaEmployeurAdresseCommuneAtom
  );
  const [employeurNom, setEmployeurNom] = useRecoilState(employeurAtoms.cerfaEmployeurNomAtom);
  const [employeurPrenom, setEmployeurPrenom] = useRecoilState(employeurAtoms.cerfaEmployeurPrenomAtom);
  const [employeurTypeEmployeur, setEmployeurTypeEmployeur] = useRecoilState(
    employeurAtoms.cerfaEmployeurTypeEmployeurAtom
  );
  const [employeurEmployeurSpecifique, setEmployeurEmployeurSpecifique] = useRecoilState(
    employeurAtoms.cerfaEmployeurEmployeurSpecifiqueAtom
  );
  const [employeurCaisseComplementaire, setEmployeurCaisseComplementaire] = useRecoilState(
    employeurAtoms.cerfaEmployeurCaisseComplementaireAtom
  );
  const [employeurRegimeSpecifique, setEmployeurRegimeSpecifique] = useRecoilState(
    employeurAtoms.cerfaEmployeurRegimeSpecifiqueAtom
  );
  const [employeurAttestationEligibilite, setEmployeurAttestationEligibilite] = useRecoilState(
    employeurAtoms.cerfaEmployeurAttestationEligibiliteAtom
  );
  const [employeurAttestationPieces, setEmployeurAttestationPieces] = useRecoilState(
    employeurAtoms.cerfaEmployeurAttestationPiecesAtom
  );

  const setAll = async (res) => {
    setEmployeurSiret(res.employeur.siret);
    setEmployeurDenomination(res.employeur.denomination);
    setEmployeurRaisonSociale(res.employeur.raison_sociale);
    setEmployeurNaf(res.employeur.naf);
    setEmployeurNombreDeSalaries(res.employeur.nombreDeSalaries);
    setEmployeurCodeIdcc(res.employeur.codeIdcc);
    setEmployeurLibelleIdcc(res.employeur.libelleIdcc);
    setEmployeurTelephone(res.employeur.telephone);
    setEmployeurCourriel(res.employeur.courriel);
    setEmployeurAdresseNumero(res.employeur.adresse.numero);
    setEmployeurAdresseVoie(res.employeur.adresse.voie);
    setEmployeurAdresseComplement(res.employeur.adresse.complement);
    setEmployeurAdresseCodePostal(res.employeur.adresse.codePostal);
    setEmployeurAdresseCommune(res.employeur.adresse.commune);
    setEmployeurNom(res.employeur.nom);
    setEmployeurPrenom(res.employeur.prenom);
    setEmployeurTypeEmployeur(res.employeur.typeEmployeur);
    setEmployeurEmployeurSpecifique(res.employeur.employeurSpecifique);
    setEmployeurCaisseComplementaire(res.employeur.caisseComplementaire);
    setEmployeurRegimeSpecifique(res.employeur.regimeSpecifique);
    setEmployeurAttestationEligibilite(res.employeur.attestationEligibilite);
    setEmployeurAttestationPieces(res.employeur.attestationPieces);
  };

  return {
    get: {
      employeur: {
        siret: employeurSiret,
        denomination: employeurDenomination,
        raison_sociale: employeurRaisonSociale,
        naf: employeurNaf,
        nombreDeSalaries: employeurNombreDeSalaries,
        codeIdcc: employeurCodeIdcc,
        libelleIdcc: employeurLibelleIdcc,
        telephone: employeurTelephone,
        courriel: employeurCourriel,
        adresse: {
          numero: employeurAdresseNumero,
          voie: employeurAdresseVoie,
          complement: employeurAdresseComplement,
          codePostal: employeurAdresseCodePostal,
          commune: employeurAdresseCommune,
        },
        nom: employeurNom,
        prenom: employeurPrenom,
        typeEmployeur: employeurTypeEmployeur,
        employeurSpecifique: employeurEmployeurSpecifique,
        caisseComplementaire: employeurCaisseComplementaire,
        regimeSpecifique: employeurRegimeSpecifique,
        attestationEligibilite: employeurAttestationEligibilite,
        attestationPieces: employeurAttestationPieces,
      },
    },
    setAll,
    onSubmit: {
      employeur: {},
    },
  };
}

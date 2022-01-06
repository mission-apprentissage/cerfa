/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

// import { useCallback } from "react";
// import { DateTime } from "luxon";
// import { _post } from "../../../httpClient";
import { useRecoilState } from "recoil";
import * as apprentiAtoms from "./useCerfaApprentiAtoms";

export const CerfaApprentiController = async (dossier) => {
  return {
    apprenti: {},
  };
};

export function useCerfaApprenti() {
  const [apprentiNom, setApprentiNom] = useRecoilState(apprentiAtoms.cerfaApprentiNomAtom);
  const [apprentiPrenom, setApprentiPrenom] = useRecoilState(apprentiAtoms.cerfaApprentiPrenomAtom);
  const [apprentiSexe, setApprentiSexe] = useRecoilState(apprentiAtoms.cerfaApprentiSexeAtom);
  const [apprentiNationalite, setApprentiNationalite] = useRecoilState(apprentiAtoms.cerfaApprentiNationaliteAtom);
  const [apprentiDateNaissance, setApprentiDateNaissance] = useRecoilState(
    apprentiAtoms.cerfaApprentiDateNaissanceAtom
  );
  const [apprentiDepartementNaissance, setApprentiDepartementNaissance] = useRecoilState(
    apprentiAtoms.cerfaApprentiDepartementNaissanceAtom
  );
  const [apprentiCommuneNaissance, setApprentiCommuneNaissance] = useRecoilState(
    apprentiAtoms.cerfaApprentiCommuneNaissanceAtom
  );
  const [apprentiNir, setApprentiNir] = useRecoilState(apprentiAtoms.cerfaApprentiNirAtom);
  const [apprentiRegimeSocial, setApprentiRegimeSocial] = useRecoilState(apprentiAtoms.cerfaApprentiRegimeSocialAtom);
  const [apprentiHandicap, setApprentiHandicap] = useRecoilState(apprentiAtoms.cerfaApprentiHandicapAtom);
  const [apprentiSituationAvantContrat, setApprentiSituationAvantContrat] = useRecoilState(
    apprentiAtoms.cerfaApprentiSituationAvantContratAtom
  );
  const [apprentiDiplome, setApprentiDiplome] = useRecoilState(apprentiAtoms.cerfaApprentiDiplomeAtom);
  const [apprentiDerniereClasse, setApprentiDerniereClasse] = useRecoilState(
    apprentiAtoms.cerfaApprentiDerniereClasseAtom
  );
  const [apprentiDiplomePrepare, setApprentiDiplomePrepare] = useRecoilState(
    apprentiAtoms.cerfaApprentiDiplomePrepareAtom
  );
  const [apprentiIntituleDiplomePrepare, setApprentiIntituleDiplomePrepare] = useRecoilState(
    apprentiAtoms.cerfaApprentiIntituleDiplomePrepareAtom
  );
  const [apprentiTelephone, setApprentiTelephone] = useRecoilState(apprentiAtoms.cerfaApprentiTelephoneAtom);
  const [apprentiCourriel, setApprentiCourriel] = useRecoilState(apprentiAtoms.cerfaApprentiCourrielAtom);
  const [apprentiAdresseNumero, setApprentiAdresseNumero] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseNumeroAtom
  );
  const [apprentiAdresseVoie, setApprentiAdresseVoie] = useRecoilState(apprentiAtoms.cerfaApprentiAdresseVoieAtom);
  const [apprentiAdresseComplement, setApprentiAdresseComplement] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseComplementAtom
  );
  const [apprentiAdresseCodePostal, setApprentiAdresseCodePostal] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseCodePostalAtom
  );
  const [apprentiAdresseCommune, setApprentiAdresseCommune] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseCommuneAtom
  );
  const [apprentiResponsableLegalNom, setApprentiResponsableLegalNom] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalNomAtom
  );
  const [apprentiResponsableLegalPrenom, setApprentiResponsableLegalPrenom] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalPrenomAtom
  );
  const [apprentiResponsableLegalAdresseNumero, setApprentiResponsableLegalAdresseNumero] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseNumeroAtom
  );
  const [apprentiResponsableLegalAdresseVoie, setApprentiResponsableLegalAdresseVoie] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseVoieAtom
  );
  const [apprentiResponsableLegalAdresseComplement, setApprentiResponsableLegalAdresseComplement] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseComplementAtom
  );
  const [apprentiResponsableLegalAdresseCodePostal, setApprentiResponsableLegalAdresseCodePostal] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseCodePostalAtom
  );
  const [apprentiResponsableLegalAdresseCommune, setApprentiResponsableLegalAdresseCommune] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseCommuneAtom
  );
  const [apprentiInscriptionSportifDeHautNiveau, setApprentiInscriptionSportifDeHautNiveau] = useRecoilState(
    apprentiAtoms.cerfaApprentiInscriptionSportifDeHautNiveauAtom
  );

  const setAll = async (res) => {
    setApprentiNom(res.apprenti.nom);
    setApprentiPrenom(res.apprenti.prenom);
    setApprentiSexe(res.apprenti.sexe);
    setApprentiNationalite(res.apprenti.nationalite);
    setApprentiDateNaissance(res.apprenti.dateNaissance);
    setApprentiDepartementNaissance(res.apprenti.departementNaissance);
    setApprentiCommuneNaissance(res.apprenti.communeNaissance);
    setApprentiNir(res.apprenti.nir);
    setApprentiRegimeSocial(res.apprenti.regimeSocial);
    setApprentiHandicap(res.apprenti.handicap);
    setApprentiSituationAvantContrat(res.apprenti.situationAvantContrat);
    setApprentiDiplome(res.apprenti.diplome);
    setApprentiDerniereClasse(res.apprenti.derniereClasse);
    setApprentiDiplomePrepare(res.apprenti.diplomePrepare);
    setApprentiIntituleDiplomePrepare(res.apprenti.intituleDiplomePrepare);
    setApprentiTelephone(res.apprenti.telephone);
    setApprentiCourriel(res.apprenti.courriel);
    setApprentiAdresseNumero(res.apprenti.adresse.numero);
    setApprentiAdresseVoie(res.apprenti.adresse.voie);
    setApprentiAdresseComplement(res.apprenti.adresse.complement);
    setApprentiAdresseCodePostal(res.apprenti.adresse.codePostal);
    setApprentiAdresseCommune(res.apprenti.adresse.commune);
    setApprentiResponsableLegalNom(res.apprenti.responsableLegal.nom);
    setApprentiResponsableLegalPrenom(res.apprenti.responsableLegal.prenom);
    setApprentiResponsableLegalAdresseNumero(res.apprenti.responsableLegal.adresse.numero);
    setApprentiResponsableLegalAdresseVoie(res.apprenti.responsableLegal.adresse.voie);
    setApprentiResponsableLegalAdresseComplement(res.apprenti.responsableLegal.adresse.complement);
    setApprentiResponsableLegalAdresseCodePostal(res.apprenti.responsableLegal.adresse.codePostal);
    setApprentiResponsableLegalAdresseCommune(res.apprenti.responsableLegal.adresse.commune);
    setApprentiInscriptionSportifDeHautNiveau(res.apprenti.inscriptionSportifDeHautNiveau);
  };

  return {
    get: {
      apprenti: {
        nom: apprentiNom,
        prenom: apprentiPrenom,
        sexe: apprentiSexe,
        nationalite: apprentiNationalite,
        dateNaissance: apprentiDateNaissance,
        departementNaissance: apprentiDepartementNaissance,
        communeNaissance: apprentiCommuneNaissance,
        nir: apprentiNir,
        regimeSocial: apprentiRegimeSocial,
        handicap: apprentiHandicap,
        situationAvantContrat: apprentiSituationAvantContrat,
        diplome: apprentiDiplome,
        derniereClasse: apprentiDerniereClasse,
        diplomePrepare: apprentiDiplomePrepare,
        intituleDiplomePrepare: apprentiIntituleDiplomePrepare,
        telephone: apprentiTelephone,
        courriel: apprentiCourriel,
        adresse: {
          numero: apprentiAdresseNumero,
          voie: apprentiAdresseVoie,
          complement: apprentiAdresseComplement,
          codePostal: apprentiAdresseCodePostal,
          commune: apprentiAdresseCommune,
        },
        responsableLegal: {
          nom: apprentiResponsableLegalNom,
          prenom: apprentiResponsableLegalPrenom,
          adresse: {
            numero: apprentiResponsableLegalAdresseNumero,
            voie: apprentiResponsableLegalAdresseVoie,
            complement: apprentiResponsableLegalAdresseComplement,
            codePostal: apprentiResponsableLegalAdresseCodePostal,
            commune: apprentiResponsableLegalAdresseCommune,
          },
        },
        inscriptionSportifDeHautNiveau: apprentiInscriptionSportifDeHautNiveau,
      },
    },
    setAll,
    onSubmit: {
      apprenti: {},
    },
  };
}

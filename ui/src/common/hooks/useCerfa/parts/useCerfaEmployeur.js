/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
// import { DateTime } from "luxon";
import { _post } from "../../../httpClient";
import { useRecoilState } from "recoil";
import * as employeurAtoms from "./useCerfaEmployeurAtoms";

import { convertValueToOption } from "../../../utils/formUtils";

export const CerfaEmployeurController = async (dossier) => {
  return {
    employeur: {
      siret: {
        doAsyncActions: async (value) => {
          const response = await _post(`/api/v1/siret`, {
            siret: value,
            dossierId: dossier._id,
          });

          // await _put("/api/v1/history", {
          //   // TODO
          //   dossierId: "619baec6fcdd030ba4e13c40",
          //   context: "organismeFormation.siret",
          //   from: "98765432400070",
          //   to: values["organismeFormation.siret"],
          //   how: "manuel",
          //   when: Date.now(),
          //   who: "Antoine Bigard", // TODO Get user
          // });
          if (Object.keys(response.result).length === 0) {
            return {
              successed: false,
              data: null,
              message: response.messages.error,
            };
          }
          if (response.result.ferme) {
            return {
              successed: false,
              data: null,
              message: `Le Siret ${value} est un établissement fermé.`,
            };
          }
          return {
            successed: true,
            data: response.result,
            message: null,
          };
        },
        // history: [
        //   {
        //     to: "98765432400070",
        //     how: "manuel",
        //     when: Date.now(),
        //     who: "Antoine Bigard",
        //     role: "CFA",
        //   },
        //   {
        //     to: "98765432400019",
        //     how: "manuel",
        //     when: Date.now(),
        //     who: "Paul Pierre",
        //     role: "Employeur",
        //   },
        // ],
      },
    },
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
  const [employeurAttestationPieces, setEmployeurAttestationPieces] = useRecoilState(
    employeurAtoms.cerfaEmployeurAttestationPiecesAtom
  );
  const [employeurPrivePublic, setEmployeurPrivePublic] = useRecoilState(employeurAtoms.cerfaEmployeurPrivePublicAtom);

  const onSubmittedEmployeurSiret = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.siret") {
          const newV = {
            employeur: {
              siret: {
                ...employeurSiret,
                value: data.siret,
              },
              denomination: {
                ...employeurDenomination,
                value: data.enseigne || data.entreprise_raison_sociale,
              },
              adresse: {
                numero: {
                  ...employeurAdresseNumero,
                  value: data.numero_voie, //parseInt(data.numero_voie),
                },
                voie: { ...employeurAdresseVoie, value: `${data.type_voie} ${data.nom_voie}` },
                complement: { ...employeurAdresseComplement, value: data.complement_adresse || "" },
                codePostal: { ...employeurAdresseCodePostal, value: data.code_postal },
                commune: { ...employeurAdresseCommune, value: data.commune_implantation_nom },
              },
              privePublic: {
                ...employeurPrivePublic,
                value: data.public,
              },
            },
          };
          if (employeurSiret.value !== newV.employeur.siret.value) {
            setEmployeurSiret(newV.employeur.siret);
            setEmployeurDenomination(newV.employeur.denomination);
            setEmployeurAdresseNumero(newV.employeur.adresse.numero);
            setEmployeurAdresseVoie(newV.employeur.adresse.voie);
            setEmployeurAdresseComplement(newV.employeur.adresse.complement);
            setEmployeurAdresseCodePostal(newV.employeur.adresse.codePostal);
            setEmployeurAdresseCommune(newV.employeur.adresse.commune);

            setEmployeurPrivePublic(convertValueToOption(newV.employeur.privePublic));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAdresseCodePostal,
      employeurAdresseCommune,
      employeurAdresseComplement,
      employeurAdresseNumero,
      employeurAdresseVoie,
      employeurDenomination,
      employeurPrivePublic,
      employeurSiret,
      setEmployeurAdresseCodePostal,
      setEmployeurAdresseCommune,
      setEmployeurAdresseComplement,
      setEmployeurAdresseNumero,
      setEmployeurAdresseVoie,
      setEmployeurDenomination,
      setEmployeurPrivePublic,
      setEmployeurSiret,
    ]
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
    setEmployeurAttestationPieces(res.employeur.attestationPieces);

    setEmployeurPrivePublic(convertValueToOption(res.employeur.privePublic));
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
        attestationPieces: employeurAttestationPieces,
        privePublic: employeurPrivePublic,
      },
    },
    setAll,
    onSubmit: {
      employeur: {
        siret: onSubmittedEmployeurSiret,
      },
    },
  };
}

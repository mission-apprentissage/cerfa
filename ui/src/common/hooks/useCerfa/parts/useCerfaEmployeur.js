/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
// import { DateTime } from "luxon";
import { _post } from "../../../httpClient";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  convertOptionToValue,
  convertValueToOption,
  fieldCompletionPercentage,
  convertValueToMultipleSelectOption,
  convertMultipleSelectOptionToValue,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as employeurAtoms from "./useCerfaEmployeurAtoms";

const cerfaEmployeurCompletion = (res) => {
  let fieldsToKeep = {
    employeurSiret: res.employeur.siret,
    employeurDenomination: res.employeur.denomination,
    // employeurRaisonSociale: res.employeur.raison_sociale,
    employeurNaf: res.employeur.naf,
    employeurNombreDeSalaries: res.employeur.nombreDeSalaries,
    employeurCodeIdcc: res.employeur.codeIdcc,
    employeurLibelleIdcc: res.employeur.libelleIdcc,
    employeurTelephone: res.employeur.telephone,
    employeurCourriel: res.employeur.courriel,
    employeurAdresseNumero: res.employeur.adresse.numero,
    employeurAdresseVoie: res.employeur.adresse.voie,
    employeurAdresseComplement: res.employeur.adresse.complement,
    employeurAdresseCodePostal: res.employeur.adresse.codePostal,
    employeurAdresseCommune: res.employeur.adresse.commune,
    // employeurNom: res.employeur.nom,
    // employeurPrenom: res.employeur.prenom,
    employeurTypeEmployeur: res.employeur.typeEmployeur,
    employeurEmployeurSpecifique: res.employeur.employeurSpecifique,
    employeurCaisseComplementaire: res.employeur.caisseComplementaire,
    employeurRegimeSpecifique: res.employeur.regimeSpecifique,
    employeurPrivePublic: res.employeur.privePublic,
  };

  return fieldCompletionPercentage(fieldsToKeep, 18);
};

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
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [partEmployeurCompletion, setPartEmployeurCompletionAtom] = useRecoilState(
    employeurAtoms.cerfaPartEmployeurCompletionAtom
  );

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
              naf: {
                ...employeurNaf,
                value: data.naf_code,
              },
              adresse: {
                numero: {
                  ...employeurAdresseNumero,
                  value: data.numero_voie, //parseInt(data.numero_voie),
                },
                voie: {
                  ...employeurAdresseVoie,
                  value: data.type_voie || data.nom_voie ? `${data.type_voie} ${data.nom_voie}` : "",
                },
                complement: { ...employeurAdresseComplement, value: data.complement_adresse || "" },
                codePostal: { ...employeurAdresseCodePostal, value: data.code_postal },
                commune: { ...employeurAdresseCommune, value: data.commune_implantation_nom },
              },
              privePublic: {
                ...employeurPrivePublic,
                value: data.public || true,
              },
              codeIdcc: {
                ...employeurCodeIdcc,
                value: `${data.conventionCollective?.idcc}` || "",
              },
              libelleIdcc: {
                ...employeurLibelleIdcc,
                value: data.conventionCollective?.titre || "",
              },
            },
          };

          if (employeurSiret.value !== newV.employeur.siret.value) {
            setEmployeurSiret(newV.employeur.siret);
            setEmployeurDenomination(newV.employeur.denomination);
            setEmployeurNaf(newV.employeur.naf);
            setEmployeurCodeIdcc(newV.employeur.codeIdcc);
            setEmployeurLibelleIdcc(newV.employeur.libelleIdcc);
            setEmployeurAdresseNumero(newV.employeur.adresse.numero);
            setEmployeurAdresseVoie(newV.employeur.adresse.voie);
            setEmployeurAdresseComplement(newV.employeur.adresse.complement);
            setEmployeurAdresseCodePostal(newV.employeur.adresse.codePostal);
            setEmployeurAdresseCommune(newV.employeur.adresse.commune);

            setEmployeurPrivePublic(convertValueToOption(newV.employeur.privePublic));

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                siret: newV.employeur.siret.value,
                denomination: newV.employeur.denomination.value,
                naf: newV.employeur.naf.value,
                codeIdcc: newV.employeur.codeIdcc.value,
                libelleIdcc: newV.employeur.libelleIdcc.value,
                // privePublic: convertOptionToValue(newV.employeur.privePublic),
                adresse: {
                  numero: newV.employeur.adresse.numero.value || null,
                  voie: newV.employeur.adresse.voie.value,
                  complement: newV.employeur.adresse.complement.value,
                  codePostal: newV.employeur.adresse.codePostal.value,
                  commune: newV.employeur.adresse.commune.value,
                },
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurAdresseCodePostal,
      employeurAdresseCommune,
      employeurAdresseComplement,
      employeurAdresseNumero,
      employeurAdresseVoie,
      employeurCodeIdcc,
      employeurDenomination,
      employeurLibelleIdcc,
      employeurNaf,
      employeurPrivePublic,
      employeurSiret,
      setEmployeurAdresseCodePostal,
      setEmployeurAdresseCommune,
      setEmployeurAdresseComplement,
      setEmployeurAdresseNumero,
      setEmployeurAdresseVoie,
      setEmployeurCodeIdcc,
      setEmployeurDenomination,
      setEmployeurLibelleIdcc,
      setEmployeurNaf,
      setEmployeurPrivePublic,
      setEmployeurSiret,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurTypeEmployeur = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.typeEmployeur") {
          const newV = {
            employeur: {
              typeEmployeur: {
                ...employeurTypeEmployeur,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };

          if (employeurTypeEmployeur.value !== newV.employeur.typeEmployeur.value) {
            setEmployeurTypeEmployeur(newV.employeur.typeEmployeur);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                typeEmployeur: convertMultipleSelectOptionToValue(newV.employeur.typeEmployeur),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurTypeEmployeur, setEmployeurTypeEmployeur, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurEmployeurSpecifique = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.employeurSpecifique") {
          const newV = {
            employeur: {
              employeurSpecifique: {
                ...employeurEmployeurSpecifique,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };

          if (employeurEmployeurSpecifique.value !== newV.employeur.employeurSpecifique.value) {
            setEmployeurEmployeurSpecifique(newV.employeur.employeurSpecifique);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                employeurSpecifique: convertOptionToValue(newV.employeur.employeurSpecifique),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurEmployeurSpecifique,
      setEmployeurEmployeurSpecifique,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurNombreDeSalaries = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.nombreDeSalaries") {
          const newV = {
            employeur: {
              nombreDeSalaries: {
                ...employeurNombreDeSalaries,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (employeurNombreDeSalaries.value !== newV.employeur.nombreDeSalaries.value) {
            setEmployeurNombreDeSalaries(newV.employeur.nombreDeSalaries);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                nombreDeSalaries: newV.employeur.nombreDeSalaries.value,
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurNombreDeSalaries, setEmployeurNombreDeSalaries, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurLibelleIdcc = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.libelleIdcc") {
          const newV = {
            employeur: {
              libelleIdcc: {
                ...employeurLibelleIdcc,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (employeurLibelleIdcc.value !== newV.employeur.libelleIdcc.value) {
            setEmployeurLibelleIdcc(newV.employeur.libelleIdcc);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                libelleIdcc: newV.employeur.libelleIdcc.value,
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurLibelleIdcc, setEmployeurLibelleIdcc, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurCaisseComplementaire = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.caisseComplementaire") {
          const newV = {
            employeur: {
              caisseComplementaire: {
                ...employeurCaisseComplementaire,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (employeurCaisseComplementaire.value !== newV.employeur.caisseComplementaire.value) {
            setEmployeurCaisseComplementaire(newV.employeur.caisseComplementaire);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                caisseComplementaire: newV.employeur.caisseComplementaire.value,
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurCaisseComplementaire,
      setEmployeurCaisseComplementaire,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurTelephone = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.telephone") {
          const newV = {
            employeur: {
              telephone: {
                ...employeurTelephone,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (employeurTelephone.value !== newV.employeur.telephone.value) {
            setEmployeurTelephone(newV.employeur.telephone);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                telephone: newV.employeur.telephone.value,
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurTelephone, setEmployeurTelephone, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurCourriel = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.courriel") {
          const newV = {
            employeur: {
              courriel: {
                ...employeurCourriel,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (employeurCourriel.value !== newV.employeur.courriel.value) {
            setEmployeurCourriel(newV.employeur.courriel);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                courriel: newV.employeur.courriel.value,
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurCourriel, setEmployeurCourriel, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurRegimeSpecifique = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.regimeSpecifique") {
          const newV = {
            employeur: {
              regimeSpecifique: {
                ...employeurRegimeSpecifique,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (employeurRegimeSpecifique.value !== newV.employeur.regimeSpecifique.value) {
            setEmployeurRegimeSpecifique(newV.employeur.regimeSpecifique);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                regimeSpecifique: convertOptionToValue(newV.employeur.regimeSpecifique),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurRegimeSpecifique, setEmployeurRegimeSpecifique, setPartEmployeurCompletionAtom]
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
    setEmployeurTypeEmployeur(convertValueToMultipleSelectOption(res.employeur.typeEmployeur));
    setEmployeurEmployeurSpecifique(convertValueToOption(res.employeur.employeurSpecifique));
    setEmployeurCaisseComplementaire(res.employeur.caisseComplementaire);
    setEmployeurRegimeSpecifique(convertValueToOption(res.employeur.regimeSpecifique));
    setEmployeurAttestationPieces(res.employeur.attestationPieces);

    setEmployeurPrivePublic(convertValueToOption(res.employeur.privePublic));

    setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
  };

  return {
    completion: partEmployeurCompletion,
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
        typeEmployeur: onSubmittedEmployeurTypeEmployeur,
        employeurSpecifique: onSubmittedEmployeurEmployeurSpecifique,
        nombreDeSalaries: onSubmittedEmployeurNombreDeSalaries,
        libelleIdcc: onSubmittedEmployeurLibelleIdcc,
        caisseComplementaire: onSubmittedEmployeurCaisseComplementaire,
        telephone: onSubmittedEmployeurTelephone,
        courriel: onSubmittedEmployeurCourriel,
        regimeSpecifique: onSubmittedEmployeurRegimeSpecifique,
      },
    },
  };
}

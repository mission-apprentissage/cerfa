/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback, useEffect } from "react";
import { _post } from "../../../httpClient";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  convertOptionToValue,
  convertValueToOption,
  fieldCompletionPercentage,
  convertValueToMultipleSelectOption,
  convertMultipleSelectOptionToValue,
  normalizeInputNumberForDb,
  doAsyncCodePostalActions,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as employeurAtoms from "./useCerfaEmployeurAtoms";
import { buildRemunerations } from "../../../utils/form/remunerationsUtils";
import { fieldsChecker } from "../../../utils/form/fieldsCheckUtils";
import { useCerfaContrat } from "../parts/useCerfaContrat";

export const cerfaEmployeurCompletion = (res) => {
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
    // employeurAdresseNumero: res.employeur.adresse.numero,
    employeurAdresseVoie: res.employeur.adresse.voie,
    // employeurAdresseComplement: res.employeur.adresse.complement,
    employeurAdresseCodePostal: res.employeur.adresse.codePostal,
    employeurAdresseCommune: res.employeur.adresse.commune,
    employeurAdresseDepartement: res.employeur.adresse.departement,
    employeurAdresseRegion: res.employeur.adresse.region,
    // employeurNom: res.employeur.nom,
    // employeurPrenom: res.employeur.prenom,
    employeurTypeEmployeur: res.employeur.typeEmployeur,
    // employeurEmployeurSpecifique: res.employeur.employeurSpecifique,
    // employeurCaisseComplementaire: res.employeur.caisseComplementaire,
    employeurRegimeSpecifique: res.employeur.regimeSpecifique,
    // employeurPrivePublic: res.employeur.privePublic,
  };

  return fieldCompletionPercentage(fieldsToKeep, 15);
};

export const CerfaEmployeurController = async (dossier) => {
  return {
    employeur: {
      siret: {
        doAsyncActions: async (value, data) => {
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
          const resultLength = Object.keys(response.result).length;

          if (resultLength === 0) {
            return {
              successed: false,
              data: null,
              message: response.messages.error,
            };
          }

          if (response.result.api_entreprise === "KO") {
            return {
              warning: true,
              data: response.result,
              message: `Le service de récupération des informations Siret est momentanément indisponible. Nous ne pouvons pas pre-remplir le formulaire.`,
            };
          }

          if (response.result.ferme) {
            return {
              successed: false,
              data: null,
              message: `Le Siret ${value} est un établissement fermé.`,
            };
          }

          if (response.result.secretSiret) {
            return {
              successed: true,
              data: response.result,
              message: `Votre siret est valide. En revanche, en raison de sa nature, nous ne pouvons pas récupérer les informations reliées.`,
            };
          }

          if (data.apprentiDateNaissance !== "" && data.dateFinContrat !== "" && data.dateDebutContrat !== "") {
            const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue, smicObj } =
              buildRemunerations({
                apprentiDateNaissance: data.apprentiDateNaissance,
                apprentiAge: data.apprentiAge,
                dateDebutContrat: data.dateDebutContrat,
                dateFinContrat: data.dateFinContrat,
                remunerationsAnnuelles: data.remunerationsAnnuelles,
                employeurAdresseDepartement: response.result.num_departement,
              });

            return {
              successed: true,
              data: {
                ...response.result,
                remunerationsAnnuelles,
                remunerationsAnnuellesDbValue,
                smicObj,
                salaireEmbauche,
              },
              message: null,
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
      codeIdcc: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          const index = data.enumCodeIdcc.indexOf(value);
          if (index === -1 && value.length >= 4) {
            return {
              successed: false,
              data: null,
              message: "Le code IDCC n'est pas valide",
            };
          }

          let libelleIdcc = data.libelleIdcc;
          if (value.length === 4) {
            libelleIdcc = data.enumLibelleIdcc[index];
          }

          return {
            successed: true,
            data: {
              codeIdcc: value,
              libelleIdcc,
            },
            message: null,
          };
        },
      },
      nombreDeSalaries: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (parseInt(value) > 9999999) {
            return {
              successed: false,
              data: null,
              message: "Le nombre de salariés ne peut excéder 9999999",
            };
          }

          return {
            successed: true,
            data: {
              nombreDeSalaries: value,
            },
            message: null,
          };
        },
      },
      adresse: {
        codePostal: {
          doAsyncActions: async (value, data) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const result = await doAsyncCodePostalActions(value, data, dossier._id);
            if (result.successed) {
              if (data.apprentiDateNaissance !== "" && data.dateFinContrat !== "" && data.dateDebutContrat !== "") {
                const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue, smicObj } =
                  buildRemunerations({
                    apprentiDateNaissance: data.apprentiDateNaissance,
                    apprentiAge: data.apprentiAge,
                    dateDebutContrat: data.dateDebutContrat,
                    dateFinContrat: data.dateFinContrat,
                    remunerationsAnnuelles: data.remunerationsAnnuelles,
                    employeurAdresseDepartement: result.data.departement,
                  });

                return {
                  successed: true,
                  data: {
                    ...result.data,
                    remunerationsAnnuelles,
                    remunerationsAnnuellesDbValue,
                    smicObj,
                    salaireEmbauche,
                  },
                  message: null,
                };
              }
            }

            return result;
          },
        },
        departement: {
          doAsyncActions: async (value, data) => {
            await new Promise((resolve) => setTimeout(resolve, 100));

            if (data.apprentiDateNaissance !== "" && data.dateFinContrat !== "" && data.dateDebutContrat !== "") {
              const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue, smicObj } =
                buildRemunerations({
                  apprentiDateNaissance: data.apprentiDateNaissance,
                  apprentiAge: data.apprentiAge,
                  dateDebutContrat: data.dateDebutContrat,
                  dateFinContrat: data.dateFinContrat,
                  remunerationsAnnuelles: data.remunerationsAnnuelles,
                  employeurAdresseDepartement: value,
                });

              return {
                successed: true,
                data: {
                  departement: value,
                  remunerationsAnnuelles,
                  remunerationsAnnuellesDbValue,
                  smicObj,
                  salaireEmbauche,
                },
                message: null,
              };
            }

            return {
              successed: true,
              data: {
                departement: value,
              },
              message: null,
            };
          },
        },
      },
      naf: {
        doAsyncActions: async (value, data) => {
          try {
            const insert = (str, index, value) => {
              return str.substr(0, index) + value + str.substr(index);
            };
            let formattedNaf = value;
            if (!value.includes(".") && value.length > 2) {
              formattedNaf = insert(value, 2, ".");
            }

            const response = await _post(`/api/v1/naf/`, {
              naf: formattedNaf,
              dossierId: dossier._id,
            });

            if (response.error) {
              return {
                successed: false,
                data: null,
                message: response.error,
              };
            }

            return {
              successed: true,
              data: {
                naf: value,
              },
              message: null,
            };
          } catch (error) {
            return {
              successed: false,
              data: null,
              message: error.prettyMessage,
            };
          }
        },
      },
    },
  };
};

export function useCerfaEmployeur() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);
  const { setRemunerations } = useCerfaContrat();

  const [partEmployeurCompletion, setPartEmployeurCompletionAtom] = useRecoilState(
    employeurAtoms.cerfaPartEmployeurCompletionAtom
  );
  const [isLoading, setIsLoading] = useRecoilState(employeurAtoms.cerfaPartEmployeurIsLoadingAtom);

  const [isValidating, setIsValidating] = useRecoilState(employeurAtoms.cerfaPartEmployeurIsValidatigngAtom);
  const resetCheckFields = useRecoilState(employeurAtoms.cerfaPartEmployeurHasBeenResetAtom);
  const [fieldsValided, setFieldsValided] = useRecoilState(employeurAtoms.cerfaPartEmployeurFieldsVaidedAtom);
  const [fieldsErrored, setFieldsErrored] = useRecoilState(employeurAtoms.cerfaPartEmployeurFieldsErroredAtom);

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
  const [employeurCodeIdccSpecial, setEmployeurCodeIdccSpecial] = useRecoilState(
    employeurAtoms.cerfaEmployeurCodeIdcSpecialAtom
  );
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
  const [employeurAdresseDepartement, setEmployeurAdresseDepartement] = useRecoilState(
    employeurAtoms.cerfaEmployeurAdresseDepartementAtom
  );
  const [employeurAdresseRegion, setEmployeurAdresseRegion] = useRecoilState(
    employeurAtoms.cerfaEmployeurAdresseRegionAtom
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
                locked: false,
              },
              naf: {
                ...employeurNaf,
                value: data.naf_code,
                locked: false,
              },
              adresse: {
                numero: {
                  ...employeurAdresseNumero,
                  value: data.numero_voie || "",
                  locked: false,
                },
                voie: {
                  ...employeurAdresseVoie,
                  value:
                    data.type_voie || data.nom_voie
                      ? `${data.type_voie ? `${data.type_voie} ` : ""}${data.nom_voie}`
                      : "",
                  locked: false,
                },
                complement: { ...employeurAdresseComplement, value: data.complement_adresse || "", locked: false },
                codePostal: {
                  ...employeurAdresseCodePostal,
                  value: data.code_postal || "",
                  locked: false,
                },
                commune: {
                  ...employeurAdresseCommune,
                  value: data.commune_implantation_nom || "",
                  locked: false,
                },
                departement: {
                  ...employeurAdresseDepartement,
                  value: data.num_departement || "",
                  locked: false,
                },
                region: {
                  ...employeurAdresseRegion,
                  value: data.num_region || "",
                  locked: true,
                },
              },
              privePublic: {
                ...employeurPrivePublic,
                value: data.public ?? true,
              },
              codeIdcc: {
                ...employeurCodeIdcc,
                value: data.conventionCollective?.idcc ? `${data.conventionCollective?.idcc}` : "",
                locked: false,
              },
              libelleIdcc: {
                ...employeurLibelleIdcc,
                value: data.conventionCollective?.titre || "",
              },
              nombreDeSalaries: {
                ...employeurNombreDeSalaries,
                value: data.entreprise_tranche_effectif_salarie?.de || "",
                locked: false,
              },
            },
          };

          if (!data.secretSiret) {
            setEmployeurSiret(newV.employeur.siret);
          }
          setEmployeurDenomination(newV.employeur.denomination);
          setEmployeurNaf(newV.employeur.naf);

          setEmployeurCodeIdcc(newV.employeur.codeIdcc);
          setEmployeurCodeIdccSpecial({
            ...employeurCodeIdccSpecial,
            locked: false,
            value: newV.employeur.codeIdcc.value,
          });

          let libelleIdcc = newV.employeur.libelleIdcc.value;

          if (libelleIdcc === "") {
            const index = newV.employeur.codeIdcc.enum.indexOf(newV.employeur.codeIdcc.value);
            if (index !== -1) {
              libelleIdcc = employeurLibelleIdcc.enum[index];
            }
          }
          setEmployeurLibelleIdcc({ ...newV.employeur.libelleIdcc, value: libelleIdcc });

          setEmployeurNombreDeSalaries(newV.employeur.nombreDeSalaries);
          setEmployeurAdresseNumero(newV.employeur.adresse.numero);
          setEmployeurAdresseVoie(newV.employeur.adresse.voie);
          setEmployeurAdresseComplement(newV.employeur.adresse.complement);
          setEmployeurAdresseCodePostal(newV.employeur.adresse.codePostal);
          setEmployeurAdresseCommune(newV.employeur.adresse.commune);
          setEmployeurAdresseDepartement(newV.employeur.adresse.departement);
          setEmployeurAdresseRegion(newV.employeur.adresse.region);

          setEmployeurPrivePublic(convertValueToOption(newV.employeur.privePublic));

          let dataToSave = {
            employeur: {
              siret: newV.employeur.siret.value,
              denomination: newV.employeur.denomination.value,
              naf: newV.employeur.naf.value,
              codeIdcc: newV.employeur.codeIdcc.value,
              libelleIdcc: libelleIdcc,
              nombreDeSalaries: normalizeInputNumberForDb(newV.employeur.nombreDeSalaries.value),
              privePublic: newV.employeur.privePublic.value,
              adresse: {
                numero: normalizeInputNumberForDb(newV.employeur.adresse.numero.value),
                voie: newV.employeur.adresse.voie.value.trim(),
                complement: newV.employeur.adresse.complement.value.trim(),
                codePostal: newV.employeur.adresse.codePostal.value.trim(),
                commune: newV.employeur.adresse.commune.value.trim(),
                departement: newV.employeur.adresse.departement.value,
                region: newV.employeur.adresse.region.value,
              },
            },
            isLockedField: {
              employeur: {
                denomination: false,
                naf: false,
                codeIdcc: false,
                nombreDeSalaries: false,
                adresse: {
                  numero: false,
                  voie: false,
                  complement: false,
                  codePostal: false,
                  commune: false,
                  departement: false,
                  region: true,
                },
              },
            },
          };
          if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
            setRemunerations(data);
            dataToSave = {
              ...dataToSave,
              contrat: {
                remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                salaireEmbauche: data.salaireEmbauche.toFixed(2),
                smic: data.smicObj,
              },
            };
          }

          const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
          setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
          setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          if (newV.employeur.denomination.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.denomination"));
          if (newV.employeur.naf.value) setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.naf"));
          if (newV.employeur.codeIdcc.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.codeIdcc"));
          if (newV.employeur.nombreDeSalaries.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.nombreDeSalaries"));
          if (newV.employeur.adresse.voie.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.voie"));
          if (newV.employeur.adresse.codePostal.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.codePostal"));
          if (newV.employeur.adresse.commune.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.commune"));
          if (newV.employeur.adresse.departement.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.departement"));
          if (newV.employeur.adresse.region.value)
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.region"));
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
      employeurAdresseDepartement,
      employeurAdresseNumero,
      employeurAdresseRegion,
      employeurAdresseVoie,
      employeurCodeIdcc,
      employeurCodeIdccSpecial,
      employeurDenomination,
      employeurLibelleIdcc,
      employeurNaf,
      employeurNombreDeSalaries,
      employeurPrivePublic,
      employeurSiret,
      setEmployeurAdresseCodePostal,
      setEmployeurAdresseCommune,
      setEmployeurAdresseComplement,
      setEmployeurAdresseDepartement,
      setEmployeurAdresseNumero,
      setEmployeurAdresseRegion,
      setEmployeurAdresseVoie,
      setEmployeurCodeIdcc,
      setEmployeurCodeIdccSpecial,
      setEmployeurDenomination,
      setEmployeurLibelleIdcc,
      setEmployeurNaf,
      setEmployeurNombreDeSalaries,
      setEmployeurPrivePublic,
      setEmployeurSiret,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
      setRemunerations,
    ]
  );

  const onSubmittedEmployeurDenomination = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.denomination") {
          const newV = {
            employeur: {
              denomination: {
                ...employeurDenomination,
                value: data,
              },
            },
          };
          if (employeurDenomination.value !== newV.employeur.denomination.value) {
            setEmployeurDenomination(newV.employeur.denomination);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                denomination: newV.employeur.denomination.value.trim(),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurDenomination,
      setEmployeurDenomination,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurNaf = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.naf") {
          const newV = {
            employeur: {
              naf: {
                ...employeurNaf,
                value: data.naf,
              },
            },
          };
          if (employeurNaf.value !== newV.employeur.naf.value) {
            setEmployeurNaf(newV.employeur.naf);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                naf: newV.employeur.naf.value.trim(),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurNaf, setEmployeurNaf, setFieldsErrored, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurCodeIdcc = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.codeIdcc") {
          const newV = {
            employeur: {
              codeIdcc: {
                ...employeurCodeIdcc,
                value: data.codeIdcc,
              },
              libelleIdcc: {
                ...employeurLibelleIdcc,
                value: data.libelleIdcc || "",
              },
            },
          };
          if (employeurCodeIdcc.value !== newV.employeur.codeIdcc.value) {
            setEmployeurCodeIdcc(newV.employeur.codeIdcc);

            setEmployeurCodeIdccSpecial({ ...employeurCodeIdccSpecial, value: newV.employeur.codeIdcc.value });

            let libelleIdcc = newV.employeur.libelleIdcc.value;

            if (libelleIdcc === "") {
              const index = newV.employeur.codeIdcc.enum.indexOf(newV.employeur.codeIdcc.value);
              if (index !== -1) {
                libelleIdcc = employeurLibelleIdcc.enum[index];
              }
            }
            setEmployeurLibelleIdcc({ ...newV.employeur.libelleIdcc, value: libelleIdcc });

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                codeIdcc: newV.employeur.codeIdcc.value.trim(),
                libelleIdcc: newV.employeur.libelleIdcc.value.trim(),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurCodeIdcc,
      employeurCodeIdccSpecial,
      employeurLibelleIdcc,
      setEmployeurCodeIdcc,
      setEmployeurCodeIdccSpecial,
      setEmployeurLibelleIdcc,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurCodeIdccSpecial = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.codeIdcc.special") {
          if (employeurCodeIdccSpecial.value !== data) {
            setEmployeurCodeIdccSpecial({ ...employeurCodeIdccSpecial, value: data });
            const codeIdcc = convertOptionToValue({ ...employeurCodeIdccSpecial, value: data });

            setEmployeurCodeIdcc({ ...employeurCodeIdcc, value: codeIdcc });

            let libelleIdcc = "";

            if (libelleIdcc === "") {
              const index = employeurCodeIdcc.enum.indexOf(codeIdcc);
              if (index !== -1) {
                libelleIdcc = employeurLibelleIdcc.enum[index];
              }
            }
            setEmployeurLibelleIdcc({ ...employeurLibelleIdcc, value: libelleIdcc });

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                codeIdcc: codeIdcc,
                libelleIdcc: libelleIdcc.trim(),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.codeIdcc"));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurCodeIdcc,
      employeurCodeIdccSpecial,
      employeurLibelleIdcc,
      setEmployeurCodeIdcc,
      setEmployeurCodeIdccSpecial,
      setEmployeurLibelleIdcc,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurAdresseNumero = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.numero") {
          const newV = {
            employeur: {
              adresse: {
                numero: {
                  ...employeurAdresseNumero,
                  value: data,
                },
              },
            },
          };
          if (employeurAdresseNumero.value !== newV.employeur.adresse.numero.value) {
            setEmployeurAdresseNumero(newV.employeur.adresse.numero);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                adresse: {
                  numero: normalizeInputNumberForDb(data),
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
    [employeurAdresseNumero, setEmployeurAdresseNumero, dossier?._id, cerfa?.id, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurAdresseVoie = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.voie") {
          const newV = {
            employeur: {
              adresse: {
                voie: {
                  ...employeurAdresseVoie,
                  value: data,
                },
              },
            },
          };
          if (employeurAdresseVoie.value !== newV.employeur.adresse.voie.value) {
            setEmployeurAdresseVoie(newV.employeur.adresse.voie);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                adresse: {
                  voie: newV.employeur.adresse.voie.value.trim(),
                },
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAdresseVoie,
      setEmployeurAdresseVoie,
      dossier?._id,
      cerfa?.id,
      setPartEmployeurCompletionAtom,
      setFieldsErrored,
    ]
  );

  const onSubmittedEmployeurAdresseComplement = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.complement") {
          const newV = {
            employeur: {
              adresse: {
                complement: {
                  ...employeurAdresseComplement,
                  value: data,
                },
              },
            },
          };
          if (employeurAdresseComplement.value !== newV.employeur.adresse.complement.value) {
            setEmployeurAdresseComplement(newV.employeur.adresse.complement);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                adresse: {
                  complement: newV.employeur.adresse.complement.value.trim(),
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
    [employeurAdresseComplement, setEmployeurAdresseComplement, dossier?._id, cerfa?.id, setPartEmployeurCompletionAtom]
  );

  const onSubmittedEmployeurAdresseCodePostal = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.codePostal") {
          const newV = {
            employeur: {
              adresse: {
                codePostal: {
                  ...employeurAdresseCodePostal,
                  value: data.codePostal,
                },
                commune: {
                  ...employeurAdresseCommune,
                  value: data.commune,
                },
                departement: {
                  ...employeurAdresseDepartement,
                  value: data.departement,
                },
                region: {
                  ...employeurAdresseRegion,
                  value: data.region,
                },
              },
            },
          };
          if (employeurAdresseCodePostal.value !== newV.employeur.adresse.codePostal.value) {
            setEmployeurAdresseCodePostal(newV.employeur.adresse.codePostal);
            setEmployeurAdresseCommune(newV.employeur.adresse.commune);
            setEmployeurAdresseDepartement(newV.employeur.adresse.departement);
            setEmployeurAdresseRegion(newV.employeur.adresse.region);

            let dataToSave = {
              employeur: {
                adresse: {
                  codePostal: newV.employeur.adresse.codePostal.value.trim(),
                  commune: newV.employeur.adresse.commune.value.trim(),
                  departement: newV.employeur.adresse.departement.value.trim(),
                  region: newV.employeur.adresse.departement.value.trim(),
                },
              },
            };
            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                ...dataToSave,
                contrat: {
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
                  smic: data.smicObj,
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));

            if (newV.employeur.adresse.commune.value)
              setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.commune"));
            if (newV.employeur.adresse.departement.value)
              setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.departement"));
            if (newV.employeur.adresse.region.value)
              setFieldsErrored((errors) => errors.filter((e) => e.path !== "employeur.adresse.region"));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAdresseCodePostal,
      employeurAdresseCommune,
      employeurAdresseDepartement,
      employeurAdresseRegion,
      setEmployeurAdresseCodePostal,
      setEmployeurAdresseCommune,
      setEmployeurAdresseDepartement,
      setEmployeurAdresseRegion,
      dossier?._id,
      cerfa?.id,
      setPartEmployeurCompletionAtom,
      setFieldsErrored,
      setRemunerations,
    ]
  );

  const onSubmittedEmployeurAdresseCommune = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.commune") {
          const newV = {
            employeur: {
              adresse: {
                commune: {
                  ...employeurAdresseCommune,
                  value: data,
                },
              },
            },
          };
          if (employeurAdresseCommune.value !== newV.employeur.adresse.commune.value) {
            setEmployeurAdresseCommune(newV.employeur.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                adresse: {
                  commune: newV.employeur.adresse.commune.value.trim(),
                },
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAdresseCommune,
      setEmployeurAdresseCommune,
      dossier?._id,
      cerfa?.id,
      setPartEmployeurCompletionAtom,
      setFieldsErrored,
    ]
  );
  const onSubmittedEmployeurAdresseDepartement = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.departement") {
          const newV = {
            employeur: {
              adresse: {
                departement: {
                  ...employeurAdresseDepartement,
                  value: data.departement,
                },
              },
            },
          };
          if (employeurAdresseDepartement.value !== newV.employeur.adresse.departement.value) {
            setEmployeurAdresseDepartement(newV.employeur.adresse.departement);

            let dataToSave = {
              employeur: {
                adresse: {
                  departement: newV.employeur.adresse.departement.value,
                },
              },
            };
            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                ...dataToSave,
                contrat: {
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
                  smic: data.smicObj,
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAdresseDepartement,
      setEmployeurAdresseDepartement,
      dossier?._id,
      cerfa?.id,
      setPartEmployeurCompletionAtom,
      setFieldsErrored,
      setRemunerations,
    ]
  );

  const onSubmittedEmployeurAdresseRegion = useCallback(
    async (path, data) => {
      try {
        if (path === "employeur.adresse.region") {
          const newV = {
            employeur: {
              adresse: {
                region: {
                  ...employeurAdresseRegion,
                  value: data,
                },
              },
            },
          };
          if (employeurAdresseRegion.value !== newV.employeur.adresse.region.value) {
            setEmployeurAdresseRegion(newV.employeur.adresse.region);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                adresse: {
                  region: newV.employeur.adresse.region.value,
                },
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      employeurAdresseRegion,
      setEmployeurAdresseRegion,
      dossier?._id,
      cerfa?.id,
      setPartEmployeurCompletionAtom,
      setFieldsErrored,
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
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurTypeEmployeur,
      setEmployeurTypeEmployeur,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
  );

  const onSubmittedEmployeurEmployeurSpecifique = useCallback(
    async (path, data) => {
      console.log(data);
      try {
        if (path === "employeur.employeurSpecifique") {
          const newV = {
            employeur: {
              employeurSpecifique: {
                ...employeurEmployeurSpecifique,
                value: data,
              },
            },
          };

          if (employeurEmployeurSpecifique.value !== newV.employeur.employeurSpecifique.value) {
            setEmployeurEmployeurSpecifique(newV.employeur.employeurSpecifique);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                employeurSpecifique: convertOptionToValue(newV.employeur.employeurSpecifique) || 0,
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
                value: data.nombreDeSalaries,
              },
            },
          };
          if (employeurNombreDeSalaries.value !== newV.employeur.nombreDeSalaries.value) {
            setEmployeurNombreDeSalaries(newV.employeur.nombreDeSalaries);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                nombreDeSalaries: normalizeInputNumberForDb(newV.employeur.nombreDeSalaries.value),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurNombreDeSalaries,
      setEmployeurNombreDeSalaries,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
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
              },
            },
          };
          if (employeurLibelleIdcc.value !== newV.employeur.libelleIdcc.value) {
            setEmployeurLibelleIdcc(newV.employeur.libelleIdcc);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                libelleIdcc: newV.employeur.libelleIdcc.value.trim(),
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
              },
            },
          };
          if (employeurCaisseComplementaire.value !== newV.employeur.caisseComplementaire.value) {
            setEmployeurCaisseComplementaire(newV.employeur.caisseComplementaire);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                caisseComplementaire: newV.employeur.caisseComplementaire.value.trim(),
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
                value: data || "",
              },
            },
          };
          if (employeurTelephone.value !== newV.employeur.telephone.value) {
            setEmployeurTelephone(newV.employeur.telephone);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                telephone: newV.employeur.telephone.value !== "" ? `+${newV.employeur.telephone.value}` : null,
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurTelephone,
      setEmployeurTelephone,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
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
              },
            },
          };
          if (employeurCourriel.value !== newV.employeur.courriel.value) {
            setEmployeurCourriel(newV.employeur.courriel);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              employeur: {
                courriel: newV.employeur.courriel.value.trim(),
              },
            });
            setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, employeurCourriel, setEmployeurCourriel, setFieldsErrored, setPartEmployeurCompletionAtom]
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
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      employeurRegimeSpecifique,
      setEmployeurRegimeSpecifique,
      setFieldsErrored,
      setPartEmployeurCompletionAtom,
    ]
  );

  const validation = useCallback(
    (action) => {
      const fields = [
        employeurSiret,
        employeurDenomination,
        employeurNaf,
        employeurNombreDeSalaries,
        employeurCodeIdcc,
        employeurCourriel,
        employeurTelephone,
        employeurAdresseVoie,
        employeurAdresseCodePostal,
        employeurAdresseCommune,
        employeurAdresseDepartement,
        employeurAdresseRegion,
        employeurTypeEmployeur,
        employeurRegimeSpecifique,
      ];

      const setterFields = [
        setEmployeurSiret,
        setEmployeurDenomination,
        setEmployeurNaf,
        setEmployeurNombreDeSalaries,
        setEmployeurCodeIdcc,
        setEmployeurTelephone,
        setEmployeurCourriel,
        setEmployeurAdresseVoie,
        setEmployeurAdresseCodePostal,
        setEmployeurAdresseCommune,
        setEmployeurAdresseDepartement,
        setEmployeurAdresseRegion,
        setEmployeurTypeEmployeur,
        setEmployeurRegimeSpecifique,
      ];

      fieldsChecker({
        action,
        fields,
        setterFields,
        setFieldsErrored,
        setIsValidating,
        resetCheckFields,
        fieldsValided,
        setFieldsValided,
        fieldsErrored,
      });
    },
    [
      employeurAdresseCodePostal,
      employeurAdresseCommune,
      employeurAdresseDepartement,
      employeurAdresseRegion,
      employeurAdresseVoie,
      employeurCodeIdcc,
      employeurCourriel,
      employeurDenomination,
      employeurNaf,
      employeurNombreDeSalaries,
      employeurRegimeSpecifique,
      employeurSiret,
      employeurTelephone,
      employeurTypeEmployeur,
      fieldsErrored,
      fieldsValided,
      resetCheckFields,
      setEmployeurAdresseCodePostal,
      setEmployeurAdresseCommune,
      setEmployeurAdresseDepartement,
      setEmployeurAdresseRegion,
      setEmployeurAdresseVoie,
      setEmployeurCodeIdcc,
      setEmployeurCourriel,
      setEmployeurDenomination,
      setEmployeurNaf,
      setEmployeurNombreDeSalaries,
      setEmployeurRegimeSpecifique,
      setEmployeurSiret,
      setEmployeurTelephone,
      setEmployeurTypeEmployeur,
      setFieldsErrored,
      setFieldsValided,
      setIsValidating,
    ]
  );

  const setAll = useCallback(
    (res) => {
      const {
        employeur: {
          siret,
          denomination,
          raison_sociale,
          naf,
          nombreDeSalaries,
          codeIdcc,
          libelleIdcc,
          telephone,
          courriel,
          adresse,
          nom,
          prenom,
          typeEmployeur,
          employeurSpecifique,
          caisseComplementaire,
          regimeSpecifique,
          attestationPieces,
          privePublic,
        },
      } = res;
      setEmployeurSiret({ ...siret, setField: setEmployeurSiret, errored: null });
      setEmployeurDenomination({
        ...denomination,
        setField: setEmployeurDenomination,
        errored: null,
      });
      setEmployeurRaisonSociale(raison_sociale);
      setEmployeurNaf({ ...naf, setField: setEmployeurNaf, errored: null });
      setEmployeurNombreDeSalaries({
        ...nombreDeSalaries,
        setField: setEmployeurNombreDeSalaries,
        errored: null,
      });
      setEmployeurCodeIdcc({ ...codeIdcc, setField: setEmployeurCodeIdcc, errored: null });

      const codeIdccSpecial = convertValueToOption({
        ...employeurCodeIdccSpecial,
        value: `${codeIdcc.value}`,
      });
      setEmployeurCodeIdccSpecial({ ...codeIdccSpecial, locked: siret.value === "" });

      setEmployeurLibelleIdcc(libelleIdcc);
      setEmployeurTelephone({
        ...telephone,
        value: telephone.value.replace("+", ""),
        setField: setEmployeurTelephone,
        errored: null,
      });
      setEmployeurCourriel({ ...courriel, setField: setEmployeurCourriel, errored: null });

      setEmployeurAdresseNumero(adresse.numero);
      setEmployeurAdresseVoie({
        ...adresse.voie,
        setField: setEmployeurAdresseVoie,
        errored: null,
      });
      setEmployeurAdresseComplement(adresse.complement);
      setEmployeurAdresseCodePostal({
        ...adresse.codePostal,
        setField: setEmployeurAdresseCodePostal,
        errored: null,
      });
      setEmployeurAdresseCommune({
        ...adresse.commune,
        setField: setEmployeurAdresseCommune,
        errored: null,
      });
      setEmployeurAdresseDepartement({
        ...adresse.departement,
        setField: setEmployeurAdresseDepartement,
        errored: null,
      });
      setEmployeurAdresseRegion({
        ...adresse.region,
        setField: setEmployeurAdresseRegion,
        errored: null,
      });

      setEmployeurNom(nom);
      setEmployeurPrenom(prenom);
      setEmployeurTypeEmployeur({
        ...convertValueToMultipleSelectOption(typeEmployeur),
        setField: setEmployeurTypeEmployeur,
        errored: null,
      });
      setEmployeurEmployeurSpecifique(convertValueToOption(employeurSpecifique));
      setEmployeurCaisseComplementaire(caisseComplementaire);
      setEmployeurRegimeSpecifique({
        ...convertValueToOption(regimeSpecifique),
        setField: setEmployeurRegimeSpecifique,
        errored: null,
      });
      setEmployeurAttestationPieces(convertValueToOption(attestationPieces));

      setEmployeurPrivePublic(convertValueToOption(privePublic));

      setPartEmployeurCompletionAtom(cerfaEmployeurCompletion(res));
    },
    [
      employeurCodeIdccSpecial,
      setEmployeurAdresseCodePostal,
      setEmployeurAdresseCommune,
      setEmployeurAdresseComplement,
      setEmployeurAdresseDepartement,
      setEmployeurAdresseNumero,
      setEmployeurAdresseRegion,
      setEmployeurAdresseVoie,
      setEmployeurAttestationPieces,
      setEmployeurCaisseComplementaire,
      setEmployeurCodeIdcc,
      setEmployeurCodeIdccSpecial,
      setEmployeurCourriel,
      setEmployeurDenomination,
      setEmployeurEmployeurSpecifique,
      setEmployeurLibelleIdcc,
      setEmployeurNaf,
      setEmployeurNom,
      setEmployeurNombreDeSalaries,
      setEmployeurPrenom,
      setEmployeurPrivePublic,
      setEmployeurRaisonSociale,
      setEmployeurRegimeSpecifique,
      setEmployeurSiret,
      setEmployeurTelephone,
      setEmployeurTypeEmployeur,
      setPartEmployeurCompletionAtom,
    ]
  );

  useEffect(() => {
    if (cerfa && isLoading) {
      setAll(cerfa);
      setIsLoading(false);
    }
    if (isValidating) {
      validation("check");
    }
  }, [cerfa, isLoading, isValidating, setAll, validation, setIsLoading]);

  return {
    isLoading,
    //
    validation,
    resetCheckFields,
    fieldsErrored,
    //
    completion: partEmployeurCompletion,
    get: {
      employeur: {
        siret: employeurSiret,
        denomination: employeurDenomination,
        raison_sociale: employeurRaisonSociale,
        naf: employeurNaf,
        nombreDeSalaries: employeurNombreDeSalaries,
        codeIdcc: employeurCodeIdcc,
        codeIdccSpecial: employeurCodeIdccSpecial,
        libelleIdcc: employeurLibelleIdcc,
        telephone: employeurTelephone,
        courriel: employeurCourriel,
        adresse: {
          numero: employeurAdresseNumero,
          voie: employeurAdresseVoie,
          complement: employeurAdresseComplement,
          codePostal: employeurAdresseCodePostal,
          commune: employeurAdresseCommune,
          departement: employeurAdresseDepartement,
          region: employeurAdresseRegion,
        },
        nom: employeurNom, //
        prenom: employeurPrenom, //
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
        denomination: onSubmittedEmployeurDenomination,
        naf: onSubmittedEmployeurNaf,
        typeEmployeur: onSubmittedEmployeurTypeEmployeur,
        employeurSpecifique: onSubmittedEmployeurEmployeurSpecifique,
        nombreDeSalaries: onSubmittedEmployeurNombreDeSalaries,
        codeIdcc: onSubmittedEmployeurCodeIdcc,
        codeIdccSpecial: onSubmittedEmployeurCodeIdccSpecial,
        libelleIdcc: onSubmittedEmployeurLibelleIdcc,
        caisseComplementaire: onSubmittedEmployeurCaisseComplementaire,
        telephone: onSubmittedEmployeurTelephone,
        courriel: onSubmittedEmployeurCourriel,
        regimeSpecifique: onSubmittedEmployeurRegimeSpecifique,
        adresse: {
          numero: onSubmittedEmployeurAdresseNumero,
          voie: onSubmittedEmployeurAdresseVoie,
          complement: onSubmittedEmployeurAdresseComplement,
          codePostal: onSubmittedEmployeurAdresseCodePostal,
          commune: onSubmittedEmployeurAdresseCommune,
          departement: onSubmittedEmployeurAdresseDepartement,
          region: onSubmittedEmployeurAdresseRegion,
        },
      },
    },
  };
}

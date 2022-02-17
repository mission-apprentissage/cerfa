/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import {
  useCallback,
  useEffect,
  // useState
} from "react";
import { DateTime } from "luxon";
import { _post } from "../../../httpClient";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  convertValueToOption,
  convertOptionToValue,
  fieldCompletionPercentage,
  convertMultipleSelectOptionToValue,
  convertValueToMultipleSelectOption,
  convertValueToDate,
  convertDateToValue,
  normalizeInputNumberForDb,
  doAsyncCodePostalActions,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as formationAtoms from "./useCerfaFormationAtoms";

export const CerfaFormationController = async (dossier) => {
  return {
    formation: {
      rncp: {
        doAsyncActions: async (value, data) => {
          try {
            const response = await _post(`/api/v1/cfdrncp`, {
              rncp: value,
              dossierId: dossier._id,
            });
            // TODO All cases
            if (response.messages.code_rncp === "Ok") {
              if (response.result.active_inactive === "INACTIVE") {
                return {
                  successed: false,
                  data: null,
                  message: `Le code ${value} est inactif.`,
                };
              }
              if (!response.result.cfds) {
                return {
                  successed: true,
                  data: {
                    cfd: "",
                    rncp: response.result.code_rncp,
                    intitule_diplome: response.result.intitule_diplome,
                  },
                  message: null,
                };
              }
              if (response.result.cfds.length > 1) {
                return {
                  successed: true,
                  // data: null,
                  // TODO Handle true but Error
                  data: {
                    // cfd: data.value || "",
                    cfd: response.result.cfds.join(","),
                    rncp: response.result.code_rncp,
                    intitule_diplome: response.result.intitule_diplome,
                  },
                  message: null,
                  // message: `La fiche ${value} retourne plusieurs Codes diplômes. Veuillez en choisir un seul dans la liste suivant: ${response.result.cfds.join(
                  //   " , "
                  // )}`,
                };
              }
              return {
                successed: true,
                data: {
                  cfd: response.result.cfds[0] || "",
                  rncp: response.result.code_rncp,
                  intitule_diplome: response.result.intitule_diplome,
                },
                message: null,
              };
            }
            return {
              successed: false,
              data: null,
              message: response.messages.code_rncp,
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
      codeDiplome: {
        doAsyncActions: async (value) => {
          try {
            const response = await _post(`/api/v1/cfdrncp`, {
              cfd: value,
              dossierId: dossier._id,
            });
            // TODO outdated cfd
            if (response.messages.rncp.code_rncp === "Ok") {
              return {
                successed: true,
                data: {
                  cfd: response.result.cfd,
                  rncp: response.result.rncp.code_rncp,
                  intitule_diplome: response.result.rncp.intitule_diplome,
                },
                message: null,
              };
            }
            return {
              successed: true,
              data: {
                cfd: response.result.cfd,
                rncp: "",
                intitule_diplome: "", // response.result.intitule_long,
              },
              // message: response.messages.rncp.code_rncp,
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
      dateDebutFormation: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateDebutFormation = DateTime.fromISO(value).setLocale("fr-FR");
          let dureeFormationCalc = 0;

          if (data.dateFinFormation) {
            const dateFinFormation = DateTime.fromISO(data.dateFinFormation).setLocale("fr-FR");
            const diffInMonths = dateFinFormation.diff(dateDebutFormation, "months");
            dureeFormationCalc = diffInMonths.months;
          }

          if (data.dateFinFormation) {
            const dateFinFormation = DateTime.fromISO(data.dateFinFormation).setLocale("fr-FR");
            if (dateDebutFormation >= dateFinFormation) {
              return {
                successed: false,
                data: null,
                message: "Date de début du cycle de formation ne peut pas être après la date de fin du cycle",
              };
            }
          }

          if (data.dateFinFormation) {
            if (dureeFormationCalc < 6) {
              return {
                successed: false,
                data: null,
                message: "La durée de la formation de peut pas être inférieure à 6 mois",
              };
            }
          }

          if (data.dateFinFormation) {
            if (dureeFormationCalc > 48) {
              return {
                successed: false,
                data: null,
                message: "La durée de la formation de peut pas être supérieure à 4 ans",
              };
            }
          }

          if (data.contratDateDebutContrat) {
            const dateDebutContrat = DateTime.fromISO(data.contratDateDebutContrat).setLocale("fr-FR");
            if (dateDebutContrat < dateDebutFormation.minus({ months: 3 })) {
              return {
                successed: false,
                data: null,
                message:
                  "Le contrat peut commencer au maximum 3 mois avant le début de la formation (merci de vous vérifier la date de début de contrat)",
              };
            }
          }

          return {
            successed: true,
            data: value,
            message: null,
          };
        },
      },
      dateFinFormation: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateFinFormation = DateTime.fromISO(value).setLocale("fr-FR");
          let dureeFormationCalc = 0;

          if (data.dateDebutFormation) {
            const dateDebutFormation = DateTime.fromISO(data.dateDebutFormation).setLocale("fr-FR");
            const diffInMonths = dateFinFormation.diff(dateDebutFormation, "months");
            dureeFormationCalc = diffInMonths.months;
          }

          if (data.dateDebutFormation) {
            const dateDebutFormation = DateTime.fromISO(data.dateDebutFormation).setLocale("fr-FR");
            if (dateDebutFormation >= dateFinFormation) {
              return {
                successed: false,
                data: null,
                message: "Date de fin du cycle de formation ne peut pas être avant la date de début du cycle",
              };
            }
          }

          if (data.dateDebutFormation) {
            if (dureeFormationCalc < 6) {
              return {
                successed: false,
                data: null,
                message: "La durée de la formation de peut pas être inférieure à 6 mois",
              };
            }
          }

          if (data.dateDebutFormation) {
            if (dureeFormationCalc > 48) {
              return {
                successed: false,
                data: null,
                message: "La durée de la formation de peut pas être supérieure à 4 ans",
              };
            }
          }

          if (data.contratDateFinContrat) {
            const dateFinContrat = DateTime.fromISO(data.contratDateFinContrat).setLocale("fr-FR");
            if (dateFinContrat > dateFinFormation.plus({ months: 3 })) {
              return {
                successed: false,
                data: null,
                message:
                  "Le contrat peut se terminer au maximum 3 mois après la fin de la formation (merci de vous vérifier la date de fin de contrat)",
              };
            }
          }

          return {
            successed: true,
            data: value,
            message: null,
          };
        },
      },
      dureeFormation: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (parseInt(value) > 9999) {
            return {
              successed: false,
              data: null,
              message: "la durée de la formation ne peut excéder 9999",
            };
          }

          return {
            successed: true,
            data: {
              dureeFormation: value,
            },
            message: null,
          };
        },
      },
    },
    organismeFormation: {
      siret: {
        doAsyncActions: async (value) => {
          const response = await _post(`/api/v1/siret`, {
            siret: value,
            dossierId: dossier._id,
            organismeFormation: true,
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

          if (response.result.api_entreprise === "KO") {
            return {
              warning: true,
              data: response.result,
              message: `Le service de récupération des informations Siret est momentanément indisponible. Nous ne pouvons pas pre-remplir tous les champs reliées.`,
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
      adresse: {
        codePostal: {
          doAsyncActions: async (value, data) => {
            return await doAsyncCodePostalActions(value, data, dossier._id);
          },
        },
      },
    },
    etablissementFormation: {
      siret: {
        doAsyncActions: async (value) => {
          if (value === "") {
            return {
              successed: true,
              data: {
                siret: "",
              },
              message: null,
            };
          }

          const response = await _post(`/api/v1/siret`, {
            siret: value,
            dossierId: dossier._id,
            organismeFormation: true,
          });

          // await _put("/api/v1/history", {
          //   // TODO
          //   dossierId: "619baec6fcdd030ba4e13c40",
          //   context: "etablissementFormation.siret",
          //   from: "98765432400070",
          //   to: values["etablissementFormation.siret"],
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

          if (response.result.api_entreprise === "KO") {
            return {
              warning: true,
              data: response.result,
              message: `Le service de récupération des informations Siret est momentanément indisponible. Nous ne pouvons pas pre-remplir tous les champs reliées.`,
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
      adresse: {
        codePostal: {
          doAsyncActions: async (value, data) => {
            return await doAsyncCodePostalActions(value, data, dossier._id);
          },
        },
      },
    },
  };
};

export const cerfaFormationCompletion = (res) => {
  let fieldsToKeep = {
    organismeFormationSiret: res.organismeFormation.siret,
    organismeFormationDenomination: res.organismeFormation.denomination,
    organismeFormationUaiCfa: res.organismeFormation.uaiCfa,
    organismeFormationAdresseVoie: res.organismeFormation.adresse.voie,
    organismeFormationAdresseCodePostal: res.organismeFormation.adresse.codePostal,
    organismeFormationAdresseCommune: res.organismeFormation.adresse.commune,
    formationRncp: res.formation.rncp,
    formationCodeDiplome: res.formation.codeDiplome,
    formationDateDebutFormation: res.formation.dateDebutFormation,
    formationDateFinFormation: res.formation.dateFinFormation,
    formationDureeFormation: res.formation.dureeFormation,
    formationIntituleQualification: res.formation.intituleQualification,
    formationTypeDiplome: res.formation.typeDiplome,
    etablissementFormationMemeResponsable: res.etablissementFormation.memeResponsable,
  };
  let countFields = 14;
  const etablissementFormationMemeResponsable = res.etablissementFormation.memeResponsable.value;

  if (!etablissementFormationMemeResponsable) {
    fieldsToKeep = {
      ...fieldsToKeep,
      etablissementFormationDenomination: res.etablissementFormation.denomination,
      etablissementFormationAdresseVoie: res.etablissementFormation.adresse.voie,
      etablissementFormationAdresseCodePostal: res.etablissementFormation.adresse.codePostal,
      etablissementFormationAdresseCommune: res.etablissementFormation.adresse.commune,
    };
    countFields = countFields + 4;
  }

  return fieldCompletionPercentage(fieldsToKeep, countFields);
};

export function useCerfaFormation() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [partFormationCompletion, setPartFormationCompletionAtom] = useRecoilState(
    formationAtoms.cerfaPartFormationCompletionAtom
  );
  const [isLoading, setIsLoading] = useRecoilState(formationAtoms.cerfaPartFormationIsLoadingAtom);

  const [organismeFormationSiret, setOrganismeFormationSiret] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationSiretAtom
  );
  const [organismeFormationDenomination, setOrganismeFormationDenomination] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationDenominationAtom
  );
  const [organismeFormationFormationInterne, setOrganismeFormationFormationInterne] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationFormationInterneAtom
  );
  const [organismeFormationUaiCfa, setOrganismeFormationUaiCfa] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationUaiCfaAtom
  );
  const [organismeFormationAdresseNumero, setOrganismeFormationAdresseNumero] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationAdresseNumeroAtom
  );
  const [organismeFormationAdresseVoie, setOrganismeFormationAdresseVoie] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationAdresseVoieAtom
  );
  const [organismeFormationAdresseComplement, setOrganismeFormationAdresseComplement] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationAdresseComplementAtom
  );
  const [organismeFormationAdresseCodePostal, setOrganismeFormationAdresseCodePostal] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationAdresseCodePostalAtom
  );
  const [organismeFormationAdresseCommune, setOrganismeFormationAdresseCommune] = useRecoilState(
    formationAtoms.cerfaOrganismeFormationAdresseCommuneAtom
  );

  const [etablissementFormationMemeResponsable, setEtablissementFormationMemeResponsable] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationMemeResponsableAtom
  );

  const [etablissementFormationSiret, setEtablissementFormationSiret] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationSiretAtom
  );
  const [etablissementFormationDenomination, setEtablissementFormationDenomination] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationDenominationAtom
  );
  const [etablissementFormationUaiCfa, setEtablissementFormationUaiCfa] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationUaiCfaAtom
  );
  const [etablissementFormationAdresseNumero, setEtablissementFormationAdresseNumero] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationAdresseNumeroAtom
  );
  const [etablissementFormationAdresseVoie, setEtablissementFormationAdresseVoie] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationAdresseVoieAtom
  );
  const [etablissementFormationAdresseComplement, setEtablissementFormationAdresseComplement] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationAdresseComplementAtom
  );
  const [etablissementFormationAdresseCodePostal, setEtablissementFormationAdresseCodePostal] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationAdresseCodePostalAtom
  );
  const [etablissementFormationAdresseCommune, setEtablissementFormationAdresseCommune] = useRecoilState(
    formationAtoms.cerfaEtablissementFormationAdresseCommuneAtom
  );

  const [formationRncp, setFormationRncp] = useRecoilState(formationAtoms.cerfaFormationRncpAtom);
  const [formationCodeDiplome, setFormationCodeDiplome] = useRecoilState(formationAtoms.cerfaFormationCodeDiplomeAtom);
  const [formationDateDebutFormation, setFormationDateDebutFormation] = useRecoilState(
    formationAtoms.cerfaFormationDateDebutFormationAtom
  );
  const [formationDateFinFormation, setFormationDateFinFormation] = useRecoilState(
    formationAtoms.cerfaFormationDateFinFormationAtom
  );
  const [formationDureeFormationCalc, setFormationDureeFormationCalc] = useRecoilState(
    formationAtoms.cerfaFormationDureeFormationCalcAtom
  );
  const [formationDureeFormation, setFormationDureeFormation] = useRecoilState(
    formationAtoms.cerfaFormationDureeFormationAtom
  );
  const [formationIntituleQualification, setFormationIntituleQualification] = useRecoilState(
    formationAtoms.cerfaFormationIntituleQualificationAtom
  );
  const [formationTypeDiplome, setFormationTypeDiplome] = useRecoilState(formationAtoms.cerfaFormationTypeDiplomeAtom);

  const onSubmittedOrganismeFormationSiret = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.siret") {
          const newV = {
            organismeFormation: {
              siret: {
                ...organismeFormationSiret,
                value: data.siret,
              },
              denomination: {
                ...organismeFormationDenomination,
                value: data.enseigne || data.entreprise_raison_sociale,
                locked: false,
              },
              uaiCfa: {
                ...organismeFormationUaiCfa,
                value: data.uai || "",
                locked: false,
              },
              adresse: {
                numero: {
                  ...organismeFormationAdresseNumero,
                  value: data.numero_voie || "", //parseInt(data.numero_voie),
                  locked: false,
                },
                voie: {
                  ...organismeFormationAdresseVoie,
                  value:
                    data.type_voie || data.nom_voie
                      ? `${data.type_voie ? `${data.type_voie} ` : ""}${data.nom_voie}`
                      : "",
                  locked: false,
                },
                complement: {
                  ...organismeFormationAdresseComplement,
                  value: data.complement_adresse || "",
                  locked: false,
                },
                codePostal: { ...organismeFormationAdresseCodePostal, value: data.code_postal || "", locked: false },
                commune: {
                  ...organismeFormationAdresseCommune,
                  value: data.commune_implantation_nom || "",
                  locked: false,
                },
              },
            },
          };

          setOrganismeFormationSiret(newV.organismeFormation.siret);
          setOrganismeFormationDenomination(newV.organismeFormation.denomination);
          setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);
          setOrganismeFormationAdresseNumero(newV.organismeFormation.adresse.numero);
          setOrganismeFormationAdresseVoie(newV.organismeFormation.adresse.voie);
          setOrganismeFormationAdresseComplement(newV.organismeFormation.adresse.complement);
          setOrganismeFormationAdresseCodePostal(newV.organismeFormation.adresse.codePostal);
          setOrganismeFormationAdresseCommune(newV.organismeFormation.adresse.commune);

          let dataToSave = {
            organismeFormation: {
              siret: newV.organismeFormation.siret.value,
              denomination: newV.organismeFormation.denomination.value,
              uaiCfa: newV.organismeFormation.uaiCfa.value || null,
              adresse: {
                numero: normalizeInputNumberForDb(newV.organismeFormation.adresse.numero.value),
                voie: newV.organismeFormation.adresse.voie.value.trim(),
                complement: newV.organismeFormation.adresse.complement.value.trim(),
                codePostal: newV.organismeFormation.adresse.codePostal.value.trim(),
                commune: newV.organismeFormation.adresse.commune.value.trim(),
              },
            },
          };
          if (convertOptionToValue(etablissementFormationMemeResponsable)) {
            dataToSave = {
              ...dataToSave,
              etablissementFormation: {
                siret: newV.organismeFormation.siret.value,
                denomination: newV.organismeFormation.denomination.value,
                uaiCfa: newV.organismeFormation.uaiCfa.value || null,
                adresse: {
                  numero: normalizeInputNumberForDb(newV.organismeFormation.adresse.numero.value),
                  voie: newV.organismeFormation.adresse.voie.value.trim(),
                  complement: newV.organismeFormation.adresse.complement.value.trim(),
                  codePostal: newV.organismeFormation.adresse.codePostal.value.trim(),
                  commune: newV.organismeFormation.adresse.commune.value.trim(),
                },
              },
            };
          }

          const res = await saveCerfa(dossier?._id, cerfa?.id, {
            ...dataToSave,
            isLockedField: {
              organismeFormation: {
                denomination: false,
                uaiCfa: false,
                adresse: {
                  numero: false,
                  voie: false,
                  complement: false,
                  codePostal: false,
                  commune: false,
                },
              },
            },
          });
          setPartFormationCompletionAtom(cerfaFormationCompletion(res));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      organismeFormationSiret,
      organismeFormationDenomination,
      organismeFormationUaiCfa,
      organismeFormationAdresseNumero,
      organismeFormationAdresseVoie,
      organismeFormationAdresseComplement,
      organismeFormationAdresseCodePostal,
      organismeFormationAdresseCommune,
      setOrganismeFormationSiret,
      setOrganismeFormationDenomination,
      setOrganismeFormationUaiCfa,
      setOrganismeFormationAdresseNumero,
      setOrganismeFormationAdresseVoie,
      setOrganismeFormationAdresseComplement,
      setOrganismeFormationAdresseCodePostal,
      setOrganismeFormationAdresseCommune,
      etablissementFormationMemeResponsable,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationDenomination = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.denomination") {
          const newV = {
            organismeFormation: {
              denomination: {
                ...organismeFormationDenomination,
                value: data,
              },
            },
          };
          if (organismeFormationDenomination.value !== newV.organismeFormation.denomination.value) {
            setOrganismeFormationDenomination(newV.organismeFormation.denomination);

            let dataToSave = {
              organismeFormation: {
                denomination: newV.organismeFormation.denomination.value,
              },
            };
            if (convertOptionToValue(etablissementFormationMemeResponsable)) {
              dataToSave = {
                ...dataToSave,
                etablissementFormation: {
                  denomination: newV.organismeFormation.denomination.value,
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      etablissementFormationMemeResponsable,
      organismeFormationDenomination,
      setOrganismeFormationDenomination,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationAdresseNumero = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.adresse.numero") {
          const newV = {
            organismeFormation: {
              adresse: {
                numero: {
                  ...organismeFormationAdresseNumero,
                  value: data,
                },
              },
            },
          };
          if (organismeFormationAdresseNumero.value !== newV.organismeFormation.adresse.numero.value) {
            setOrganismeFormationAdresseNumero(newV.organismeFormation.adresse.numero);

            let dataToSave = {
              organismeFormation: {
                adresse: {
                  numero: normalizeInputNumberForDb(data),
                },
              },
            };
            if (convertOptionToValue(etablissementFormationMemeResponsable)) {
              dataToSave = {
                ...dataToSave,
                etablissementFormation: {
                  adresse: {
                    numero: normalizeInputNumberForDb(data),
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      organismeFormationAdresseNumero,
      setOrganismeFormationAdresseNumero,
      etablissementFormationMemeResponsable,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationAdresseVoie = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.adresse.voie") {
          const newV = {
            organismeFormation: {
              adresse: {
                voie: {
                  ...organismeFormationAdresseVoie,
                  value: data,
                },
              },
            },
          };
          if (organismeFormationAdresseVoie.value !== newV.organismeFormation.adresse.voie.value) {
            setOrganismeFormationAdresseVoie(newV.organismeFormation.adresse.voie);

            let dataToSave = {
              organismeFormation: {
                adresse: {
                  voie: newV.organismeFormation.adresse.voie.value,
                },
              },
            };
            if (convertOptionToValue(etablissementFormationMemeResponsable)) {
              dataToSave = {
                ...dataToSave,
                etablissementFormation: {
                  adresse: {
                    voie: newV.organismeFormation.adresse.voie.value,
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      organismeFormationAdresseVoie,
      setOrganismeFormationAdresseVoie,
      etablissementFormationMemeResponsable,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationAdresseComplement = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.adresse.complement") {
          const newV = {
            organismeFormation: {
              adresse: {
                complement: {
                  ...organismeFormationAdresseComplement,
                  value: data,
                },
              },
            },
          };
          if (organismeFormationAdresseComplement.value !== newV.organismeFormation.adresse.complement.value) {
            setOrganismeFormationAdresseComplement(newV.organismeFormation.adresse.complement);

            let dataToSave = {
              organismeFormation: {
                adresse: {
                  complement: newV.organismeFormation.adresse.complement.value,
                },
              },
            };
            if (convertOptionToValue(etablissementFormationMemeResponsable)) {
              dataToSave = {
                ...dataToSave,
                etablissementFormation: {
                  adresse: {
                    complement: newV.organismeFormation.adresse.complement.value,
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      organismeFormationAdresseComplement,
      setOrganismeFormationAdresseComplement,
      etablissementFormationMemeResponsable,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationAdresseCodePostal = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.adresse.codePostal") {
          const newV = {
            organismeFormation: {
              adresse: {
                codePostal: {
                  ...organismeFormationAdresseCodePostal,
                  value: data.codePostal,
                },
                commune: {
                  ...organismeFormationAdresseCommune,
                  value: data.commune,
                },
              },
            },
          };
          if (organismeFormationAdresseCodePostal.value !== newV.organismeFormation.adresse.codePostal.value) {
            setOrganismeFormationAdresseCodePostal(newV.organismeFormation.adresse.codePostal);
            setOrganismeFormationAdresseCommune(newV.organismeFormation.adresse.commune);

            let dataToSave = {
              organismeFormation: {
                adresse: {
                  codePostal: newV.organismeFormation.adresse.codePostal.value,
                  commune: newV.organismeFormation.adresse.commune.value,
                },
              },
            };
            if (convertOptionToValue(etablissementFormationMemeResponsable)) {
              dataToSave = {
                ...dataToSave,
                etablissementFormation: {
                  adresse: {
                    codePostal: newV.organismeFormation.adresse.codePostal.value,
                    commune: newV.organismeFormation.adresse.commune.value,
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      organismeFormationAdresseCodePostal,
      organismeFormationAdresseCommune,
      setOrganismeFormationAdresseCodePostal,
      setOrganismeFormationAdresseCommune,
      etablissementFormationMemeResponsable,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationAdresseCommune = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.adresse.commune") {
          const newV = {
            organismeFormation: {
              adresse: {
                commune: {
                  ...organismeFormationAdresseCommune,
                  value: data,
                },
              },
            },
          };
          if (organismeFormationAdresseCommune.value !== newV.organismeFormation.adresse.commune.value) {
            setOrganismeFormationAdresseCommune(newV.organismeFormation.adresse.commune);

            let dataToSave = {
              organismeFormation: {
                adresse: {
                  commune: newV.organismeFormation.adresse.commune.value,
                },
              },
            };
            if (convertOptionToValue(etablissementFormationMemeResponsable)) {
              dataToSave = {
                ...dataToSave,
                etablissementFormation: {
                  adresse: {
                    commune: newV.organismeFormation.adresse.commune.value,
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      organismeFormationAdresseCommune,
      setOrganismeFormationAdresseCommune,
      etablissementFormationMemeResponsable,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationUaiCfa = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.uaiCfa") {
          const newV = {
            organismeFormation: {
              uaiCfa: {
                ...organismeFormationUaiCfa,
                value: data,
                locked: false,
              },
            },
          };
          setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);

          let dataToSave = {
            organismeFormation: {
              uaiCfa: newV.organismeFormation.uaiCfa.value || null,
            },
          };
          if (convertOptionToValue(etablissementFormationMemeResponsable)) {
            dataToSave = {
              ...dataToSave,
              etablissementFormation: {
                uaiCfa: newV.organismeFormation.uaiCfa.value || null,
              },
            };
          }

          const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
          setPartFormationCompletionAtom(cerfaFormationCompletion(res));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      etablissementFormationMemeResponsable,
      organismeFormationUaiCfa,
      setOrganismeFormationUaiCfa,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationMemeResponsable = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.memeResponsable") {
          const newV = {
            etablissementFormation: {
              memeResponsable: {
                ...etablissementFormationMemeResponsable,
                value: data,
              },
            },
          };
          if (etablissementFormationMemeResponsable.value !== newV.etablissementFormation.memeResponsable.value) {
            setEtablissementFormationMemeResponsable(newV.etablissementFormation.memeResponsable);
            const memeResponsable = convertOptionToValue(newV.etablissementFormation.memeResponsable);

            if (memeResponsable) {
              setEtablissementFormationSiret({ ...organismeFormationSiret, isNotRequiredForm: true, locked: false });
              setEtablissementFormationDenomination({ ...organismeFormationDenomination, locked: false });
              setEtablissementFormationUaiCfa({ ...organismeFormationUaiCfa, isNotRequiredForm: true, locked: false });
              setEtablissementFormationAdresseNumero({ ...organismeFormationAdresseNumero, locked: false });
              setEtablissementFormationAdresseVoie({ ...organismeFormationAdresseVoie, locked: false });
              setEtablissementFormationAdresseComplement({ ...organismeFormationAdresseComplement, locked: false });
              setEtablissementFormationAdresseCodePostal({ ...organismeFormationAdresseCodePostal, locked: false });
              setEtablissementFormationAdresseCommune({ ...organismeFormationAdresseCommune, locked: false });

              const res = await saveCerfa(dossier?._id, cerfa?.id, {
                etablissementFormation: {
                  memeResponsable,
                  siret: organismeFormationSiret.value || null,
                  denomination: organismeFormationDenomination.value || null,
                  uaiCfa: organismeFormationUaiCfa.value || null,
                  adresse: {
                    numero: normalizeInputNumberForDb(organismeFormationAdresseNumero.value),
                    voie: organismeFormationAdresseVoie.value || null,
                    complement: organismeFormationAdresseComplement.value || "",
                    codePostal: organismeFormationAdresseCodePostal.value || null,
                    commune: organismeFormationAdresseCommune.value || null,
                  },
                },
              });
              setPartFormationCompletionAtom(cerfaFormationCompletion(res));
            } else {
              const res = await saveCerfa(dossier?._id, cerfa?.id, {
                etablissementFormation: {
                  memeResponsable,
                  siret: etablissementFormationSiret.value || null,
                  denomination: etablissementFormationDenomination.value || null,
                  uaiCfa: etablissementFormationUaiCfa.value || null,
                  adresse: {
                    numero: normalizeInputNumberForDb(etablissementFormationAdresseNumero.value),
                    voie: etablissementFormationAdresseVoie.value || null,
                    complement: etablissementFormationAdresseComplement.value || "",
                    codePostal: etablissementFormationAdresseCodePostal.value || null,
                    commune: etablissementFormationAdresseCommune.value || null,
                  },
                },
              });
              setPartFormationCompletionAtom(cerfaFormationCompletion(res));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      etablissementFormationAdresseCodePostal?.value,
      etablissementFormationAdresseCommune?.value,
      etablissementFormationAdresseComplement?.value,
      etablissementFormationAdresseNumero?.value,
      etablissementFormationAdresseVoie?.value,
      etablissementFormationDenomination?.value,
      etablissementFormationMemeResponsable,
      etablissementFormationSiret?.value,
      etablissementFormationUaiCfa?.value,
      organismeFormationAdresseCodePostal,
      organismeFormationAdresseCommune,
      organismeFormationAdresseComplement,
      organismeFormationAdresseNumero,
      organismeFormationAdresseVoie,
      organismeFormationDenomination,
      organismeFormationSiret,
      organismeFormationUaiCfa,
      setEtablissementFormationAdresseCodePostal,
      setEtablissementFormationAdresseCommune,
      setEtablissementFormationAdresseComplement,
      setEtablissementFormationAdresseNumero,
      setEtablissementFormationAdresseVoie,
      setEtablissementFormationDenomination,
      setEtablissementFormationMemeResponsable,
      setEtablissementFormationSiret,
      setEtablissementFormationUaiCfa,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationSiret = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.siret") {
          let newV = null;
          let dataToSave = null;
          if (data.siret === "") {
            newV = {
              etablissementFormation: {
                siret: {
                  ...etablissementFormationSiret,
                  value: "",
                },
              },
            };
            setEtablissementFormationSiret(newV.etablissementFormation.siret);

            dataToSave = {
              etablissementFormation: {
                siret: "",
              },
            };
          } else {
            newV = {
              etablissementFormation: {
                siret: {
                  ...etablissementFormationSiret,
                  value: data.siret,
                },
                denomination: {
                  ...etablissementFormationDenomination,
                  value: data.enseigne || data.entreprise_raison_sociale,
                  locked: false,
                },
                uaiCfa: {
                  ...etablissementFormationUaiCfa,
                  value: data.uai || "",
                  locked: false,
                },
                adresse: {
                  numero: {
                    ...etablissementFormationAdresseNumero,
                    value: data.numero_voie || "",
                    locked: false,
                  },
                  voie: {
                    ...etablissementFormationAdresseVoie,
                    value:
                      data.type_voie || data.nom_voie
                        ? `${data.type_voie ? `${data.type_voie} ` : ""}${data.nom_voie}`
                        : "",
                    locked: false,
                  },
                  complement: {
                    ...etablissementFormationAdresseComplement,
                    value: data.complement_adresse || "",
                    locked: false,
                  },
                  codePostal: {
                    ...etablissementFormationAdresseCodePostal,
                    value: data.code_postal || "",
                    locked: false,
                  },
                  commune: {
                    ...etablissementFormationAdresseCommune,
                    value: data.commune_implantation_nom || "",
                    locked: false,
                  },
                },
              },
            };

            setEtablissementFormationSiret(newV.etablissementFormation.siret);
            setEtablissementFormationDenomination(newV.etablissementFormation.denomination);
            setEtablissementFormationUaiCfa(newV.etablissementFormation.uaiCfa);
            setEtablissementFormationAdresseNumero(newV.etablissementFormation.adresse.numero);
            setEtablissementFormationAdresseVoie(newV.etablissementFormation.adresse.voie);
            setEtablissementFormationAdresseComplement(newV.etablissementFormation.adresse.complement);
            setEtablissementFormationAdresseCodePostal(newV.etablissementFormation.adresse.codePostal);
            setEtablissementFormationAdresseCommune(newV.etablissementFormation.adresse.commune);

            dataToSave = {
              etablissementFormation: {
                siret: newV.etablissementFormation.siret.value,
                denomination: newV.etablissementFormation.denomination.value,
                uaiCfa: newV.etablissementFormation.uaiCfa.value || null,
                adresse: {
                  numero: normalizeInputNumberForDb(newV.etablissementFormation.adresse.numero.value),
                  voie: newV.etablissementFormation.adresse.voie.value.trim(),
                  complement: newV.etablissementFormation.adresse.complement.value.trim(),
                  codePostal: newV.etablissementFormation.adresse.codePostal.value.trim(),
                  commune: newV.etablissementFormation.adresse.commune.value.trim(),
                },
              },
            };
          }
          const res = await saveCerfa(dossier?._id, cerfa?.id, {
            ...dataToSave,
            isLockedField: {
              etablissementFormation: {
                denomination: false,
                uaiCfa: false,
                adresse: {
                  numero: false,
                  voie: false,
                  complement: false,
                  codePostal: false,
                  commune: false,
                },
              },
            },
          });
          setPartFormationCompletionAtom(cerfaFormationCompletion(res));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      etablissementFormationSiret,
      etablissementFormationDenomination,
      etablissementFormationUaiCfa,
      etablissementFormationAdresseNumero,
      etablissementFormationAdresseVoie,
      etablissementFormationAdresseComplement,
      etablissementFormationAdresseCodePostal,
      etablissementFormationAdresseCommune,
      setEtablissementFormationSiret,
      setEtablissementFormationDenomination,
      setEtablissementFormationUaiCfa,
      setEtablissementFormationAdresseNumero,
      setEtablissementFormationAdresseVoie,
      setEtablissementFormationAdresseComplement,
      setEtablissementFormationAdresseCodePostal,
      setEtablissementFormationAdresseCommune,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationDenomination = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.denomination") {
          const newV = {
            etablissementFormation: {
              denomination: {
                ...etablissementFormationDenomination,
                value: data,
              },
            },
          };
          if (etablissementFormationDenomination.value !== newV.etablissementFormation.denomination.value) {
            setEtablissementFormationDenomination(newV.etablissementFormation.denomination);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              etablissementFormation: {
                denomination: newV.etablissementFormation.denomination.value,
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      etablissementFormationDenomination,
      setEtablissementFormationDenomination,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationAdresseNumero = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.adresse.numero") {
          const newV = {
            etablissementFormation: {
              adresse: {
                numero: {
                  ...etablissementFormationAdresseNumero,
                  value: data,
                },
              },
            },
          };
          if (etablissementFormationAdresseNumero.value !== newV.etablissementFormation.adresse.numero.value) {
            setEtablissementFormationAdresseNumero(newV.etablissementFormation.adresse.numero);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              etablissementFormation: {
                adresse: {
                  numero: normalizeInputNumberForDb(data),
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      etablissementFormationAdresseNumero,
      setEtablissementFormationAdresseNumero,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationAdresseVoie = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.adresse.voie") {
          const newV = {
            etablissementFormation: {
              adresse: {
                voie: {
                  ...etablissementFormationAdresseVoie,
                  value: data,
                },
              },
            },
          };
          if (etablissementFormationAdresseVoie.value !== newV.etablissementFormation.adresse.voie.value) {
            setEtablissementFormationAdresseVoie(newV.etablissementFormation.adresse.voie);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              etablissementFormation: {
                adresse: {
                  voie: newV.etablissementFormation.adresse.voie.value,
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      etablissementFormationAdresseVoie,
      setEtablissementFormationAdresseVoie,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationAdresseComplement = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.adresse.complement") {
          const newV = {
            etablissementFormation: {
              adresse: {
                complement: {
                  ...etablissementFormationAdresseComplement,
                  value: data,
                },
              },
            },
          };
          if (etablissementFormationAdresseComplement.value !== newV.etablissementFormation.adresse.complement.value) {
            setEtablissementFormationAdresseComplement(newV.etablissementFormation.adresse.complement);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              etablissementFormation: {
                adresse: {
                  complement: newV.etablissementFormation.adresse.complement.value,
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      etablissementFormationAdresseComplement,
      setEtablissementFormationAdresseComplement,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationAdresseCodePostal = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.adresse.codePostal") {
          const newV = {
            etablissementFormation: {
              adresse: {
                codePostal: {
                  ...etablissementFormationAdresseCodePostal,
                  value: data.codePostal,
                },
                commune: {
                  ...etablissementFormationAdresseCommune,
                  value: data.commune,
                },
              },
            },
          };
          if (etablissementFormationAdresseCodePostal.value !== newV.etablissementFormation.adresse.codePostal.value) {
            setEtablissementFormationAdresseCodePostal(newV.etablissementFormation.adresse.codePostal);
            setEtablissementFormationAdresseCommune(newV.etablissementFormation.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              etablissementFormation: {
                adresse: {
                  codePostal: newV.etablissementFormation.adresse.codePostal.value,
                  commune: newV.etablissementFormation.adresse.commune.value,
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      etablissementFormationAdresseCodePostal,
      etablissementFormationAdresseCommune,
      setEtablissementFormationAdresseCodePostal,
      setEtablissementFormationAdresseCommune,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationAdresseCommune = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.adresse.commune") {
          const newV = {
            etablissementFormation: {
              adresse: {
                commune: {
                  ...etablissementFormationAdresseCommune,
                  value: data,
                },
              },
            },
          };
          if (etablissementFormationAdresseCommune.value !== newV.etablissementFormation.adresse.commune.value) {
            setEtablissementFormationAdresseCommune(newV.etablissementFormation.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              etablissementFormation: {
                adresse: {
                  commune: newV.etablissementFormation.adresse.commune.value,
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      etablissementFormationAdresseCommune,
      setEtablissementFormationAdresseCommune,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedEtablissementFormationUaiCfa = useCallback(
    async (path, data) => {
      try {
        if (path === "etablissementFormation.uaiCfa") {
          const newV = {
            etablissementFormation: {
              uaiCfa: {
                ...etablissementFormationUaiCfa,
                value: data,
                locked: false,
              },
            },
          };
          setEtablissementFormationUaiCfa(newV.etablissementFormation.uaiCfa);

          const res = await saveCerfa(dossier?._id, cerfa?.id, {
            etablissementFormation: {
              uaiCfa: newV.etablissementFormation.uaiCfa.value || null,
            },
          });
          setPartFormationCompletionAtom(cerfaFormationCompletion(res));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      etablissementFormationUaiCfa,
      setEtablissementFormationUaiCfa,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedFormationDateFinFormation = useCallback(
    async (path, data, forcedTriggered) => {
      try {
        if (path === "formation.dateFinFormation") {
          const newV = {
            formation: {
              dateFinFormation: {
                ...formationDateFinFormation,
                value: data,
              },
            },
          };
          let shouldSaveInDb = false;
          if (!forcedTriggered) {
            if (formationDateFinFormation.value !== newV.formation.dateFinFormation.value) {
              if (formationDateDebutFormation.value !== "")
                setFormationDateDebutFormation({ ...formationDateDebutFormation, triggerValidation: true });

              setFormationDateFinFormation(newV.formation.dateFinFormation);

              shouldSaveInDb = true;
            }
          } else {
            setFormationDateFinFormation({ ...formationDateFinFormation, triggerValidation: false });
            shouldSaveInDb = true;
          }
          if (shouldSaveInDb) {
            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                dateFinFormation: convertDateToValue(newV.formation.dateFinFormation),
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      formationDateFinFormation,
      setFormationDateFinFormation,
      setFormationDateDebutFormation,
      formationDateDebutFormation,
      dossier?._id,
      cerfa?.id,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedFormationDateDebutFormation = useCallback(
    async (path, data, forcedTriggered) => {
      try {
        if (path === "formation.dateDebutFormation") {
          const newV = {
            formation: {
              dateDebutFormation: {
                ...formationDateDebutFormation,
                value: data,
              },
            },
          };
          let shouldSaveInDb = false;
          if (!forcedTriggered) {
            if (formationDateDebutFormation.value !== newV.formation.dateDebutFormation.value) {
              if (formationDateFinFormation.value !== "")
                setFormationDateFinFormation({ ...formationDateFinFormation, triggerValidation: true });

              setFormationDateDebutFormation(newV.formation.dateDebutFormation);

              shouldSaveInDb = true;
            }
          } else {
            setFormationDateDebutFormation({ ...formationDateDebutFormation, triggerValidation: false });
            shouldSaveInDb = true;
          }
          if (shouldSaveInDb) {
            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                dateDebutFormation: convertDateToValue(newV.formation.dateDebutFormation),
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      formationDateDebutFormation,
      formationDateFinFormation,
      setFormationDateDebutFormation,
      setFormationDateFinFormation,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedFormationDureeFormation = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.dureeFormation") {
          const newV = {
            formation: {
              dureeFormation: {
                ...formationDureeFormation,
                value: data.dureeFormation,
              },
            },
          };
          if (formationDureeFormation.value !== newV.formation.dureeFormation.value) {
            setFormationDureeFormation(newV.formation.dureeFormation);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                dureeFormation: normalizeInputNumberForDb(newV.formation.dureeFormation.value),
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, formationDureeFormation, setFormationDureeFormation, setPartFormationCompletionAtom]
  );

  const onSubmittedFormationIntituleQualification = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.intituleQualification") {
          const newV = {
            formation: {
              intituleQualification: {
                ...formationIntituleQualification,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (formationIntituleQualification.value !== newV.formation.intituleQualification.value) {
            setFormationIntituleQualification(newV.formation.intituleQualification);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                intituleQualification: newV.formation.intituleQualification.value,
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      formationIntituleQualification,
      setFormationIntituleQualification,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedFormationTypeDiplome = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.typeDiplome") {
          const newV = {
            formation: {
              typeDiplome: {
                ...formationTypeDiplome,
                value: data,
              },
            },
          };

          if (formationTypeDiplome.value !== newV.formation.typeDiplome.value) {
            setFormationTypeDiplome(newV.formation.typeDiplome);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                typeDiplome: convertMultipleSelectOptionToValue(newV.formation.typeDiplome),
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [cerfa?.id, dossier?._id, formationTypeDiplome, setFormationTypeDiplome, setPartFormationCompletionAtom]
  );

  const onSubmittedFormationCodeDiplome = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.codeDiplome") {
          const newV = {
            formation: {
              codeDiplome: {
                ...formationCodeDiplome,
                value: data.cfd || "",
                // forceUpdate: formationCodeDiplome.value === data.cfd,
                // locked: data.cfd !== "",
              },
              rncp: {
                ...formationRncp,
                value: data.rncp,
                // forceUpdate: formationRncp.value === data.rncp,
                // locked: data.rncp !== "",
              },
              intituleQualification: {
                ...formationIntituleQualification,
                value: data.intitule_diplome,
                locked: false,
              },
            },
          };
          if (formationCodeDiplome.value !== newV.formation.codeDiplome.value) {
            setFormationCodeDiplome(newV.formation.codeDiplome);
            setFormationRncp(newV.formation.rncp);
            setFormationIntituleQualification(newV.formation.intituleQualification);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                codeDiplome: newV.formation.codeDiplome.value || null,
                rncp: newV.formation.rncp.value || null,
                intituleQualification: newV.formation.intituleQualification.value,
              },
              isLockedField: {
                formation: {
                  intituleQualification: false,
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      formationCodeDiplome,
      formationIntituleQualification,
      formationRncp,
      setFormationCodeDiplome,
      setFormationIntituleQualification,
      setFormationRncp,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedRncp = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.rncp") {
          const newV = {
            formation: {
              codeDiplome: {
                ...formationCodeDiplome,
                value: data.cfd || "",
                forceUpdate: formationCodeDiplome.value === data.cfd,
              },
              rncp: {
                ...formationRncp,
                value: data.rncp,
              },
              intituleQualification: {
                ...formationIntituleQualification,
                value: data.intitule_diplome,
                locked: false,
              },
            },
          };
          if (formationRncp.value !== newV.formation.rncp.value) {
            setFormationRncp(newV.formation.rncp);
            setFormationCodeDiplome(newV.formation.codeDiplome);
            setFormationIntituleQualification(newV.formation.intituleQualification);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              formation: {
                codeDiplome: newV.formation.codeDiplome.value || null,
                rncp: newV.formation.rncp.value || null,
                intituleQualification: newV.formation.intituleQualification.value,
              },
              isLockedField: {
                formation: {
                  intituleQualification: false,
                },
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      formationCodeDiplome,
      formationIntituleQualification,
      formationRncp,
      setFormationCodeDiplome,
      setFormationIntituleQualification,
      setFormationRncp,
      setPartFormationCompletionAtom,
    ]
  );

  const onSubmittedOrganismeFormationFormationInterne = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.formationInterne") {
          const newV = {
            organismeFormation: {
              formationInterne: {
                ...organismeFormationFormationInterne,
                value: data,
              },
            },
          };
          if (organismeFormationFormationInterne.value !== newV.organismeFormation.formationInterne.value) {
            setOrganismeFormationFormationInterne(newV.organismeFormation.formationInterne);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                formationInterne: convertOptionToValue(newV.organismeFormation.formationInterne),
              },
            });
            setPartFormationCompletionAtom(cerfaFormationCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      cerfa?.id,
      dossier?._id,
      organismeFormationFormationInterne,
      setOrganismeFormationFormationInterne,
      setPartFormationCompletionAtom,
    ]
  );

  const setAll = useCallback(
    (res) => {
      setOrganismeFormationSiret(res.organismeFormation.siret);
      setOrganismeFormationDenomination(res.organismeFormation.denomination);
      setOrganismeFormationFormationInterne(convertValueToOption(res.organismeFormation.formationInterne));
      setOrganismeFormationUaiCfa(res.organismeFormation.uaiCfa);
      setOrganismeFormationAdresseNumero(res.organismeFormation.adresse.numero);
      setOrganismeFormationAdresseVoie(res.organismeFormation.adresse.voie);
      setOrganismeFormationAdresseComplement(res.organismeFormation.adresse.complement);
      setOrganismeFormationAdresseCodePostal(res.organismeFormation.adresse.codePostal);
      setOrganismeFormationAdresseCommune(res.organismeFormation.adresse.commune);

      setEtablissementFormationMemeResponsable(convertValueToOption(res.etablissementFormation.memeResponsable));
      setEtablissementFormationSiret(res.etablissementFormation.siret);
      setEtablissementFormationDenomination(res.etablissementFormation.denomination);
      setEtablissementFormationUaiCfa(res.etablissementFormation.uaiCfa);
      setEtablissementFormationAdresseNumero(res.etablissementFormation.adresse.numero);
      setEtablissementFormationAdresseVoie(res.etablissementFormation.adresse.voie);
      setEtablissementFormationAdresseComplement(res.etablissementFormation.adresse.complement);
      setEtablissementFormationAdresseCodePostal(res.etablissementFormation.adresse.codePostal);
      setEtablissementFormationAdresseCommune(res.etablissementFormation.adresse.commune);

      setFormationRncp(res.formation.rncp);
      setFormationCodeDiplome(res.formation.codeDiplome);
      setFormationDateDebutFormation(convertValueToDate(res.formation.dateDebutFormation));
      setFormationDateFinFormation(convertValueToDate(res.formation.dateFinFormation));
      setFormationDureeFormationCalc(res.formation.dureeFormationCalc);
      setFormationDureeFormation(res.formation.dureeFormation);
      setFormationIntituleQualification(res.formation.intituleQualification);
      setFormationTypeDiplome(convertValueToMultipleSelectOption(res.formation.typeDiplome));

      setPartFormationCompletionAtom(cerfaFormationCompletion(res));
    },
    [
      setEtablissementFormationAdresseCodePostal,
      setEtablissementFormationAdresseCommune,
      setEtablissementFormationAdresseComplement,
      setEtablissementFormationAdresseNumero,
      setEtablissementFormationAdresseVoie,
      setEtablissementFormationDenomination,
      setEtablissementFormationMemeResponsable,
      setEtablissementFormationSiret,
      setEtablissementFormationUaiCfa,
      setFormationCodeDiplome,
      setFormationDateDebutFormation,
      setFormationDateFinFormation,
      setFormationDureeFormation,
      setFormationDureeFormationCalc,
      setFormationIntituleQualification,
      setFormationRncp,
      setFormationTypeDiplome,
      setOrganismeFormationAdresseCodePostal,
      setOrganismeFormationAdresseCommune,
      setOrganismeFormationAdresseComplement,
      setOrganismeFormationAdresseNumero,
      setOrganismeFormationAdresseVoie,
      setOrganismeFormationDenomination,
      setOrganismeFormationFormationInterne,
      setOrganismeFormationSiret,
      setOrganismeFormationUaiCfa,
      setPartFormationCompletionAtom,
    ]
  );

  useEffect(() => {
    if (cerfa && isLoading) {
      setAll(cerfa);
      setIsLoading(false);
    }
  }, [cerfa, isLoading, setAll, setIsLoading]);

  return {
    isLoading,
    completion: partFormationCompletion,
    get: {
      organismeFormation: {
        siret: organismeFormationSiret,
        denomination: organismeFormationDenomination,
        formationInterne: organismeFormationFormationInterne,
        uaiCfa: organismeFormationUaiCfa,
        adresse: {
          numero: organismeFormationAdresseNumero,
          voie: organismeFormationAdresseVoie,
          complement: organismeFormationAdresseComplement,
          codePostal: organismeFormationAdresseCodePostal,
          commune: organismeFormationAdresseCommune,
        },
      },
      etablissementFormation: {
        memeResponsable: etablissementFormationMemeResponsable,
        siret: etablissementFormationSiret,
        denomination: etablissementFormationDenomination,
        uaiCfa: etablissementFormationUaiCfa,
        adresse: {
          numero: etablissementFormationAdresseNumero,
          voie: etablissementFormationAdresseVoie,
          complement: etablissementFormationAdresseComplement,
          codePostal: etablissementFormationAdresseCodePostal,
          commune: etablissementFormationAdresseCommune,
        },
      },
      formation: {
        rncp: formationRncp,
        codeDiplome: formationCodeDiplome,
        dateDebutFormation: formationDateDebutFormation,
        dateFinFormation: formationDateFinFormation,
        dureeFormationCalc: formationDureeFormationCalc,
        dureeFormation: formationDureeFormation,
        intituleQualification: formationIntituleQualification,
        typeDiplome: formationTypeDiplome,
      },
    },
    setAll,
    onSubmit: {
      organismeFormation: {
        formationInterne: onSubmittedOrganismeFormationFormationInterne,
        siret: onSubmittedOrganismeFormationSiret,
        denomination: onSubmittedOrganismeFormationDenomination,
        uaiCfa: onSubmittedOrganismeFormationUaiCfa,
        adresse: {
          numero: onSubmittedOrganismeFormationAdresseNumero,
          voie: onSubmittedOrganismeFormationAdresseVoie,
          complement: onSubmittedOrganismeFormationAdresseComplement,
          codePostal: onSubmittedOrganismeFormationAdresseCodePostal,
          commune: onSubmittedOrganismeFormationAdresseCommune,
        },
      },
      etablissementFormation: {
        memeResponsable: onSubmittedEtablissementFormationMemeResponsable,
        siret: onSubmittedEtablissementFormationSiret,
        denomination: onSubmittedEtablissementFormationDenomination,
        uaiCfa: onSubmittedEtablissementFormationUaiCfa,
        adresse: {
          numero: onSubmittedEtablissementFormationAdresseNumero,
          voie: onSubmittedEtablissementFormationAdresseVoie,
          complement: onSubmittedEtablissementFormationAdresseComplement,
          codePostal: onSubmittedEtablissementFormationAdresseCodePostal,
          commune: onSubmittedEtablissementFormationAdresseCommune,
        },
      },
      formation: {
        rncp: onSubmittedRncp,
        codeDiplome: onSubmittedFormationCodeDiplome,
        dateDebutFormation: onSubmittedFormationDateDebutFormation,
        dateFinFormation: onSubmittedFormationDateFinFormation,
        dureeFormation: onSubmittedFormationDureeFormation,
        intituleQualification: onSubmittedFormationIntituleQualification,
        typeDiplome: onSubmittedFormationTypeDiplome,
      },
    },
  };
}

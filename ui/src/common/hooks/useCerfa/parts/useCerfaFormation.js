/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
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

const cerfaFormationCompletion = (res) => {
  let fieldsToKeep = {
    organismeFormationSiret: res.organismeFormation.siret,
    organismeFormationDenomination: res.organismeFormation.denomination,
    // organismeFormationFormationInterne: res.organismeFormation.formationInterne,
    organismeFormationUaiCfa: res.organismeFormation.uaiCfa,
    // organismeFormationAdresseNumero: res.organismeFormation.adresse.numero,
    organismeFormationAdresseVoie: res.organismeFormation.adresse.voie,
    // organismeFormationAdresseComplement: res.organismeFormation.adresse.complement,
    organismeFormationAdresseCodePostal: res.organismeFormation.adresse.codePostal,
    organismeFormationAdresseCommune: res.organismeFormation.adresse.commune,
    formationRncp: res.formation.rncp,
    formationCodeDiplome: res.formation.codeDiplome,
    formationDateDebutFormation: res.formation.dateDebutFormation,
    formationDateFinFormation: res.formation.dateFinFormation,
    formationDureeFormation: res.formation.dureeFormation,
    formationIntituleQualification: res.formation.intituleQualification,
    formationTypeDiplome: res.formation.typeDiplome,
  };
  return fieldCompletionPercentage(fieldsToKeep, 13);
};

export function useCerfaFormation() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [partFormationCompletion, setPartFormationCompletionAtom] = useRecoilState(
    formationAtoms.cerfaPartFormationCompletionAtom
  );

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
                value: data.uai || "", // If organismeFormationUaiCfa.value !=== "" && data.uai === "" => do not change it
                forceUpdate: organismeFormationUaiCfa.value === data.uai,
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
                  value: data.type_voie || data.nom_voie ? `${data.type_voie} ${data.nom_voie}` : "",
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

          if (organismeFormationSiret.value !== newV.organismeFormation.siret.value) {
            setOrganismeFormationSiret(newV.organismeFormation.siret);
            setOrganismeFormationDenomination(newV.organismeFormation.denomination);
            setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);
            setOrganismeFormationAdresseNumero(newV.organismeFormation.adresse.numero);
            setOrganismeFormationAdresseVoie(newV.organismeFormation.adresse.voie);
            setOrganismeFormationAdresseComplement(newV.organismeFormation.adresse.complement);
            setOrganismeFormationAdresseCodePostal(newV.organismeFormation.adresse.codePostal);
            setOrganismeFormationAdresseCommune(newV.organismeFormation.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                siret: newV.organismeFormation.siret.value,
                denomination: newV.organismeFormation.denomination.value,
                uaiCfa: newV.organismeFormation.uaiCfa.value || null,
                adresse: {
                  numero: normalizeInputNumberForDb(newV.organismeFormation.adresse.numero.value),
                  voie: newV.organismeFormation.adresse.voie.value,
                  complement: newV.organismeFormation.adresse.complement.value,
                  codePostal: newV.organismeFormation.adresse.codePostal.value,
                  commune: newV.organismeFormation.adresse.commune.value,
                },
              },
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
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (organismeFormationDenomination.value !== newV.organismeFormation.denomination.value) {
            setOrganismeFormationDenomination(newV.organismeFormation.denomination);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                denomination: newV.organismeFormation.denomination.value,
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

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
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
      organismeFormationAdresseNumero,
      setOrganismeFormationAdresseNumero,
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
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (organismeFormationAdresseVoie.value !== newV.organismeFormation.adresse.voie.value) {
            setOrganismeFormationAdresseVoie(newV.organismeFormation.adresse.voie);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                adresse: {
                  voie: newV.organismeFormation.adresse.voie.value,
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
      organismeFormationAdresseVoie,
      setOrganismeFormationAdresseVoie,
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
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (organismeFormationAdresseComplement.value !== newV.organismeFormation.adresse.complement.value) {
            setOrganismeFormationAdresseComplement(newV.organismeFormation.adresse.complement);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                adresse: {
                  complement: newV.organismeFormation.adresse.complement.value,
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
      organismeFormationAdresseComplement,
      setOrganismeFormationAdresseComplement,
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

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                adresse: {
                  codePostal: newV.organismeFormation.adresse.codePostal.value,
                  commune: newV.organismeFormation.adresse.commune.value,
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
      organismeFormationAdresseCodePostal,
      organismeFormationAdresseCommune,
      setOrganismeFormationAdresseCodePostal,
      setOrganismeFormationAdresseCommune,
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
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (organismeFormationAdresseCommune.value !== newV.organismeFormation.adresse.commune.value) {
            setOrganismeFormationAdresseCommune(newV.organismeFormation.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              organismeFormation: {
                adresse: {
                  commune: newV.organismeFormation.adresse.commune.value,
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
      organismeFormationAdresseCommune,
      setOrganismeFormationAdresseCommune,
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
                forceUpdate: false, // IF data = "" true
              },
            },
          };
          setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [organismeFormationUaiCfa, setOrganismeFormationUaiCfa]
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
                // forceUpdate: false, // IF data = "" true
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
                // forceUpdate: false, // IF data = "" true
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

  const setAll = async (res) => {
    setOrganismeFormationSiret(res.organismeFormation.siret);
    setOrganismeFormationDenomination(res.organismeFormation.denomination);
    setOrganismeFormationFormationInterne(convertValueToOption(res.organismeFormation.formationInterne));
    setOrganismeFormationUaiCfa(res.organismeFormation.uaiCfa);
    setOrganismeFormationAdresseNumero(res.organismeFormation.adresse.numero);
    setOrganismeFormationAdresseVoie(res.organismeFormation.adresse.voie);
    setOrganismeFormationAdresseComplement(res.organismeFormation.adresse.complement);
    setOrganismeFormationAdresseCodePostal(res.organismeFormation.adresse.codePostal);
    setOrganismeFormationAdresseCommune(res.organismeFormation.adresse.commune);

    setFormationRncp(res.formation.rncp);
    setFormationCodeDiplome(res.formation.codeDiplome);
    setFormationDateDebutFormation(convertValueToDate(res.formation.dateDebutFormation));
    setFormationDateFinFormation(convertValueToDate(res.formation.dateFinFormation));
    setFormationDureeFormationCalc(res.formation.dureeFormationCalc);
    setFormationDureeFormation(res.formation.dureeFormation);
    setFormationIntituleQualification(res.formation.intituleQualification);
    setFormationTypeDiplome(convertValueToMultipleSelectOption(res.formation.typeDiplome));

    setPartFormationCompletionAtom(cerfaFormationCompletion(res));
  };

  return {
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

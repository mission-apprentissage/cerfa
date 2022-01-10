/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
import { DateTime } from "luxon";
import { _post } from "../../../httpClient";
import { useRecoilState, useRecoilValue } from "recoil";

import { fieldCompletionPercentage } from "../../../utils/formUtils";
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
          if (data.value) {
            const dateFinFormation = DateTime.fromISO(data.value).setLocale("fr-FR");
            if (dateDebutFormation >= dateFinFormation) {
              return {
                successed: false,
                data: null,
                message: "Date de début du cycle de formation ne peut pas être après la date de fin du cycle",
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
          if (data.value) {
            const dateDebutFormation = DateTime.fromISO(data.value).setLocale("fr-FR");
            if (dateDebutFormation >= dateFinFormation) {
              return {
                successed: false,
                data: null,
                message: "Date de fin du cycle de formation ne peut pas être avant la date de début du cycle",
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
    },
    organismeFormation: {
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

const cerfaFormationCompletion = (res) => {
  let fieldsToKeep = {
    organismeFormationSiret: res.organismeFormation.siret,
    organismeFormationDenomination: res.organismeFormation.denomination,
    organismeFormationFormationInterne: res.organismeFormation.formationInterne,
    organismeFormationUaiCfa: res.organismeFormation.uaiCfa,
    organismeFormationAdresseNumero: res.organismeFormation.adresse.numero,
    organismeFormationAdresseVoie: res.organismeFormation.adresse.voie,
    organismeFormationAdresseComplement: res.organismeFormation.adresse.complement,
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
  return fieldCompletionPercentage(fieldsToKeep, 16);
};

export function useCerfaFormation() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);

  const [partFormationCompletionAtom, setPartFormationCompletionAtom] = useRecoilState(
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
              },
              uaiCfa: {
                ...organismeFormationUaiCfa,
                value: data.uai, // If organismeFormationUaiCfa.value !=== "" && data.uai === "" => do not change it
                forceUpdate: organismeFormationUaiCfa.value === data.uai,
                locked: data.uai !== "",
              },
              adresse: {
                numero: {
                  ...organismeFormationAdresseNumero,
                  value: data.numero_voie, //parseInt(data.numero_voie),
                },
                voie: { ...organismeFormationAdresseVoie, value: `${data.type_voie} ${data.nom_voie}` },
                complement: { ...organismeFormationAdresseComplement, value: data.complement_adresse || "" },
                codePostal: { ...organismeFormationAdresseCodePostal, value: data.code_postal },
                commune: { ...organismeFormationAdresseCommune, value: data.commune_implantation_nom },
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
                uaiCfa: newV.organismeFormation.uaiCfa.value,
                adresse: {
                  numero: newV.organismeFormation.adresse.numero.value,
                  voie: newV.organismeFormation.adresse.voie.value,
                  complement: newV.organismeFormation.adresse.complement.value,
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
    async (path, data) => {
      try {
        if (path === "formation.dateFinFormation") {
          const newV = {
            formation: {
              dateFinFormation: {
                ...formationDateFinFormation,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (formationDateFinFormation.value !== newV.formation.dateFinFormation.value) {
            setFormationDateFinFormation(newV.formation.dateFinFormation);
            setFormationDateDebutFormation(formationDateDebutFormation);
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
    ]
  );

  const onSubmittedFormationDateDebutFormation = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.dateDebutFormation") {
          const newV = {
            formation: {
              dateDebutFormation: {
                ...formationDateDebutFormation,
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (formationDateDebutFormation.value !== newV.formation.dateDebutFormation.value) {
            setFormationDateDebutFormation(newV.formation.dateDebutFormation);
            setFormationDateFinFormation(formationDateFinFormation);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      formationDateDebutFormation,
      formationDateFinFormation,
      setFormationDateDebutFormation,
      setFormationDateFinFormation,
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
                value: data,
                // forceUpdate: false, // IF data = "" true
              },
            },
          };
          if (formationDureeFormation.value !== newV.formation.dureeFormation.value) {
            setFormationDureeFormation(newV.formation.dureeFormation);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [formationDureeFormation, setFormationDureeFormation]
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [formationTypeDiplome, setFormationTypeDiplome]
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
              },
            },
          };
          if (formationCodeDiplome.value !== newV.formation.codeDiplome.value) {
            setFormationCodeDiplome(newV.formation.codeDiplome);
            setFormationRncp(newV.formation.rncp);
            setFormationIntituleQualification(newV.formation.intituleQualification);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      formationCodeDiplome,
      formationIntituleQualification,
      formationRncp,
      setFormationCodeDiplome,
      setFormationIntituleQualification,
      setFormationRncp,
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
                locked: data.cfd !== "",
              },
              rncp: {
                ...formationRncp,
                value: data.rncp,
                // forceUpdate: false, // IF data = "" true
              },
              intituleQualification: {
                ...formationIntituleQualification,
                value: data.intitule_diplome,
              },
            },
          };
          if (formationRncp.value !== newV.formation.rncp.value) {
            setFormationRncp(newV.formation.rncp);
            setFormationCodeDiplome(newV.formation.codeDiplome);
            setFormationIntituleQualification(newV.formation.intituleQualification);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      formationCodeDiplome,
      formationIntituleQualification,
      formationRncp,
      setFormationCodeDiplome,
      setFormationIntituleQualification,
      setFormationRncp,
    ]
  );

  const setAll = async (res) => {
    setOrganismeFormationSiret(res.organismeFormation.siret);
    setOrganismeFormationDenomination(res.organismeFormation.denomination);
    setOrganismeFormationFormationInterne(res.organismeFormation.formationInterne);
    setOrganismeFormationUaiCfa(res.organismeFormation.uaiCfa);
    setOrganismeFormationAdresseNumero(res.organismeFormation.adresse.numero);
    setOrganismeFormationAdresseVoie(res.organismeFormation.adresse.voie);
    setOrganismeFormationAdresseComplement(res.organismeFormation.adresse.complement);
    setOrganismeFormationAdresseCodePostal(res.organismeFormation.adresse.codePostal);
    setOrganismeFormationAdresseCommune(res.organismeFormation.adresse.commune);

    setFormationRncp(res.formation.rncp);
    setFormationCodeDiplome(res.formation.codeDiplome);
    setFormationDateDebutFormation(res.formation.dateDebutFormation);
    setFormationDateFinFormation(res.formation.dateFinFormation);
    setFormationDureeFormation(res.formation.dureeFormation);
    setFormationIntituleQualification(res.formation.intituleQualification);
    setFormationTypeDiplome(res.formation.typeDiplome);

    setPartFormationCompletionAtom(cerfaFormationCompletion(res));
  };

  return {
    completion: partFormationCompletionAtom,
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
        dureeFormation: formationDureeFormation,
        intituleQualification: formationIntituleQualification,
        typeDiplome: formationTypeDiplome,
      },
    },
    setAll,
    onSubmit: {
      organismeFormation: {
        siret: onSubmittedOrganismeFormationSiret,
        uaiCfa: onSubmittedOrganismeFormationUaiCfa,
      },
      formation: {
        rncp: onSubmittedRncp,
        codeDiplome: onSubmittedFormationCodeDiplome,
        dateDebutFormation: onSubmittedFormationDateDebutFormation,
        dateFinFormation: onSubmittedFormationDateFinFormation,
        dureeFormation: onSubmittedFormationDureeFormation,
        typeDiplome: onSubmittedFormationTypeDiplome,
      },
    },
  };
}

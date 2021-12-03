/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import {
  _get,
  // _put,
  _post,
} from "../httpClient";
import { useRecoilValue } from "recoil";
import { dossierAtom } from "./dossierAtom";

const hydrate = async (dossier) => {
  try {
    const cerfa = await _get(`/api/v1/cerfa?workspaceId=${dossier.workspaceId}&dossierId=${dossier._id}`);
    console.log(cerfa);
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
          doAsyncActions: async (value, data) => {
            try {
              const response = await _post(`/api/v1/cfdrncp`, {
                rncp: value,
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
          ...cerfa.formation.codeDiplome,
          doAsyncActions: async (value) => {
            try {
              const response = await _post(`/api/v1/cfdrncp`, {
                cfd: value,
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
          ...cerfa.formation.dateDebutFormation,
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
          ...cerfa.formation.dateFinFormation,
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
      // contrat: {},
      organismeFormation: {
        ...cerfa.organismeFormation,
        siret: {
          ...cerfa.organismeFormation.siret,
          doAsyncActions: async (value) => {
            const response = await _post(`/api/v1/siret`, {
              siret: value,
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
          history: [
            {
              to: "98765432400070",
              how: "manuel",
              when: Date.now(),
              who: "Antoine Bigard",
              role: "CFA",
            },
            {
              to: "98765432400019",
              how: "manuel",
              when: Date.now(),
              who: "Paul Pierre",
              role: "Employeur",
            },
          ],
        },
      },
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export function findFieldDef(path, obj) {
  let keys = path.split(".");
  if (keys.length === 2) {
    const field = path.split(".").reduce((p, c) => (p && p[c]) || null, obj);
    return field;
  }
  const first = keys.shift();
  return findFieldDef(obj[first], keys.join("."));
}

export function useCerfa() {
  const [isloaded, setIsLoaded] = useState(false);
  const dossier = useRecoilValue(dossierAtom);

  const [organismeFormationSiret, setOrganismeFormationSiret] = useState(null);
  const [organismeFormationDenomination, setOrganismeFormationDenomination] = useState(null);
  const [organismeFormationUaiCfa, setOrganismeFormationUaiCfa] = useState(null);
  const [organismeFormationAdresseNumero, setOrganismeFormationAdresseNumero] = useState(null);
  const [organismeFormationAdresseVoie, setOrganismeFormationAdresseVoie] = useState(null);
  const [organismeFormationAdresseComplement, setOrganismeFormationAdresseComplement] = useState(null);
  const [organismeFormationAdresseCodePostal, setOrganismeFormationAdresseCodePostal] = useState(null);
  const [organismeFormationAdresseCommune, setOrganismeFormationAdresseCommune] = useState(null);

  const [formationRncp, setFormationRncp] = useState(null);
  const [formationCodeDiplome, setFormationCodeDiplome] = useState(null);
  const [formationDateDebutFormation, setFormationDateDebutFormation] = useState(null);
  const [formationDateFinFormation, setFormationDateFinFormation] = useState(null);
  const [formationDureeFormation, setFormationDureeFormation] = useState(null);
  const [formationIntituleQualification, setFormationIntituleQualification] = useState(null);
  const [formationTypeDiplome, setFormationTypeDiplome] = useState(null);

  const [error, setError] = useState(null);

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
            setOrganismeFormationAdresseComplement(newV.organismeFormation.adresse.complement);
            setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);
            setOrganismeFormationDenomination(newV.organismeFormation.denomination);
            setOrganismeFormationAdresseNumero(newV.organismeFormation.adresse.numero);
            setOrganismeFormationAdresseVoie(newV.organismeFormation.adresse.voie);
            setOrganismeFormationAdresseCodePostal(newV.organismeFormation.adresse.codePostal);
            setOrganismeFormationAdresseCommune(newV.organismeFormation.adresse.commune);
          }
        }
      } catch (e) {
        setError(e);
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
        setError(e);
      }
    },
    [organismeFormationUaiCfa]
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
        setError(e);
      }
    },
    [formationDateFinFormation, formationDateDebutFormation]
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
        setError(e);
      }
    },
    [formationDateDebutFormation, formationDateFinFormation]
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
        setError(e);
      }
    },
    [formationDureeFormation]
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
        setError(e);
      }
    },
    [formationTypeDiplome]
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
        setError(e);
      }
    },
    [formationCodeDiplome, formationIntituleQualification, formationRncp]
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
        setError(e);
      }
    },
    [formationCodeDiplome, formationIntituleQualification, formationRncp]
  );

  useEffect(() => {
    const abortController = new AbortController();

    hydrate(dossier)
      .then((res) => {
        if (!abortController.signal.aborted) {
          setOrganismeFormationSiret(res.organismeFormation.siret);
          setOrganismeFormationDenomination(res.organismeFormation.denomination);
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

          setIsLoaded(true);
        }
      })
      .catch((e) => {
        if (!abortController.signal.aborted) {
          setError(e);
        }
      });
    return () => {
      abortController.abort();
    };
  }, [dossier]);

  if (error !== null) {
    throw error;
  }

  return {
    isloaded,
    organismeFormation: {
      siret: organismeFormationSiret,
      denomination: organismeFormationDenomination,
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
    onSubmittedOrganismeFormationSiret,
    onSubmittedFormationCodeDiplome,
    onSubmittedRncp,
    onSubmittedFormationDateDebutFormation,
    onSubmittedFormationDateFinFormation,
    onSubmittedFormationDureeFormation,
    onSubmittedFormationTypeDiplome,
    onSubmittedOrganismeFormationUaiCfa,
  };
}

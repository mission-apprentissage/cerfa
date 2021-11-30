/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useState, useEffect, useCallback } from "react";
import cloneDeep from "lodash.clonedeep";
import { DateTime } from "luxon";
import {
  _get,
  // _put,
  _post,
} from "../httpClient";

const hydrate = async () => {
  try {
    const schema = await _get("/api/v1/cerfa/schema");
    const { organismeFormation, formation } = schema;
    return {
      employeur: {},
      apprenti: {},
      maitre1: {},
      maitre2: {},
      formation: {
        rncp: {
          ...formation.rncp,
          value: "",
        },
        codeDiplome: {
          ...formation.codeDiplome,
          value: "",
        },
        dateDebutFormation: {
          ...formation.dateDebutFormation,
          value: "",
          doAsyncActions: async (value, data) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const dateDebutFormation = DateTime.fromISO(value).setLocale("fr-FR");
            if (data.value) {
              const dateFinFormation = DateTime.fromISO(data.value).setLocale("fr-FR");
              if (dateDebutFormation >= dateFinFormation) {
                return {
                  successed: false,
                  data: value,
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
          ...formation.dateFinFormation,
          value: "",
          doAsyncActions: async (value, data) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const dateFinFormation = DateTime.fromISO(value).setLocale("fr-FR");
            if (data.value) {
              const dateDebutFormation = DateTime.fromISO(data.value).setLocale("fr-FR");
              if (dateDebutFormation >= dateFinFormation) {
                return {
                  successed: false,
                  data: value,
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
      contrat: {},
      organismeFormation: {
        siret: {
          ...organismeFormation.siret,
          value: "",
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
        denomination: {
          ...organismeFormation.denomination,
          value: "",
        },
        uaiCfa: {
          ...organismeFormation.uaiCfa,
          value: "",
        },
        adresse: {
          numero: {
            ...organismeFormation.adresse.numero,
            value: "",
          },
          voie: {
            ...organismeFormation.adresse.voie,
            value: "",
          },
          complement: {
            ...organismeFormation.adresse.complement,
            value: "",
          },
          codePostal: {
            ...organismeFormation.adresse.codePostal,
            value: "",
          },
          commune: {
            ...organismeFormation.adresse.commune,
            value: "",
          },
        },
      },
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

const updateCerfaValuesOf = (obj, key, values) => {
  let newObj = cloneDeep(obj);
  const keys = Object.keys(values);
  for (let index = 0; index < keys.length; index++) {
    const keyN = keys[index];

    if (newObj[key] && newObj[key][keyN]) {
      if (typeof values[keyN] !== "object") {
        newObj[key][keyN].value = values[keyN];
      } else if (newObj[key][keyN].value !== undefined) {
        newObj[key][keyN].value = values[keyN];
      } else {
        let tmp = updateCerfaValuesOf({ [keyN]: newObj[key][keyN] }, keyN, values[keyN]);
        const subKeys = Object.keys(tmp[keyN]);
        for (let j = 0; j < subKeys.length; j++) {
          const subKeyN = subKeys[j];
          if (!newObj[key][keyN][subKeyN]) {
            delete tmp[keyN][subKeyN];
          }
        }
        newObj[key][keyN] = tmp[keyN];
      }
    }
  }
  return newObj;
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
  const [error, setError] = useState(null);

  const onSubmittedOrganismeFormationSiret = useCallback(
    async (path, data) => {
      try {
        if (path === "organismeFormation.siret") {
          const newV = updateCerfaValuesOf(
            {
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
            },
            "organismeFormation",
            {
              denomination: data.enseigne || data.entreprise_raison_sociale,
              siret: data.siret,
              uaiCfa: "0561910X", //"0561910X", // TODO
              adresse: {
                numero: data.numero_voie, //parseInt(data.numero_voie),
                voie: `${data.type_voie} ${data.nom_voie}`,
                complement: data.complement_adresse || "",
                // label: "14 Boulevard de la liberté",
                codePostal: data.code_postal,
                commune: data.commune_implantation_nom,
              },
            }
          );
          if (organismeFormationSiret.value !== newV.organismeFormation.siret.value) {
            setOrganismeFormationSiret(newV.organismeFormation.siret);
          }
          if (organismeFormationDenomination.value !== newV.organismeFormation.denomination.value) {
            setOrganismeFormationDenomination(newV.organismeFormation.denomination);
          }
          if (organismeFormationUaiCfa.value !== newV.organismeFormation.uaiCfa.value) {
            setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);
          }
          if (organismeFormationAdresseNumero.value !== newV.organismeFormation.adresse.numero.value) {
            setOrganismeFormationAdresseNumero(newV.organismeFormation.adresse.numero);
          }
          if (organismeFormationAdresseVoie.value !== newV.organismeFormation.adresse.voie.value) {
            setOrganismeFormationAdresseVoie(newV.organismeFormation.adresse.voie);
          }
          if (organismeFormationAdresseComplement.value !== newV.organismeFormation.adresse.complement.value) {
            setOrganismeFormationAdresseComplement(newV.organismeFormation.adresse.complement);
          }
          if (organismeFormationAdresseCodePostal.value !== newV.organismeFormation.adresse.codePostal.value) {
            setOrganismeFormationAdresseCodePostal(newV.organismeFormation.adresse.codePostal);
          }
          if (organismeFormationAdresseCommune.value !== newV.organismeFormation.adresse.commune.value) {
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
          const newV = updateCerfaValuesOf(
            {
              organismeFormation: {
                uaiCfa: organismeFormationUaiCfa,
              },
            },
            "organismeFormation",
            {
              uaiCfa: data,
            }
          );
          if (organismeFormationUaiCfa.value !== newV.organismeFormation.uaiCfa.value) {
            setOrganismeFormationUaiCfa(newV.organismeFormation.uaiCfa);
          }
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
          const newV = updateCerfaValuesOf(
            {
              formation: {
                dateFinFormation: formationDateFinFormation,
              },
            },
            "formation",
            {
              dateFinFormation: data,
            }
          );
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
          const newV = updateCerfaValuesOf(
            {
              formation: {
                dateDebutFormation: formationDateDebutFormation,
              },
            },
            "formation",
            {
              dateDebutFormation: data,
            }
          );
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

  const onSubmittedFormationCodeDiplome = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.codeDiplome") {
          const newV = updateCerfaValuesOf(
            {
              formation: {
                codeDiplome: formationCodeDiplome,
              },
            },
            "formation",
            {
              codeDiplome: data,
            }
          );
          if (formationCodeDiplome.value !== newV.formation.codeDiplome.value) {
            setFormationCodeDiplome(newV.formation.codeDiplome);
          }
        }
      } catch (e) {
        setError(e);
      }
    },
    [formationCodeDiplome]
  );

  const onSubmittedRncp = useCallback(
    async (path, data) => {
      try {
        if (path === "formation.rncp") {
          const newV = updateCerfaValuesOf(
            {
              formation: {
                rncp: formationRncp,
              },
            },
            "formation",
            {
              rncp: data,
            }
          );
          if (formationRncp.value !== newV.formation.rncp.value) {
            setFormationRncp(newV.formation.rncp);
          }
        }
      } catch (e) {
        setError(e);
      }
    },
    [formationRncp]
  );

  useEffect(() => {
    const abortController = new AbortController();

    hydrate()
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
  }, []);

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
    },
    onSubmittedOrganismeFormationSiret,
    onSubmittedFormationCodeDiplome,
    onSubmittedRncp,
    onSubmittedFormationDateDebutFormation,
    onSubmittedFormationDateFinFormation,
    onSubmittedOrganismeFormationUaiCfa,
  };
}

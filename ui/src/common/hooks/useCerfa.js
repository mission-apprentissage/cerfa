import { useState, useEffect, useCallback } from "react";
import cloneDeep from "lodash.clonedeep";
import {
  _get,
  // _put,
  _post,
} from "../httpClient";
import { atom, useRecoilState } from "recoil";

export const cerfaAtom = atom({
  key: "dossier/cerfa",
  default: null,
});

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
      },
      contrat: {},
      organismeFormation: {
        siret: {
          ...organismeFormation.siret,
          value: "",
          onFetch: async (value) => {
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
      } else {
        let tmp = updateCerfaValuesOf({ [keyN]: newObj[key][keyN] }, keyN, values[keyN]);
        const subKeys = Object.keys(tmp[keyN]);
        for (let j = 0; j < subKeys.length; j++) {
          const subKeyN = subKeys[j];
          if (!newObj[key][keyN][subKeyN]) {
            delete tmp[keyN][subKeyN];
          }
        }
        // console.log(newObj[key][keyN], tmp[keyN]);
        newObj[key][keyN] = tmp[keyN];
      }
    }
  }
  return newObj;
};

export function useCerfa() {
  const [isloaded, setIsLoaded] = useState(false);
  const [cerfa, setCerfa] = useRecoilState(cerfaAtom);
  const [error, setError] = useState(null);

  const getField = (cerfa, name) => {
    let keys = name.split(".");
    if (keys.length === 2) {
      const field = name.split(".").reduce((p, c) => (p && p[c]) || null, cerfa);
      return field;
    }
    const first = keys.shift();
    return getField(cerfa[first], keys.join("."));
  };

  const onSubmittedField = useCallback(
    async (data) => {
      try {
        const organismeFormation = {
          denomination: data.enseigne || data.entreprise_raison_sociale,
          siret: data.siret,
          uaiCfa: "0561910X", // TODO
          adresse: {
            numero: data.numero_voie, //parseInt(data.numero_voie),
            voie: `${data.type_voie} ${data.nom_voie}`,
            complement: data.complement_adresse || "",
            // label: "14 Boulevard de la liberté",
            codePostal: data.code_postal,
            commune: data.commune_implantation_nom,
          },
        };

        const updatedCerfa = updateCerfaValuesOf(cerfa, "organismeFormation", organismeFormation);

        setCerfa(updatedCerfa);
      } catch (e) {
        setError(e);
      }
    },
    [cerfa, setCerfa]
  );

  useEffect(() => {
    const abortController = new AbortController();

    hydrate()
      .then((cerfa) => {
        if (!abortController.signal.aborted) {
          setCerfa(cerfa);
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
  }, [setCerfa]);

  if (error !== null) {
    throw error;
  }

  return { isloaded, cerfa, getField, onSubmittedField };
}

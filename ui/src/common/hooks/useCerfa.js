import { useState, useEffect } from "react";
import { _get, _put } from "../httpClient";
import { atom, useRecoilState } from "recoil";

export const cerfaAtom = atom({
  key: "dossier/cerfa",
  default: null,
});

const hydrate = async () => {
  try {
    const schema = await _get("/api/v1/cerfa/schema");
    const { organismeFormation } = schema;
    return {
      employeur: {},
      apprenti: {},
      maitre1: {},
      maitre2: {},
      formation: {},
      contrat: {},
      organismeFormation: {
        siret: {
          ...organismeFormation.siret,
          onSubmitted: async (values) => {
            await _put("/api/v1/history", {
              // TODO
              idDossier: "619baec6fcdd030ba4e13c40",
              context: "organismeFormation.siret",
              from: "98765432400070",
              to: values["organismeFormation.siret"],
              how: "manuel",
              when: Date.now(),
              who: "Antoine Bigard", // TODO Get user
            });
          },
          onFetch: async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
              successed: true, // // TODO Fetch => true or false fetching success
              message: `Le Siret ${value} est un établissement fermé.`,
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

export function useCerfa() {
  const [isloaded, setIsLoaded] = useState(false);
  const [cerfa, setCerfa] = useRecoilState(cerfaAtom);
  const [error, setError] = useState(null);

  const getField = (cerfa, name) => {
    const field = name.split(".").reduce((p, c) => (p && p[c]) || null, cerfa);
    return field;
  };

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

  return { isloaded, cerfa, getField };
}

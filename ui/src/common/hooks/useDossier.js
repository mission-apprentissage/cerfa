import { useState, useEffect } from "react";
import { _get } from "../httpClient";

const hydrate = async () => {
  try {
    const schema = await _get("/api/v1/cerfa/schema");
    return {
      cerfa: {
        siretCFA: {
          name: "siretCFA",
          label: "N° SIRET CFA :",
          requiredMessage: "Le siret est obligatoire",
          schema: schema.organismeFormation.siret,
          onSubmitted: (values) => {
            console.log(JSON.stringify(values, null, 2));
          },
          onFetch: async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
              successed: false, // true or false fetching success
              message: `Le Siret ${value} est un établissement fermé.`,
            };
          },
          history: [
            {
              qui: "Antoine Bigard",
              role: "CFA",
              quoi: "A modifié la valeur du champ par 98765432400070",
              quand: Date.now(),
            },
            {
              qui: "Paul Pierre",
              role: "Employeur",
              quoi: "A modifié la valeur du champ par 98765432400019",
              quand: Date.now(),
            },
          ],
        },
      },
      users: [
        {
          name: "Paul Pierre",
          role: "Employeur",
        },
        {
          name: "Antoine Bigard",
          role: "CFA",
        },
        {
          name: "Pablo Hanry",
          role: "Apprenti",
        },
      ],
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export function useDossier() {
  const [isloaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [cerfa, setCerfa] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    hydrate()
      .then(({ users, cerfa }) => {
        if (!abortController.signal.aborted) {
          setCerfa(cerfa);
          setUsers(users);
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

  return { isloaded, users, cerfa };
}

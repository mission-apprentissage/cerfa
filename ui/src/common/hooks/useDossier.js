import { useState, useEffect } from "react";
// import { _get } from "../httpClient";

const hydrate = async () => {
  try {
    // const schema = await _get("/api/v1/cerfa/schema");
    return {
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
    // eslint-disable-next-line no-unreachable
  } catch (e) {
    console.log(e);
    return null;
  }
};

export function useDossier() {
  const [isloaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    hydrate()
      .then(({ users }) => {
        if (!abortController.signal.aborted) {
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

  return { isloaded, users };
}

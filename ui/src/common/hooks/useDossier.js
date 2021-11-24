import { useState, useEffect, useCallback } from "react";
import { _post, _get } from "../httpClient";

const hydrate = async (dossierId) => {
  if (!dossierId) return { dossier: null };
  try {
    const dossier = await _get(`/api/v1/dossier/${dossierId}`);
    return { dossier };
  } catch (e) {
    if (e.statusCode === 404) {
      return { dossier: null };
    } else {
      console.log({ e });
    }
    return { dossier: null };
  }
};

export function useDossier(dossierId = null) {
  const [isloaded, setIsLoaded] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [error, setError] = useState(null);

  const createDossier = useCallback(async () => {
    let d = null;
    try {
      d = await _post("/api/v1/dossier");
    } catch (e) {
      setError(e);
    } finally {
      setDossier(d);
    }
    return d;
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    hydrate(dossierId)
      .then(({ dossier }) => {
        if (!abortController.signal.aborted) {
          setDossier(dossier);
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
  }, [dossierId]);

  if (error !== null) {
    throw error;
  }

  return { isloaded, dossier, createDossier };
}

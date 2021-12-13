import { useState, useEffect, useCallback } from "react";
// import { useQuery } from "react-query";
import { useRecoilState } from "recoil";

import { _post, _get, _put } from "../httpClient";
import { dossierAtom } from "./dossierAtom";

const hydrate = async (dossierId) => {
  if (!dossierId) return { dossier: null };
  try {
    const dossier = await _get(`/api/v1/dossier/${dossierId}?dossierId=${dossierId}`);
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
  const [dossier, setDossier] = useRecoilState(dossierAtom);
  const [error, setError] = useState(null);

  const createDossier = useCallback(
    async (workspaceId) => {
      let d = null;
      try {
        d = await _post(`/api/v1/workspace/dossier?workspaceId=${workspaceId}`);
      } catch (e) {
        setError(e);
      } finally {
        setDossier(d);
      }
      return d;
    },
    [setDossier]
  );

  const saveDossier = useCallback(
    async (id) => {
      const dossierId = dossier?._id || id;
      let d = null;
      try {
        d = await _put(`/api/v1/dossier/${dossierId}/saved`, { dossierId });
      } catch (e) {
        setError(e);
      } finally {
        setDossier(d);
      }
      return d;
    },
    [dossier?._id, setDossier]
  );

  // const {
  //   data: dossier,
  //   isLoading,
  //   isFetching,
  // } = useQuery("dossier", () => _get(`/api/v1/dossier/${dossierId}?dossierId=${dossierId}`), {
  //   refetchOnWindowFocus: false,
  // });

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
  }, [dossierId, setDossier]);

  if (error !== null) {
    throw error;
  }

  return { isloaded, dossier, createDossier, saveDossier };
}

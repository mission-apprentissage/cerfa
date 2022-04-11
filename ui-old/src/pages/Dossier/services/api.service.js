import { _post, _put } from "../../../common/httpClient";

const saveCerfa = async ({ dossierId, cerfaId, data }) => {
  try {
    return await _put(`/api/v1/cerfa/${cerfaId}`, {
      ...data,
      dossierId,
    });
  } catch (e) {
    console.log(e);
  }
};

const fetchSiret = async ({ siret, dossierId, signal }) => {
  try {
    return await _post(`/api/v1/siret`, { siret, dossierId }, signal);
  } catch (e) {
    if (e.name !== "AbortError") throw e;
    return { error: e.prettyMessage };
  }
};

const fetchCodePostal = async ({ codePostal, dossierId, signal }) => {
  try {
    return await _post(`/api/v1/geo/cp`, { codePostal, dossierId }, signal);
  } catch (e) {
    if (e.name !== "AbortError") throw e;
    return { error: e.prettyMessage };
  }
};

const fetchNaf = async ({ naf, dossierId, signal }) => {
  try {
    return await _post(`/api/v1/naf/`, { naf, dossierId }, signal);
  } catch (e) {
    if (e.name !== "AbortError") throw e;
    return { error: e.prettyMessage };
  }
};

const fetchCfdrncp = async ({ rncp, cfd, dossierId, signal }) => {
  try {
    return await _post(`/api/v1/cfdrncp/`, { rncp, cfd, dossierId }, signal);
  } catch (e) {
    if (e.name !== "AbortError") throw e;
    return { error: e.prettyMessage };
  }
};

export const apiService = {
  saveCerfa,
  fetchSiret,
  fetchCodePostal,
  fetchNaf,
  fetchCfdrncp,
};

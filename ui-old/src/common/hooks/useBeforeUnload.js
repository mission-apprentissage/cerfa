import { useEffect, useRef } from "react";
import { useLocation, useRouteMatch, useHistory } from "react-router-dom";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { dossierAtom } from "./dossierAtom";
import { _delete } from "../httpClient";

window.dossierId = null;
window.dossierNotSaved = false;
window.historyDossier = null;
window.manuallyTriggered = false;

const isListeningAtom = atom({
  key: "dossier/contrat/beforeunload/listening",
  default: false,
});

export const useUnloadEffect = () => {
  const beforeUnload = useRef(async (e) => {
    if (!window.manuallyTriggered) {
      e.preventDefault();
      e.returnValue = "";
    }
    if (window.dossierId) {
      if (window.manuallyTriggered) {
        if (window.dossierNotSaved) {
          // eslint-disable-next-line no-restricted-globals
          const leave = confirm("Voulez-vous vraiment quitter cette page ?");
          if (leave) {
            await _delete(`/api/v1/dossier/entity/${window.dossierId}`);
          } else {
            window.historyDossier.goBack();
          }
        }
      }
    }
  });
  const history = useHistory();
  let { path } = useRouteMatch();
  let { pathname } = useLocation();
  const [isListening, setIsListening] = useRecoilState(isListeningAtom);
  const dossier = useRecoilValue(dossierAtom);

  useEffect(() => {
    const onBeforeUnload = (e) => beforeUnload.current(e);

    const contratPath = new RegExp(`^${path}/mes-dossiers/([0-9A-Fa-f]{24})/[a-z]+$`);
    const [, dId] = contratPath.exec(pathname) || [null, null];
    if (dId && contratPath.test(pathname)) {
      if (!isListening && dossier?.saved === false) {
        window.dossierId = dId;
        window.historyDossier = history;
        window.dossierNotSaved = true;
        window.removeEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("beforeunload", onBeforeUnload);
        setIsListening(true);
      }
    }

    return async () => {
      if (isListening) {
        const contratPath = new RegExp("^/mes-dossiers/mon-espace/[0-9A-Fa-f]{24}/[a-z]+$");
        if (contratPath.test(pathname)) {
          window.manuallyTriggered = true;
          window.dispatchEvent(new Event("beforeunload"));
        }
        window.dossierId = null;
        window.removeEventListener("beforeunload", onBeforeUnload);
        setIsListening(false);
      }
    };
  }, [beforeUnload, dossier, isListening, pathname, path, setIsListening, history]);
};

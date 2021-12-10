import { useEffect, useRef } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { dossierAtom } from "./dossierAtom";

window.dossierId = null;
window.manuallyTriggered = false;

const isListeningAtom = atom({
  key: "dossier/contrat/beforeunload/listening",
  default: false,
});

export const useUnloadEffect = (onLeave) => {
  const beforeUnload = useRef(async (e) => {
    if (!window.manuallyTriggered) {
      e.preventDefault();
      e.returnValue = "";
    }
    if (window.dossierId && onLeave) {
      onLeave({ dossierId: window.dossierId, internalLeave: window.manuallyTriggered });
    }
  });
  let match = useRouteMatch();
  let location = useLocation();
  const [isListening, setIsListening] = useRecoilState(isListeningAtom);
  const dossier = useRecoilValue(dossierAtom);

  useEffect(() => {
    const onBeforeUnload = (e) => beforeUnload.current(e);

    if (match?.params?.id && match?.path === "/mon-espace/mes-dossiers/:id/:step") {
      if (!isListening && dossier?.saved === false) {
        window.dossierId = match.params.id;
        window.removeEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("beforeunload", onBeforeUnload);
        setIsListening(true);
      }
    }

    return async () => {
      if (isListening) {
        const contratPath = new RegExp("^/mon-espace/mes-dossiers/[0-9A-Fa-f]{24}/[a-z]+$");
        if (contratPath.test(location.pathname)) {
          window.manuallyTriggered = true;
          window.dispatchEvent(new Event("beforeunload"));
        }
        window.dossierId = null;
        window.removeEventListener("beforeunload", onBeforeUnload);
        setIsListening(false);
      }
    };
  }, [beforeUnload, dossier, isListening, location.pathname, match, setIsListening]);
};

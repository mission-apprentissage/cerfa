import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { atom, useRecoilState } from "recoil";

window.dossierId = null;
window.manuallyTriggered = false;

const isListeningAtom = atom({
  key: "dossier/contrat/beforeunload/listening",
  default: false,
});

export const useUnloadEffect = (match, onLeave) => {
  const beforeUnload = useRef(async (e) => {
    if (!window.manuallyTriggered) {
      e.preventDefault();
      e.returnValue = "";
    }
    // console.log("triggerred", e);
    if (window.dossierId) {
      onLeave({ dossierId: window.dossierId, internalLeave: window.manuallyTriggered });
    }
  });

  let location = useLocation();
  const [isListening, setIsListening] = useRecoilState(isListeningAtom);

  useEffect(() => {
    const onBeforeUnload = (e) => beforeUnload.current(e);

    if (match?.params?.id && match?.path === "/dossiers/contrat/:id") {
      if (!isListening) {
        window.dossierId = match.params.id;
        window.addEventListener("beforeunload", onBeforeUnload);
        setIsListening(true);
      }
    }

    return async () => {
      if (isListening) {
        const contratPath = new RegExp("^/dossiers/contrat/[0-9A-Fa-f]{24}$");
        if (contratPath.test(location.pathname)) {
          window.manuallyTriggered = true;
          window.dispatchEvent(new Event("beforeunload"));
        }
        // console.log("remove beforeunload listeners");
        window.dossierId = null;
        window.removeEventListener("beforeunload", onBeforeUnload);
        setIsListening(false);
      }
    };
  }, [beforeUnload, isListening, location.pathname, match, setIsListening]);
};

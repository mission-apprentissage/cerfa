import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { workspacePathsAtom, workspaceTitlesAtom, workspaceTitleAtom, workspaceAtom } from "./workspaceAtoms";
import { setTitle as setTitlePage } from "../utils/pageUtils";
import { _get } from "../httpClient";
import useAuth from "./useAuth";

const hydrate = async (workspaceId) => {
  if (!workspaceId) return { workspace: null };
  try {
    const workspace = await _get(`/api/v1/workspace/entity/${workspaceId}?workspaceId=${workspaceId}`);
    return { workspace };
  } catch (e) {
    if (e.statusCode === 404) {
      return { workspace: null };
    } else {
      console.log({ e });
    }
    return { workspace: null };
  }
};

export function useWorkspace(path) {
  const { pathname } = useLocation();
  let [auth] = useAuth();
  let { workspaceId } = useParams();
  const [isloaded, setIsLoaded] = useState(false);
  const [isReloaded, setIsReloaded] = useState(false);
  const [error, setError] = useState(null);

  const [breadcrumbDetails, setBreadcrumbDetails] = useState([]);

  const [workspace, setWorkspace] = useRecoilState(workspaceAtom);
  const [paths, setPaths] = useRecoilState(workspacePathsAtom);
  const [titles, setTitles] = useRecoilState(workspaceTitlesAtom);
  const [title] = useRecoilState(workspaceTitleAtom);

  useEffect(() => {
    const abortController = new AbortController();
    setIsReloaded(false);
    hydrate(workspaceId || auth.workspaceId)
      .then(({ workspace }) => {
        if (!abortController.signal.aborted) {
          const pathTo = workspaceId ? path.replace(":workspaceId", workspaceId) : path;
          const paths = !workspaceId
            ? {
                base: pathTo,
                dossiers: `${pathTo}/mes-dossiers`,
                parametresUtilisateurs: `${pathTo}/parametres/utilisateurs`,
                parametresNotifications: `${pathTo}/parametres/notifications`,
                dossier: `${pathTo}/mes-dossiers/:id/:step`,
                nouveauDossier: `${pathTo}/mes-dossiers/nouveau-dossier`,
              }
            : {
                base: pathTo,
                dossiers: `${pathTo}/dossiers`,
                parametresUtilisateurs: `${pathTo}/parametres/utilisateurs`,
                parametresNotifications: `${pathTo}/parametres/notifications`,
                dossier: `${pathTo}/dossiers/:id/:step`,
                nouveauDossier: `${pathTo}/dossiers/nouveau-dossier`,
              };

          const titles = !workspaceId
            ? {
                base: "Mes dossiers",
                workspace: "Mon espace",
                dossiers: "Mes dossiers",
                parametres: "Paramètres",
                utilisateurs: "Utilisateurs",
                notifications: "Notifications",
                nouveauDossier: "Nouveau dossier",
                parametresUtilisateurs: "Paramètres Utilisateurs",
                parametresNotifications: "Paramètres Notifications",
                commencerNouveauDossier: "Commencer un nouveau dossier",
              }
            : {
                base: "Dossiers",
                workspace: `${workspace?.nom}`,
                dossiers: "Dossiers",
                parametres: "Paramètres",
                utilisateurs: "Utilisateurs",
                notifications: "Notifications",
                nouveauDossier: "Nouveau dossier",
                parametresUtilisateurs: "Paramètres Utilisateurs",
                parametresNotifications: "Paramètres Notifications",
                commencerNouveauDossier: "Commencer un nouveau dossier",
              };

          let bcDetails = [{ title: titles.base }];
          const baseBc = workspaceId ? [{ title: "Partagés avec moi", to: "/partages-avec-moi" }] : [];
          switch (pathname) {
            case paths.parametresUtilisateurs:
              setTitlePage(titles.parametresUtilisateurs);
              bcDetails = [
                ...baseBc,
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.parametres },
                { title: titles.utilisateurs },
              ];
              break;
            case paths.parametresNotifications:
              setTitlePage(titles.parametresNotifications);
              bcDetails = [
                ...baseBc,
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.parametres, to: paths.parametresUtilisateurs },
                { title: titles.notifications },
              ];
              break;
            case paths.dossiers:
              setTitlePage(titles.dossiers);
              bcDetails = [...baseBc, { title: titles.workspace }, { title: titles.dossiers }];
              break;
            case paths.nouveauDossier:
              setTitlePage(titles.commencerNouveauDossier);
              bcDetails = [
                ...baseBc,
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.dossiers, to: paths.dossiers },
                { title: titles.nouveauDossier },
              ];
              break;
            default:
              setTitlePage(titles.dossiers);
              bcDetails = [...baseBc, { title: titles.workspace }, { title: titles.dossiers }];
              break;
          }

          // case of ${paths.dossiers}/:id/:step`
          const contratPath = new RegExp(`^${paths.dossiers}/[0-9A-Fa-f]{24}/[a-z]+$`);
          if (contratPath.test(pathname) && title) {
            setTitlePage(title);
            bcDetails = [
              ...baseBc,
              { title: titles.workspace, to: paths.dossiers },
              { title: titles.dossiers, to: paths.dossiers },
              { title: title },
            ];
          }
          setBreadcrumbDetails(bcDetails);
          setPaths(paths);
          setTitles(titles);
          setWorkspace(workspace);
          setIsReloaded(true);
          setIsLoaded(true);
        }
      })
      .catch((e) => {
        if (!abortController.signal.aborted) {
          setError(e);
          setIsReloaded(false);
          setIsLoaded(false);
        }
      });
    return () => {
      abortController.abort();
    };
  }, [auth.workspaceId, path, pathname, setPaths, setTitles, setWorkspace, title, workspaceId]);

  if (error !== null) {
    throw error;
  }

  return { isloaded, isReloaded, workspace, breadcrumbDetails, paths, titles };
}

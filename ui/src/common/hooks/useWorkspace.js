import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

export function useWorkspace() {
  const { pathname } = useLocation();
  let [auth] = useAuth();
  let workspaceId = pathname.match(/^\/mes-dossiers\/espaces-partages\/([a-f0-9]{24})\//)?.[1];
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
          const pathTo = workspaceId ? `/mes-dossiers/espaces-partages/${workspaceId}` : `/mes-dossiers`;
          const paths = !workspaceId
            ? {
                base: pathTo,
                dossiers: `${pathTo}/mon-espace`,
                mesDossiers: `/mes-dossiers/mon-espace`,
                parametresUtilisateurs: `${pathTo}/parametres/utilisateurs`,
                parametresNotifications: `${pathTo}/parametres/notifications`,
                dossier: `${pathTo}/mon-espace/:id/:step`,
                nouveauDossier: `${pathTo}/mon-espace/nouveau-dossier`,
                sharedDossiers: `/mes-dossiers/dossiers-partages`,
              }
            : {
                base: pathTo,
                dossiers: `${pathTo}/dossiers`,
                mesDossiers: `/mes-dossiers/mon-espace`,
                parametresUtilisateurs: `${pathTo}/parametres/utilisateurs`,
                parametresNotifications: `${pathTo}/parametres/notifications`,
                dossier: `${pathTo}/dossiers/:id/:step`,
                nouveauDossier: `${pathTo}/dossiers/nouveau-dossier`,
                sharedDossiers: `/mes-dossiers/dossiers-partages`,
              };

          const titles = !workspaceId
            ? {
                base: "Mes dossiers",
                mesDossiers: "Mes dossiers",
                workspace: "Mon espace",
                myWorkspace: "Mon espace",
                sharedWorkspaces: "Espaces partagés avec moi",
                sharedDossiers: "Dossiers partagés avec moi",
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
                mesDossiers: "Mes dossiers",
                workspace: `${workspace?.nom}`,
                myWorkspace: "Mon espace",
                sharedWorkspaces: "Espaces partagés avec moi",
                sharedDossiers: "Dossiers partagés avec moi",
                dossiers: "Espaces partagés avec moi",
                parametres: "Paramètres",
                utilisateurs: "Utilisateurs",
                notifications: "Notifications",
                nouveauDossier: "Nouveau dossier",
                parametresUtilisateurs: "Paramètres Utilisateurs",
                parametresNotifications: "Paramètres Notifications",
                commencerNouveauDossier: "Commencer un nouveau dossier",
              };

          let bcDetails = [{ title: titles.base }];
          const baseBc = workspaceId ? [{ title: "Mes dossiers", to: "/mes-dossiers/mon-espace" }] : [];
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
              bcDetails = [...baseBc, { title: titles.dossiers }, { title: titles.workspace }];
              break;
            case paths.sharedDossiers:
              setTitlePage(titles.sharedDossiers);
              bcDetails = [...baseBc, { title: titles.dossiers, to: paths.dossiers }, { title: titles.sharedDossiers }];
              break;
            case paths.nouveauDossier:
              setTitlePage(titles.commencerNouveauDossier);
              bcDetails = [
                ...baseBc,
                { title: titles.dossiers, to: paths.dossiers },
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.nouveauDossier },
              ];
              break;
            default:
              setTitlePage(titles.dossiers);
              bcDetails = [...baseBc, { title: titles.dossiers }, { title: titles.workspace }];
              break;
          }

          // case of ${paths.dossiers}/:id/:step`
          const contratPath = new RegExp(`^${paths.dossiers}/[0-9A-Fa-f]{24}/[a-z]+$`);
          if (contratPath.test(pathname) && title) {
            setTitlePage(title);
            bcDetails = [
              ...baseBc,
              { title: titles.dossiers, to: paths.dossiers },
              { title: titles.workspace, to: paths.dossiers },
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
  }, [auth.workspaceId, pathname, setPaths, setTitles, setWorkspace, title, workspaceId]);

  if (error !== null) {
    throw error;
  }

  return { isloaded, isReloaded, workspace, breadcrumbDetails, paths, titles };
}

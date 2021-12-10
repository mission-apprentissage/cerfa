import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { workspacePathsAtom, workspaceTitlesAtom } from "./workspaceAtoms";
import { setTitle as setTitlePage } from "../utils/pageUtils";

const hydrate = async (workspaceId) => {
  if (!workspaceId) return { workspace: null };
  try {
    await new Promise((resolve) => setTimeout(resolve, 200)); // TODO Fetch
    return { workspace: null };
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
  let { workspaceId } = useParams();
  const [isloaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [workspace, setWorkspace] = useState(null);
  const [title, setTitle] = useState();
  const [breadcrumbDetails, setBreadcrumbDetails] = useState([]);

  const [paths, setPaths] = useRecoilState(workspacePathsAtom);
  const [titles, setTitles] = useRecoilState(workspaceTitlesAtom);

  //bcDetails = [{ title: "Partagés avec moi" }, { title: "Dossiers" }];

  useEffect(() => {
    const abortController = new AbortController();

    hydrate(workspaceId)
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
                workspace: `Espace ${workspaceId}`,
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
          switch (pathname) {
            case paths.parametresUtilisateurs:
              setTitlePage(titles.parametresUtilisateurs);
              bcDetails = [
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.parametres },
                { title: titles.utilisateurs },
              ];
              break;
            case paths.parametresNotifications:
              setTitlePage(titles.parametresNotifications);
              bcDetails = [
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.parametres, to: paths.parametresUtilisateurs },
                { title: titles.notifications },
              ];
              break;
            case paths.dossiers:
              setTitlePage(titles.dossiers);
              bcDetails = [{ title: titles.workspace }, { title: titles.dossiers }];
              break;
            case paths.nouveauDossier:
              setTitlePage(titles.commencerNouveauDossier);
              bcDetails = [
                { title: titles.workspace, to: paths.dossiers },
                { title: titles.dossiers, to: paths.dossiers },
                { title: titles.nouveauDossier },
              ];
              break;
            default:
              setTitlePage(titles.dossiers);
              bcDetails = [{ title: titles.workspace }, { title: titles.dossiers }];
              break;
          }

          // case of ${paths.dossiers}/:id/:step`
          const contratPath = new RegExp(`^${paths.dossiers}/[0-9A-Fa-f]{24}/[a-z]+$`);
          if (contratPath.test(pathname) && title) {
            setTitlePage(title);
            bcDetails = [
              { title: titles.workspace, to: paths.dossiers },
              { title: titles.dossiers, to: paths.dossiers },
              { title: title },
            ];
          }
          setBreadcrumbDetails(bcDetails);
          setPaths(paths);
          setTitles(titles);
          setWorkspace(workspace);
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
  }, [path, pathname, setPaths, setTitles, title, workspaceId]);

  if (error !== null) {
    throw error;
  }

  return { isloaded, workspace, breadcrumbDetails, setTitle, paths, titles, workspaceId };
}

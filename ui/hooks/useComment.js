import { useState, useEffect, useCallback } from "react";
// import { _get } from "../httpClient";

const commentsC = {
  "organismeFormation.siret": {
    context: "organismeFormation.siret",
    discussions: [
      {
        resolve: false,
        feed: [
          {
            contenu: "Je ne sais pas remplir ce champ. Pourriez-vous m'aider svp?",
            dateAjout: Date.now(),
            createdBy: "Antoine Bigard",
            role: "CFA",
            notify: ["Paul Pierre"],
          },
          {
            contenu: "C'est fait!",
            dateAjout: Date.now(),
            createdBy: "Paul Pierre",
            role: "Employeur",
            notify: ["Antoine Bigard", "Pablo Hanry"],
          },
        ],
      },
    ],
  },
};

const hydrate = async () => {
  try {
    // eslint-disable-next-line no-undef
    await new Promise((resolve) => setTimeout(resolve, 200)); // TODO Fetch comments
    return {
      comments: commentsC,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export function useComment() {
  const [isloaded, setIsLoaded] = useState(false);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const onAddComment = useCallback(async (context, { comment, notify }) => {
    try {
      commentsC[context].discussions[0].feed.push({
        contenu: comment,
        dateAjout: Date.now(),
        createdBy: "Paul Pierre", // TODO Get user
        role: "Employeur", // TODO Get user
        notify,
      });
    } catch (e) {
      setError(e);
    } finally {
      setComments(commentsC);
    }
  }, []);

  const onResolveFeed = useCallback(async (context) => {
    try {
      commentsC[context].discussions[0] = {
        resolve: false,
        feed: [],
      };
    } catch (e) {
      setError(e);
    } finally {
      setComments(commentsC);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    hydrate()
      .then(({ comments }) => {
        if (!abortController.signal.aborted) {
          setComments(comments);
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

  return { isloaded, comments, onAddComment, onResolveFeed };
}

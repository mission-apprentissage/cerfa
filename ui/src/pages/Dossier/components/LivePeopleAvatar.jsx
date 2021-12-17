import React, { useEffect } from "react";
import { AvatarGroup, Avatar, Fade } from "@chakra-ui/react";

import { io } from "socket.io-client";
import { useQueryClient, useQuery } from "react-query";

const useWebSocketSubscription = () => {
  const queryClient = useQueryClient();

  const { data: liveUsers } = useQuery("dossier:live_users", () => Promise.resolve([]), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const socket = io("/dossier");
    socket.on("connect", () => {
      console.log(socket.id);

      socket.emit("dossier:connect", { dossierId: "61bb790a17bde53d0d073336" }, ({ status, ...rest }) => {
        if (status === "KO") {
          console.log(rest);
          return socket.disconnect();
        }
      });
    });

    socket.on("dossier:live_users", async (payload) => {
      // console.log("event received", payload); // Received once
      queryClient.setQueryData("dossier:live_users", (oldData) => payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return { liveUsers: liveUsers || [] };
};

// TODO @antoine why double rendering when receiveing a message (the event is received once) ??
export default React.memo(() => {
  const { liveUsers } = useWebSocketSubscription();

  return (
    <AvatarGroup size="md" max={4}>
      {liveUsers.map((liveUser, i) => {
        return (
          <Fade in={true} key={i}>
            <Avatar name={`${liveUser.prenom} ${liveUser.nom}`} />
          </Fade>
        );
      })}
    </AvatarGroup>
  );
});

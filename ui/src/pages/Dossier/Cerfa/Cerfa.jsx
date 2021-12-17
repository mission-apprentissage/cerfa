import React, { lazy } from "react";
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react";

import { AddFill, SubtractLine } from "../../../theme/components/icons";

import { io } from "socket.io-client";
import { useQueryClient } from "react-query";

const FormFormation = lazy(() => import("./components/FormFormation"));

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: Infinity,
//     },
//   },
// });

function useDossierSocket() {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const socket = io("/dossier");
    socket.on("connect", () => {
      console.log(socket.id);

      socket.emit("dossier:iamhere", { dossierId: "61bb790a17bde53d0d073336" }, ({ status, result }) => {
        if (status === "KO") {
          return socket.disconnect();
        }
        console.log(result);
        // queryClient.invalidateQueries(result);
        // queryClient.setQueriesData("wsQuery", (oldData) => {
        //   return result;
        // })
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return {};
}

export default () => {
  useDossierSocket();

  return (
    <Accordion allowMultiple allowToggle mt={12}>
      {[
        {
          title: "LA FORMATION",
          Component: FormFormation,
        },
        // {
        //   title: "CADRE RÉSERVÉ À L’ORGANISME EN CHARGE DU DÉPÔT DU CONTRAT",
        //   Component: FormSubmittingContract,
        // },
      ].map(({ title, Component }, key) => {
        return (
          <AccordionItem border="none" key={key}>
            {({ isExpanded }) => (
              <>
                <AccordionButton bg="#F9F8F6">
                  <Box flex="1" textAlign="left">
                    {title}
                  </Box>
                  {isExpanded ? (
                    <SubtractLine fontSize="12px" color="bluefrance" />
                  ) : (
                    <AddFill fontSize="12px" color="bluefrance" />
                  )}
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Component />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

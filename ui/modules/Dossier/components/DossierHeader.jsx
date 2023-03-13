import React from "react";
import { Heading, Button, Badge, HStack, Text, useDisclosure, Flex, Box, Spinner, Link } from "@chakra-ui/react";

import { hasContextAccessTo } from "../../../common/utils/rolesUtils";

import { StatusBadge } from "../../../components/StatusBadge/StatusBadge";
import LivePeopleAvatar from "./LivePeopleAvatar";
import { InviteModal } from "./InviteModal";

import { AvatarPlus, DownloadLine } from "../../../theme/components/icons";
import { useRecoilValue } from "recoil";
import { autoSaveStatusAtom } from "../formEngine/hooks/useAutoSave";
import { CheckIcon } from "@chakra-ui/icons";
import { workspaceTitleAtom } from "../../../hooks/workspaceAtoms";

const AutoSaveBadge = () => {
  const status = useRecoilValue(autoSaveStatusAtom);
  return (
    <Badge variant="solid" bg="grey.100" color="grey.800" textStyle="sm" px="15px" ml="10px">
      {status === "OK" && (
        <Text as="i" display="flex" alignItems="center">
          Sauvegarde automatique activée <CheckIcon aria-hidden={true} w="10px" h="10px" ml="2" color="grey" />
        </Text>
      )}
      {status === "PENDING" && (
        <Text as="i">
          {" "}
          <Text as="i" display="flex" alignItems="center">
            Sauvegarde en cours <Spinner w="10px" h="10px" ml="2" />
          </Text>
        </Text>
      )}
      {status === "ERROR" && <Text as="i">Non sauvegardé</Text>}
    </Badge>
  );
};

const DossierHeader = ({ activeStep, dossier }) => {
  const nomDossier = useRecoilValue(workspaceTitleAtom);
  const inviteModal = useDisclosure();
  return (
    <Flex mt={6} flexDirection="column">
      <HStack w="full">
        <Heading as="h1" flexGrow="1">
          {nomDossier}
          <StatusBadge status={dossier?.etat} ml={5} />
          <AutoSaveBadge />
        </Heading>
        <HStack>
          <LivePeopleAvatar />
          {[0, 1].includes(activeStep) && hasContextAccessTo(dossier, "dossier/voir_contrat_pdf/telecharger") && (
            <Button
              variant="secondary"
              size="md"
              as={Link}
              target={"_blank"}
              href={`/api/v1/cerfa/pdf/${dossier.cerfaId}/?dossierId=${dossier._id}`}
            >
              <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} />
            </Button>
          )}
          {hasContextAccessTo(dossier, "dossier/page_parametres/gestion_acces") && (
            <>
              <Button size="md" onClick={inviteModal.onOpen} variant="secondary">
                <AvatarPlus />
                <Text as="span" ml={2}>
                  Partager
                </Text>
              </Button>
              <InviteModal
                title="Partager le dossier"
                size="md"
                isOpen={inviteModal.isOpen}
                onClose={inviteModal.onClose}
              />
            </>
          )}
        </HStack>
      </HStack>
      <Box>
        <Text color="mgalt" as="i" fontSize="0.9rem">
          Numéro de {dossier?.etat === "TRANSMIS" ? "télétransmission" : "dossier"} : {dossier?._id} / Version{" "}
          {dossier?.version}
        </Text>
      </Box>
    </Flex>
  );
};
export default DossierHeader;

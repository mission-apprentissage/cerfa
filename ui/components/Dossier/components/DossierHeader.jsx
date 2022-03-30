import React from "react";
import { Heading, Button, Badge, HStack, Text, useDisclosure, Flex, Box } from "@chakra-ui/react";

import { hasContextAccessTo } from "../../../common/utils/rolesUtils";

import { StatusBadge } from "../../StatusBadge/StatusBadge";
import LivePeopleAvatar from "./LivePeopleAvatar";
import { InviteModal } from "./InviteModal";

import { AvatarPlus } from "../../../theme/components/icons";

const DossierHeader = ({ dossier }) => {
  const inviteModal = useDisclosure();
  return (
    <Flex mt={6} flexDirection="column">
      <HStack w="full">
        <Heading as="h1" flexGrow="1">
          {dossier?.nom}
          <StatusBadge status={dossier?.etat} ml={5} />
          <Badge variant="solid" bg="grey.100" color="grey.500" textStyle="sm" px="15px" ml="10px">
            <Text as="i">{!dossier?.saved ? "Non sauvegardé" : `Sauvegarde automatique activée`}</Text>
          </Badge>
        </Heading>
        <HStack>
          <LivePeopleAvatar />
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
          Numéro de télétransmission : {dossier?._id}
        </Text>
      </Box>
    </Flex>
  );
};
export default DossierHeader;

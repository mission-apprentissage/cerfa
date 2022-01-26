import React from "react";
import { Heading, Button, Badge, HStack, Text, useDisclosure } from "@chakra-ui/react";

import { hasContextAccessTo } from "../../../common/utils/rolesUtils";

import { StatusBadge } from "../../../common/components/StatusBadge";
import LivePeopleAvatar from "./LivePeopleAvatar";
import { InviteModal } from "./InviteModal";

import { AvatarPlus } from "../../../theme/components/icons";

export default ({ dossier }) => {
  const inviteModal = useDisclosure();
  return (
    <HStack mt={6}>
      <Heading as="h1" flexGrow="1">
        {dossier.nom}
        <StatusBadge status={dossier.etat} ml={5} />
        <Badge variant="solid" bg="grey.100" color="grey.500" textStyle="sm" px="15px" ml="10px">
          <Text as="i">{!dossier.saved ? "Non sauvegardé" : `Sauvegarde automatique activée`}</Text>
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
  );
};

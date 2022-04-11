import { useRecoilValue } from "recoil";
import { dossierAtom } from "../../../../hooks/useDossier/dossierAtom";
import { Avatar, Divider, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { StatusBadge } from "../../../StatusBadge/StatusBadge";
import React from "react";

export const Signataires = () => {
  const dossier = useRecoilValue(dossierAtom);
  const { apprenti, employeur, cfa } = dossier.signataires;
  return (
    <Stack>
      {cfa && (
        <>
          <Flex>
            <HStack flexGrow={1}>
              <Avatar size="sm" name={`${cfa.firstname} ${cfa.lastname}`} />
              <Text>{`${cfa.firstname} ${cfa.lastname}`}</Text>
              <Text fontWeight="bold">{`(cfa)`}</Text>
            </HStack>
            <Flex>
              <StatusBadge status={cfa.status} h="28px" />
            </Flex>
          </Flex>
          <Divider />
        </>
      )}
      {employeur && (
        <>
          <Flex>
            <HStack flexGrow={1}>
              <Avatar size="sm" name={`${employeur.firstname} ${employeur.lastname}`} />
              <Text>{`${employeur.firstname} ${employeur.lastname}`}</Text>
              <Text fontWeight="bold">{`(Employeur)`}</Text>
            </HStack>
            <Flex>
              <StatusBadge status={employeur.status} h="28px" />
            </Flex>
          </Flex>
          <Divider />
        </>
      )}
      {apprenti && (
        <>
          <Flex>
            <HStack flexGrow={1}>
              <Avatar size="sm" name={`${apprenti.firstname} ${apprenti.lastname}`} />
              <Text>{`${apprenti.firstname} ${apprenti.lastname}`}</Text>
              <Text fontWeight="bold">{`(Apprenti(e))`}</Text>
            </HStack>
            <Flex>
              <StatusBadge status={apprenti.status} h="28px" />
            </Flex>
          </Flex>
          <Divider />
        </>
      )}
    </Stack>
  );
};

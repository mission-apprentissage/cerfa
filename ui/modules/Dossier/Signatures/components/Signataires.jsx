import { useRecoilValue } from "recoil";
import { dossierAtom } from "../../atoms";
import { Avatar, Divider, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { StatusBadge } from "../../../../components/StatusBadge/StatusBadge";
import React, { useEffect, useState } from "react";
import { _post } from "../../../../common/httpClient";
import { valueSelector } from "../../formEngine/atoms";

export const Signataires = () => {
  const [orgaDepot, setOrgaDepot] = useState(null);

  const dossier = useRecoilValue(dossierAtom);
  const code_region = useRecoilValue(valueSelector("employeur.adresse.region"));
  const code_dpt = useRecoilValue(valueSelector("employeur.adresse.departement"));

  const { apprenti, employeur, cfa, legal } = dossier.signataires;

  // On récupère la valeure la plus actuelle de la DDETS / DREETS
  useEffect(() => {
    const run = async () => {
      if (!orgaDepot) {
        if (code_region && code_dpt) {
          const response = await _post(`/api/v1/dreetsddets/`, {
            code_region,
            code_dpt,
            dossierId: dossier._id,
          });

          setOrgaDepot(response.ddets?.DDETS ?? response.dreets.DREETS_DREETS);
        }
      }
    };
    run();
  }, [code_dpt, code_region, orgaDepot, dossier._id]);

  return (
    <>
      <Text>
        {`Lorsque l'ensemble des signatures seront réunies, votre contrat sera automatiquement envoyé à ${orgaDepot}`}
      </Text>
      <Stack mt={8}>
        {cfa && (
          <>
            <Flex>
              <HStack flexGrow={1}>
                <Avatar size="sm" name={`${cfa.firstname} ${cfa.lastname}`} />
                <Text>{`${cfa.firstname} ${cfa.lastname} <${cfa.email}>`}</Text>
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
                <Text>{`${employeur.firstname} ${employeur.lastname} <${employeur.email}>`}</Text>
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
                <Text>{`${apprenti.firstname} ${apprenti.lastname} <${apprenti.email}>`}</Text>
                <Text fontWeight="bold">{`(Apprenti(e))`}</Text>
              </HStack>
              <Flex>
                <StatusBadge status={apprenti.status} h="28px" />
              </Flex>
            </Flex>
            <Divider />
          </>
        )}
        {legal && (
          <>
            <Flex>
              <HStack flexGrow={1}>
                <Avatar size="sm" name={`${legal.firstname} ${legal.lastname}`} />
                <Text>{`${legal.firstname} ${legal.lastname} <${legal.email}>`}</Text>
                <Text fontWeight="bold">{`(Représentant légal)`}</Text>
              </HStack>
              <Flex>
                <StatusBadge status={legal.status} h="28px" />
              </Flex>
            </Flex>
            <Divider />
          </>
        )}
        {dossier.etat === "SIGNATURES_REFUS" && (
          <Stack>
            <Text fontWeight={"bold"}>
              {dossier.signataires.commentaireRefus ? "Commentaire de refus :" : "Aucun commentaire de refus"}
            </Text>
            {dossier.signataires.commentaireRefus && <Text>{`${dossier.signataires.commentaireRefus}`}</Text>}
          </Stack>
        )}
      </Stack>
    </>
  );
};

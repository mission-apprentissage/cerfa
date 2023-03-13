import { Box, Center, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { dossierAtom } from "../atoms";
import Tooltip from "../../../components/Tooltip/Tooltip";
import { _post } from "../../../common/httpClient";
import { valueSelector } from "../formEngine/atoms";
import { Step, Steps } from "chakra-ui-steps-rework-mna";
import { DateTime } from "luxon";

const Suivi = () => {
  const dossier = useRecoilValue(dossierAtom);
  const code_region = useRecoilValue(valueSelector("employeur.adresse.region"));
  const code_dpt = useRecoilValue(valueSelector("employeur.adresse.departement"));

  // TODO : duplicate Signataires.jsx
  const [serviceInstruction, setServiceInstruction] = useState(null);

  if (
    !(
      dossier.etat === "TRANSMIS" ||
      dossier.etat === "EN_COURS_INSTRUCTION" ||
      dossier.etat === "EN_ATTENTE_COMPLEMENT" ||
      dossier.etat === "REFUSE" ||
      dossier.etat === "DEPOSE"
    )
  ) {
    return (
      <Box mt={12} pt={2} minH="25vh">
        <Center>
          <Tooltip variant="alert">
            <Text>Le dossier doit être signé avant de procéder à sa télétransmission et d’accéder à son suivi.</Text>
          </Tooltip>
        </Center>
      </Box>
    );
  }
  // On récupère la valeure la plus actuelle de la DDETS / DREETS

  useEffect(() => {
    const run = async () => {
      if (!serviceInstruction) {
        if (code_region && code_dpt) {
          const response = await _post(`/api/v1/dreetsddets/`, {
            code_region,
            code_dpt,
            dossierId: dossier._id,
          });

          setServiceInstruction(response.ddets?.DDETS ?? response.dreets?.DREETS_DREETS);
        }
      }
    };
    run();
  }, [code_dpt, code_region, serviceInstruction, dossier._id]);
  // On ne peut pas accéder à l'écran de suivi de télétransmission du dossier si la partie signature n'est pas terminée

  const listStatusPdigi = [
    {
      titre: "Dossier transmis",
      commentaire: `Votre dossier a bien été transmis à ${serviceInstruction}`,
    },
  ];

  // Convertir les statut agecap en statut pdigi
  dossier.statutAgecap.forEach((statutAgecap) => {
    let titre = "";
    let commentaire = "";
    let content = "";
    let date = statutAgecap.dateMiseAJourStatut
      ? `- ${DateTime.fromSQL(statutAgecap.dateMiseAJourStatut).toFormat("dd/MM/y")}`
      : " ";

    if (statutAgecap.statut === "En cours d'instruction") {
      titre = "Dossier en cours d'instruction";
      commentaire = "Un agent a pris en charge votre dossier, il est en cours d'instruction";
    }

    if (statutAgecap.statut === "En attente de complément") {
      titre = "Dossier en attente de complément";
      content = (
        <Text textAlign={"left"} fontSize={"sm"} color={"gray.800"} fontWeight={"300"}>
          Votre dossier a été renvoyé pour modification par {serviceInstruction} pour les raisons suivantes :<br />
          {statutAgecap.commentaire}
          <br />
          <br />
          En cliquant sur le bouton &quot;modifier&quot;, vous allez être renvoyé sur les premières étapes de complétion
          du contrat.
        </Text>
      );
    }

    if (statutAgecap.statut === "Non déposable") {
      titre = "Dossier à compléter";
      let commentaireMotifNonDepot = "";
      if (statutAgecap.commentaireMotifNonDepot) {
        commentaireMotifNonDepot = " : " + statutAgecap.commentaireMotifNonDepot;
      }
      commentaire = `Votre ${serviceInstruction} vous a transmis le message suivant : ${statutAgecap.libelleMotifNonDepot}${commentaireMotifNonDepot}`;
    }

    if (statutAgecap.statut === "Déposé") {
      titre = "Dossier déposé";
      commentaire = `Votre dossier a été déposé avec le numéro de dépôt ${statutAgecap.numDepot}`;
      if (statutAgecap.numAvenant) commentaire += `-${statutAgecap.numAvenant}`;
    }

    listStatusPdigi.push({ titre, commentaire, content, date });
  });

  return (
    <Flex flexDir="column" width="100%" mt={9}>
      <Steps activeStep={listStatusPdigi.length - 1} orientation={"vertical"} colorScheme="telegram">
        {listStatusPdigi.map((statutPdigi, index) => {
          let label = statutPdigi.titre;
          if (statutPdigi.date) label += " " + statutPdigi.date;

          return (
            <Step
              key={index}
              label={label}
              description={statutPdigi.commentaire}
              icon={() => (
                <Box color={"white"} fontWeight="bold">
                  {listStatusPdigi.length}
                </Box>
              )}
            >
              {statutPdigi.content}
            </Step>
          );
        })}
      </Steps>
    </Flex>
  );
};

export default Suivi;

import { Box, Center, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { dossierAtom } from "../atoms";
import Tooltip from "../../../components/Tooltip/Tooltip";
import { _post } from "../../../common/httpClient";
import { valueSelector } from "../formEngine/atoms";

const Suivi = () => {
  const dossier = useRecoilValue(dossierAtom);
  const code_region = useRecoilValue(valueSelector("employeur.adresse.region"));
  const code_dpt = useRecoilValue(valueSelector("employeur.adresse.departement"));

  // TODO : duplicate Signataires.jsx
  const [orgaDepot, setOrgaDepot] = useState(null);
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

          setOrgaDepot(response.ddets?.DDETS ?? response.dreets?.DREETS_DREETS);
        }
      }
    };
    run();
  }, [code_dpt, code_region, orgaDepot, dossier._id]);

  // On ne peut pas accéder à l'écran de suivi de télétransmission du dossier si la partie signature n'est pas terminée
  if (
    !(
      dossier.etat === "TRANSMIS" ||
      dossier.etat === "EN_COURS_INSTRUCTION" ||
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

  const listStatusPdigi = [
    {
      key: 0,
      titre: "Dossier transmis",
      commentaire: `Votre dossier a bien été transmis à ${orgaDepot}`,
    },
  ];

  // Convertir les statut agecap en statut pdigi
  dossier.statutAgecap.forEach((statutAgecap, index) => {
    let key = ++index;
    let titre = "";
    let commentaire = "";
    let date = `- ${statutAgecap.dateMiseAJourStatut}`;

    if (statutAgecap.statut === "En cours d'instruction") {
      titre = "Dossier en cours d'instruction";
      commentaire = "Un agent a pris en charge votre dossier, il est en cours d'instruction";
    }

    if (statutAgecap.statut === "Non déposable") {
      titre = "Dossier à compléter";
      commentaire = `Votre [DREETS/DDETS] vous a transmis le message suivant : ${statutAgecap.libelleMotifNonDepot} : ${statutAgecap.commentaireMotifNonDepot}`;
    }

    if (statutAgecap.statut === "Déposé") {
      titre = "Dossier déposé";
      commentaire = `Votre dossier a été déposé avec le numéro de dépôt ${statutAgecap.numDepot}`;
      if (statutAgecap.numAvenant) commentaire += `-${statutAgecap.numAvenant}`;
    }

    listStatusPdigi.push({ key, titre, commentaire, date });
  });

  return (
    <Box mt={8}>
      <List spacing={3}>
        {listStatusPdigi.map((statutPdigi) => {
          return (
            <ListItem key={statutPdigi.key}>
              <ListIcon as={MdCheckCircle} color="green.500" />
              {statutPdigi.titre} - {statutPdigi.commentaire} {statutPdigi.date}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Suivi;

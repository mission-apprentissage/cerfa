import React, { useEffect, useState } from "react";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from "@chakra-ui/react";

import { _get } from "../../../common/httpClient";

import FormEmployer from "./components/FormEmployer";
import FormLearner from "./components/FormLearner";
import FormLearningMaster from "./components/FormLearningMaster";
import FormContract from "./components/FormContract";
import FormFormation from "./components/FormFormation";
// import FormSubmittingContract from "./components/FormSubmittingContract";
import Input from "./components/Input";

const tabsFormAccordion = [
  {
    title: "EMPLOYEUR",
    Component: FormEmployer,
  },
  {
    title: "APPRENTI(E)",
    Component: FormLearner,
  },
  {
    title: "LE MAÎTRE D’APPRENTISSAGE",
    Component: FormLearningMaster,
  },
  {
    title: "LE CONTRAT",
    Component: FormContract,
  },
  {
    title: "LA FORMATION",
    Component: FormFormation,
  },
  // {
  //   title: "CADRE RÉSERVÉ À L’ORGANISME EN CHARGE DU DÉPÔT DU CONTRAT",
  //   Component: FormSubmittingContract,
  // },
];

export default () => {
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    async function run() {
      try {
        // TODO CUSTOM HOOK Dossier
        const schema = await _get("/api/v1/cerfa/schema");
        setFormState({
          siretCFA: {
            name: "siretCFA",
            label: "N° SIRET CFA :",
            requiredMessage: "Le siret est obligatoire",
            schema: schema.organismeFormation.siret,
            onSubmitted: (values) => {
              console.log(JSON.stringify(values, null, 2));
            },
            onFetch: async (value) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return {
                successed: false, // true or false fetching success
                message: `Le Siret ${value} est un établissement fermé.`,
              };
            },
            onAddComment: async (comment) => {
              console.log("Add comment", comment);
            },
            onResolveComments: async () => {
              console.log("resolve");
            },
            commentaires: {
              contexte: "siret",
              resolve: false,
              discussion: [
                {
                  contenu: "Je ne sais pas remplir ce champ. Pourriez-vous m'aider svp?",
                  dateAjout: Date.now(),
                  qui: "Antoine Bigard",
                  role: "CFA",
                  notifify: ["Paul Pierre"],
                },
                {
                  contenu: "C'est fait!",
                  dateAjout: Date.now(),
                  qui: "Paul Pierre",
                  role: "Employeur",
                  notifify: ["Antoine Bigard", "Pablo Hanry"],
                },
              ],
            },
            history: [
              {
                qui: "Antoine Bigard",
                role: "CFA",
                quoi: "A modifié la valeur du champ par 98765432400070",
                quand: Date.now(),
              },
              {
                qui: "Paul Pierre",
                role: "Employeur",
                quoi: "A modifié la valeur du champ par 98765432400019",
                quand: Date.now(),
              },
            ],
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
    run();
  }, []);

  if (!formState) return null;

  return (
    <Accordion allowToggle mt={16}>
      <Input
        name={formState.siretCFA.name}
        label={formState.siretCFA.label}
        requiredMessage={formState.siretCFA.requiredMessage}
        schema={formState.siretCFA.schema}
        onSubmitted={formState.siretCFA.onSubmitted}
        onFetch={formState.siretCFA.onFetch}
        onAddComment={formState.siretCFA.onAddComment}
        onResolveComments={formState.siretCFA.onResolveComments}
        commentaires={formState.siretCFA.commentaires}
        history={formState.siretCFA.history}
        users={[
          {
            name: "Paul Pierre", // TODO CUSTOM HOOK ~ useUserDossier
            role: "Employeur",
          },
          {
            name: "Antoine Bigard",
            role: "CFA",
          },
          {
            name: "Pablo Hanry",
            role: "Apprenti",
          },
        ]}
        mb="3"
      />
      {tabsFormAccordion.map(({ title, Component }, key) => {
        return (
          <AccordionItem key={key}>
            <AccordionButton bg="secondaryBackground">
              <Box flex="1" textAlign="left">
                <Heading fontSize="1rem">{title}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Component />
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

import React from "react";
import { Text, Flex, UnorderedList, ListItem } from "@chakra-ui/react";
import { _post } from "../../../common/httpClient";
import PromptModal from "../../../common/components/Modals/PromptModal";
import {
  useRecoilValue,
  // useSetRecoilState
} from "recoil";

import { dossierAtom } from "../../../common/hooks/useDossier/dossierAtom";

import { Warning } from "../../../theme/components/icons";

export default ({ ...modal }) => {
  const dossier = useRecoilValue(dossierAtom);
  // const setDossier = useSetRecoilState(dossierAtom);
  const onSignClicked = async () => {
    await _post(`/api/v1/sign_document`, {
      dossierId: dossier._id,
      cerfaId: dossier.cerfaId,
    });
    window.location.reload();
    // setDossier(reponse);
  };

  return (
    <>
      <PromptModal
        title="Signatures électronique"
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        onOk={() => {
          onSignClicked();
          modal.onClose();
        }}
        onKo={() => {
          modal.onClose();
        }}
        bgOverlay="rgba(0, 0, 0, 0.28)"
        okText={"Déclencher"}
        koText={"Revenir"}
      >
        <Flex>
          <Warning boxSize="6" mr={2} />
          <Text>Veuillez vérifier attentivement les informations renseignés pour les signataires</Text>
        </Flex>
        <UnorderedList ml="30px !important" mt={3}>
          >
          <ListItem>
            Afin de recevoir le lien de signature, <strong>chaque courriel doivent être correctes</strong>
          </ListItem>
          <ListItem>
            Afin de recevoir les codes de signatures par sms, les télephones doivent être
            <strong> des numéros de télephone mobile</strong>
          </ListItem>
        </UnorderedList>
        <Text mb={1} mt={5}>
          La signature électronique est réalisé via l'outil Yousgin. <br />
          Une fois la procedure de signature déclencher, vous pourrez plus changer les informations des signataires.
        </Text>
      </PromptModal>
    </>
  );
};

import React from "react";
import { Text } from "@chakra-ui/react";
import { _post } from "../../../common/httpClient";
import PromptModal from "../../../common/components/Modals/PromptModal";

export default ({ dossier, ...modal }) => {
  const onSignClicked = async () => {
    const reponse = await _post(`/api/v1/sign_document`, {
      dossierId: dossier._id,
      cerfaId: dossier.cerfaId,
    });
    console.log(reponse);
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
        koText={"Abandonner"}
      >
        <Text mb={1}>La signature électronique sera réalisé via l'outil Yousgin.</Text>
      </PromptModal>
    </>
  );
};

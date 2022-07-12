import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { _post } from "../../../common/httpClient";
import PromptModal from "../../../components/Modals/PromptModal";
import { useRecoilValue } from "recoil";

import { dossierAtom } from "../atoms";

import { Warning } from "../../../theme/components/icons";

const ESignatureModal = ({ ...modal }) => {
  const dossier = useRecoilValue(dossierAtom);
  const onSignClicked = async () => {
    await _post(`/api/v1/sign_document`, {
      dossierId: dossier._id,
      cerfaId: dossier.cerfaId,
    });
    window.location.reload();
  };

  return (
    <>
      <PromptModal
        title="Signatures électroniques"
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
          <Text>Avez-vous bien vérifié les adresses emails renseignées ?</Text>
        </Flex>
        <Text mb={1} mt={5}>
          L&apos;ensemble des signataires recevra une invitation à signer de la part de YouSign. Invitez-les à vérifier
          leur boite de courrier indésirable s&apos;ils n&apos;ont rien reçu.
        </Text>
      </PromptModal>
    </>
  );
};
export default ESignatureModal;

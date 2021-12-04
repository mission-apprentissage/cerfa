import React, { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import useAuth from "../../../common/hooks/useAuth";
import { useCerfa } from "../../../common/hooks/useCerfa";
import { _post } from "../../../common/httpClient";

export default ({ dossierId }) => {
  let [auth] = useAuth();
  const [pdf, setPdf] = useState(null);
  const { isloaded, cerfaId } = useCerfa();

  useEffect(() => {
    const run = async () => {
      try {
        if (dossierId && cerfaId) {
          console.log(auth.workspaceId, dossierId, cerfaId);
          const pdfbase64 = await _post(`/api/v1/cerfa/pdf/${cerfaId}`, {
            workspaceId: auth.workspaceId,
            dossierId,
          });
          // console.log(pdfbase64);
          setPdf(pdfbase64);
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [auth, cerfaId, dossierId]);

  if (!isloaded || !pdf) {
    return null;
  }

  return (
    <Box mt={8}>
      <Heading as="h3" fontSize="1.4rem">
        Votre contrat généré:
      </Heading>
      <Heading as="h3" fontSize="1.4rem">
        Signatures:
      </Heading>
    </Box>
  );
};

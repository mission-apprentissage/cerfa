import React, { useState } from "react";
import { Box, Link, Flex, Text, Center, Spinner } from "@chakra-ui/react";
import { DownloadLine } from "../../theme/components/icons";
import Pagination from "../Pagination/Pagination";

import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfViewer = ({ url, pdfBase64, documentLoaded, showDownload = true }) => {
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    documentLoaded();
  };

  return (
    <Box>
      <Flex flexDirection="column" bg={isLoading ? "transparent" : "grey.600"} borderRadius={5} borderWidth={2}>
        {!isLoading && (
          <Flex bg={"#F7F7F7"} py={3}>
            <Box flexGrow={1}>
              <Flex justifyContent={"center"}>
                <Pagination totalPages={numPages} activePage={pageNumber} setPage={setPageNumber} />
              </Flex>
            </Box>
          </Flex>
        )}
        <Box>
          {isLoading && (
            <Center>
              <Spinner size="lg" />
            </Center>
          )}
          <Document
            file={`data:application/pdf;base64,${pdfBase64}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Contrat en cours de création..."
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </Box>
        {!isLoading && (
          <Box bg={"#F7F7F7"} py={8}>
            <Text>
              Page {pageNumber} sur {numPages}{" "}
            </Text>
            {showDownload && (
              <Center mt={1}>
                <Link href={url} isExternal color="bluefrance">
                  <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr="0.5rem" />
                  Télécharger le pdf
                </Link>
              </Center>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default PdfViewer;

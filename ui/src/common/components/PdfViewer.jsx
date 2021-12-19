import React, { useState } from "react";
import { Box, Link, Flex, Text, Center, Spinner } from "@chakra-ui/react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { DownloadLine } from "../../theme/components/icons";
import Pagination from "./Pagination";

const PdfViewer = ({ url, pdfBase64, documentLoaded }) => {
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    documentLoaded();
  };

  return (
    <Flex flexDirection="column" bg={isLoading ? "transparent" : "grey.600"} borderRadius={5} borderWidth={2}>
      {!isLoading && (
        <Flex bg={"grey.300"} py={3}>
          <Box flexGrow={1}>
            <Pagination totalPages={numPages} activePage={pageNumber} setPage={setPageNumber} />
          </Box>
          <Center mr={1}>
            <Link href={url} textDecoration={"underline"} isExternal>
              Télécharger le pdf <DownloadLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} />
            </Link>
          </Center>
        </Flex>
      )}
      <Box borderColor={"grey.600"} borderWidth={2}>
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
        <Box bg={"grey.300"} py={8}>
          <Text ml={3}>
            Page {pageNumber} of {numPages}{" "}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export { PdfViewer };

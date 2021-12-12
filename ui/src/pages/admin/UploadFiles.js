import React, { useCallback, useMemo, useState } from "react";
import Layout from "../layout/Layout";
import { Box, Button, Container, Heading, Input, ListItem, Select, Text, UnorderedList } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { _postFile } from "../../common/httpClient";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import { setTitle } from "../../common/utils/pageUtils";

const endpoint = `${process.env.REACT_APP_BASE_URL}/api`;

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderColor: "#9c9c9c",
  borderStyle: "dashed",
  color: "#9c9c9c",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#3a55d1",
};

const DOCUMENTS = [
  {
    filename: "testFile.pdf",
    label: "Test file",
  },
];

export default () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filename, setFilename] = useState(DOCUMENTS[0].filename);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const maxFiles = 1;

  const onDrop = useCallback(() => {
    setUploadError(null);
    setUploadSuccess(null);
  }, []);

  const onDropRejected = useCallback((rejections) => {
    setUploadError(`Ce fichier ne peut pas être déposé sur le serveur: ${rejections?.[0]?.errors?.[0]?.message}`);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    onDrop,
    onDropRejected,
    accept: ".pdf",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
    }),
    [isDragActive]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const renamedAcceptedFiles = acceptedFiles.map((file) => new File([file], filename, { type: file.type }));
      const data = new FormData();
      data.append("file", renamedAcceptedFiles[0]);
      await _postFile(`${endpoint}/v1/upload`, data);
      setUploadSuccess(`Merci, le fichier a bien été déposé`);
    } catch (e) {
      const messages = await e?.json;
      setUploadError(`Une erreur est survenue : ${messages?.error ?? e.message}`);
    } finally {
      // reset dropzone files
      acceptedFiles.splice(0, acceptedFiles.length);
      setIsSubmitting(false);
    }
  };

  const title = "Formulaire d'ajout de piéce(s) justificative";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="grey.800">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
        </Container>
      </Box>
      <Box w="100%" minH="100vh" px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Heading as="h1" mb={8} mt={6}>
            {title}
          </Heading>

          <form onSubmit={onSubmit}>
            <Select
              value={filename}
              w="30%"
              mb={8}
              onChange={(e) => {
                setFilename(e.target.value);
              }}
            >
              {DOCUMENTS.map(({ filename, label }) => (
                <option value={filename} key={filename}>
                  {label}
                </option>
              ))}
            </Select>
            <Box {...getRootProps({ style })} mb={8}>
              <Input {...getInputProps()} />
              {isDragActive ? (
                <Text>Glissez et déposez ici ...</Text>
              ) : (
                <>
                  <Text>Glissez et déposez un fichier ici, ou cliquez pour sélectionner un fichier</Text>
                  <Text as="em">
                    ({maxFiles} fichier (s) correspond au nombre maximum de fichiers que vous pouvez déposer ici)
                  </Text>
                </>
              )}
            </Box>
            {acceptedFiles.length > 0 && (
              <Box mb={8}>
                <Heading as="h4" fontSize="delta">
                  Fichier
                </Heading>
                <UnorderedList>
                  {acceptedFiles.map((file) => (
                    <ListItem key={file.path}>
                      {file.path} - {file.size} bytes
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
            )}
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Envoi en cours"
              isDisabled={acceptedFiles.length === 0}
            >
              Envoyer le fichier
            </Button>
            {uploadError && (
              <Text color="error" mt={5}>
                {uploadError}
              </Text>
            )}
            {uploadSuccess && (
              <Text color="success" mt={5}>
                {uploadSuccess}
              </Text>
            )}
          </form>
        </Container>
      </Box>
    </Layout>
  );
};

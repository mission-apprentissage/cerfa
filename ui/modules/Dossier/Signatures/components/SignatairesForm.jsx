import { useRecoilValue } from "recoil";
import { dossierAtom } from "../../atoms";
import { Divider, Flex, HStack, Link, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSignatures } from "../hooks/useSignatures";
import { Input } from "../../formEngine/components/Input/Input";
import Ribbons from "../../../../components/Ribbons/Ribbons";

export const SignatairesForm = () => {
  const dossier = useRecoilValue(dossierAtom);
  const { apprenti, employeur, cfa, legal } = dossier.signataires;

  const emails = {
    apprenti: apprenti?.email,
    employeur: employeur?.email,
    cfa: cfa?.email,
    legal: legal?.email,
  };

  return (
    <>
      <VStack w="full" alignItems="start" spacing="4w">
        <Text fontWeight="bold">
          Remplissez les champs des signataires pour leur envoyer une invitation à signer électroniquement le contrat.
        </Text>
        <Ribbons variant="info_clear" marginTop="1rem">
          <Text color="grey.800">
            Veuillez vous assurer de la conformité des adresses mails renseignées ci-après.
            <br />
            Elles doivent être obligatoirement détenues et accessibles par l&apos;interlocuteur associé. <br />
            Pour plus d&apos;informations, vous pouvez consulter les&nbsp;
            <Link href={"/cgu"} textDecoration={"underline"} color="bluefrance">
              conditions générales d&apos;utilisation.
            </Link>
          </Text>
        </Ribbons>
      </VStack>
      <Flex flexDirection="column" mt={8}>
        {employeur && (
          <Stack mb={5}>
            <Text fontWeight="bold">Signature de l&apos;Employeur :</Text>
            <SignataireLineForm signataire={employeur} type="employeur" emails={emails} />
          </Stack>
        )}
        <Divider />
        {apprenti && (
          <Stack mb={5} mt={6}>
            <Text fontWeight="bold">Signature de l&apos;Apprenti(e) :</Text>
            <SignataireLineForm signataire={apprenti} type="apprenti" emails={emails} isLocked={true} />
          </Stack>
        )}
        <Divider />
        {cfa && (
          <Stack mb={5} mt={6}>
            <Text fontWeight="bold">Visa du CFA :</Text>
            <SignataireLineForm signataire={cfa} type="cfa" emails={emails} />
          </Stack>
        )}
        <Divider />
        {legal && (
          <Stack mt={8}>
            <Text fontWeight="bold">Signature du représentant légal de l&apos;apprenti(e) :</Text>
            <SignataireLineForm signataire={legal} type="legal" emails={emails} isLocked={true} />
          </Stack>
        )}
      </Flex>
      <VStack w="full" alignItems="start" spacing="4w" mt={6}>
        <Text fontWeight="bold">
          Lorsque toutes les signatures seront réunies, le contrat est automatiquement télétransmis au service
          administratif.
        </Text>
        <Text>
          Pour toute question, consultez&nbsp;
          <Link href={"/assistance"} isExternal={true} textDecoration={"underline"} color="bluefrance">
            la page assistance
          </Link>
        </Text>
      </VStack>
    </>
  );
};

function validateUniqueEmail(emails, type, value) {
  if (!value) return;
  const filteredEmails = { ...emails };
  delete filteredEmails[type];
  if (Object.values(filteredEmails).includes(value)) {
    return { error: "Chaque courriel des signataires doit être unique" };
  }
}

const SignataireLineForm = ({ signataire, type, emails, isLocked }) => {
  const { onSubmittedSignataireDetails } = useSignatures();

  const [firstname, setFirstname] = useState(signataire.firstname);
  const [lastname, setLastname] = useState(signataire.lastname);
  const [email, setEmail] = useState(signataire.email);
  const [phone, setPhone] = useState(signataire.phone);

  const [error, setError] = useState(null);

  // permet d'avoir la validation directement avec le remplissage automatique des champs
  useEffect(() => {
    if (!isLocked) {
      const currentError = validateUniqueEmail(emails, type, email);
      setError(currentError?.error);
    }
  }, [email, emails, isLocked, type]);

  return (
    <HStack spacing={3} alignItems={"start"}>
      <Input
        required={true}
        locked={isLocked}
        name={`signataire.${type}.lastname`}
        label="Nom"
        value={lastname || ""}
        mb={0}
        w="20%"
        onError={(val, name) => {
          onSubmittedSignataireDetails("", name);
        }}
        onSubmit={onSubmittedSignataireDetails}
        onChange={setLastname}
      />
      <Input
        required={true}
        locked={isLocked}
        name={`signataire.${type}.firstname`}
        label="Prénom"
        value={firstname || ""}
        mt={0}
        w="20%"
        onError={(val, name) => {
          onSubmittedSignataireDetails("", name);
        }}
        onSubmit={onSubmittedSignataireDetails}
        onChange={setFirstname}
      />
      <Input
        required={true}
        locked={isLocked && type !== "legal"}
        name={`signataire.${type}.email`}
        label="Courriel"
        value={email}
        mask="C"
        maskBlocks={[
          {
            name: "C",
            mask: "Pattern",
            pattern: "^.*$",
          },
        ]}
        fieldType="email"
        mt={0}
        w="30%"
        error={error}
        onError={(val, name) => {
          onSubmittedSignataireDetails("", name);
        }}
        onSubmit={onSubmittedSignataireDetails}
        onChange={setEmail}
        validate={({ value }) => {
          return validateUniqueEmail(emails, type, value);
        }}
      />
      {(type === "apprenti" || type === "legal") && (
        <Input
          required={true}
          locked={false}
          name={`signataire.${type}.phone`}
          label="Téléphone"
          value={phone}
          fieldType={"phone"}
          mt={0}
          w="20%"
          onError={(val, name) => {
            onSubmittedSignataireDetails("", name);
          }}
          onSubmit={onSubmittedSignataireDetails}
          onChange={setPhone}
        />
      )}
    </HStack>
  );
};

import { useRecoilValue } from "recoil";
import { dossierAtom } from "../../atoms";
import { Divider, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
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
      <HStack w="full" alignItems="start" spacing="4w">
        <Text>tototototoottoo</Text>
        <Ribbons variant="info_clear" marginTop="1rem">
          <Text color="grey.800">
            Veuillez vous assurer de la conformité des <br />
            adresses mails renseignées ci-après. <br />
            Elles doivent être obligatoirement détenues <br />
            et accessibles par l&apos;interlocuteur associé. <br />
            Pour plus d&apos;informations, vous pouvez consulter <br />
            les&nbsp;
            <Link href={"/cgu"} textDecoration={"underline"} color="bluefrance">
              conditions générales d&apos;utilisation.
            </Link>
          </Text>
        </Ribbons>
      </HStack>
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
    </>
  );
};

const SignataireLineForm = ({ signataire, type, emails, isLocked }) => {
  const { onSubmittedSignataireDetails } = useSignatures();

  const [firstname, setFirstname] = useState(signataire.firstname);
  const [lastname, setLastname] = useState(signataire.lastname);
  const [email, setEmail] = useState(signataire.email);

  return (
    <HStack spacing={3}>
      <Input
        required={true}
        locked={isLocked}
        name={`signataire.${type}.lastname`}
        label="Nom"
        value={lastname || ""}
        mask="C"
        maskBlocks={[
          {
            name: "C",
            mask: "Pattern",
            pattern: "^[a-zA-Z]*$",
          },
        ]}
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
        mask="C"
        maskBlocks={[
          {
            name: "C",
            mask: "Pattern",
            pattern: "^[a-zA-Z]*$",
          },
        ]}
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
        w="40%"
        onError={(val, name) => {
          onSubmittedSignataireDetails("", name);
        }}
        onSubmit={onSubmittedSignataireDetails}
        onChange={setEmail}
        validate={({ value }) => {
          const filteredEmails = { ...emails };
          delete filteredEmails[type];
          if (Object.values(filteredEmails).includes(value)) {
            return { error: "Chaque courriel des signataires doit être unique" };
          }
        }}
      />
    </HStack>
  );
};

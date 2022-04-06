import React, { useState, useEffect } from "react";
import { Box, Button, Collapse, Text, List, ListItem, ListIcon, Link, Flex } from "@chakra-ui/react";
import Ribbons from "../../../../common/components/Ribbons";
import { ArrowRightLine, ErrorIcon } from "../../../../theme/components/icons";
import { useCerfaController } from "./CerfaControllerContext";
import { useRecoilValue } from "recoil";
import { cerfaAtom } from "../formEngine/atoms";

const CheckEmptyFields = React.memo(({ fieldNames }) => {
  const controller = useCerfaController();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [invalidFields, setInvalidFields] = useState([]);

  const fields = useRecoilValue(cerfaAtom);

  const updateFields = async () => {
    const invalidFields = await controller.getInvalidFields(fieldNames);
    setInvalidFields(invalidFields);
  };

  const checkFields = async () => {
    const invalidFields = await controller.getInvalidFields(fieldNames, true);
    setInvalidFields(invalidFields);
  };

  useEffect(() => {
    updateFields();
  }, [fields]);

  return (
    <Box mt={10}>
      <Button
        mr={4}
        size="md"
        variant="secondary"
        onClick={async () => {
          setIsLoading(true);
          await checkFields();
          setIsOpen(true);
          setIsLoading(false);
        }}
      >
        Est-ce que tous mes champs sont remplis ?
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Ribbons
          variant={isLoading ? "unstyled" : invalidFields.length === 0 ? "success" : "error"}
          mt={5}
          oneLiner={!(invalidFields.length > 0 && !isLoading)}
        >
          {isLoading && <Text> Vérifications en cours...</Text>}
          {invalidFields.length === 0 && !isLoading && <Text>Tous les champs sont remplis</Text>}
          {invalidFields.length > 0 && !isLoading && (
            <>
              <Flex w="full" ml={10}>
                <Text>
                  <ErrorIcon boxSize="4" color="flaterror" mt="-0.125rem" mr={2} />
                  {invalidFields.length} champ(s) non remplis :
                </Text>
              </Flex>
              <List spacing={3} mt={3} ml={5}>
                {invalidFields.map(({ name, label }) => {
                  return (
                    <ListItem key={name}>
                      <ListIcon as={ArrowRightLine} color="flaterror" />

                      <Link
                        onClick={() => {
                          const element = document.getElementById(`${name.replaceAll(".", "_")}-label`);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        textDecoration="underline"
                      >
                        {label.replace(":", "")}
                      </Link>
                    </ListItem>
                  );
                })}
              </List>
            </>
          )}
        </Ribbons>
      </Collapse>
    </Box>
  );
});

export default CheckEmptyFields;

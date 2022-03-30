import React, { useState, useEffect } from "react";
import { Box, Button, Collapse, Text, List, ListItem, ListIcon, Link, Flex } from "@chakra-ui/react";
import Ribbons from "../../../Ribbons/Ribbons";
import { ArrowRightLine, ErrorIcon } from "../../../../theme/components/icons";

// eslint-disable-next-line react/display-name
const CheckEmptyFields = React.memo(({ validation, fieldsErrored, resetCheckFields }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [hasBeenReset, setHasBeenReset] = resetCheckFields;

  useEffect(() => {
    if (fieldsErrored.length === 0 && hasBeenReset) {
      setHasBeenReset(false);
      // TODO IF I HAVE TO DO THIS SOMETHING IS TERRIBLY WRONG (ALL INPUT AT THE SAME TIME)
      setTimeout(() => {
        validation("trigger");
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }, 400);
    }
  }, [fieldsErrored, hasBeenReset, isLoading, isOpen, setHasBeenReset, validation]);

  return (
    <Box mt={10}>
      <Button
        mr={4}
        size="md"
        variant="secondary"
        onClick={() => {
          setIsLoading(true);
          setIsOpen(true);
          validation("reset");
        }}
      >
        Est-ce que tous mes champs sont remplis ?
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Ribbons
          variant={isLoading ? "unstyled" : fieldsErrored.length === 0 ? "success" : "error"}
          mt={5}
          oneLiner={!(fieldsErrored.length > 0 && !isLoading)}
        >
          {isLoading && <Text> Vérifications en cours...</Text>}
          {fieldsErrored.length === 0 && !isLoading && <Text>Tous les champs sont remplis</Text>}
          {fieldsErrored.length > 0 && !isLoading && (
            <>
              <Flex w="full" ml={10}>
                <Text>
                  <ErrorIcon boxSize="4" color="flaterror" mt="-0.125rem" mr={2} />
                  {fieldsErrored.length} champ(s) non remplis :
                </Text>
              </Flex>
              <List spacing={3} mt={3} ml={5}>
                {fieldsErrored.map(({ path, label }) => {
                  const name = path.replaceAll(".", "_");
                  return (
                    <ListItem key={name}>
                      <ListIcon as={ArrowRightLine} color="flaterror" />

                      <Link
                        onClick={() => {
                          const element = document.getElementById(`${name}_section-label`);
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

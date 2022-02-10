import React, { useState } from "react";
import { Box, Button, Collapse, Text, List, ListItem, ListIcon, Link, Flex } from "@chakra-ui/react";
import Ribbons from "../../../../common/components/Ribbons";
import { ArrowRightLine, ErrorIcon } from "../../../../theme/components/icons";
// import { NavLink } from "react-router-dom";

const CheckEmptyFields = ({ validate, fieldsErrored }) => {
  const [triggered, setTriggered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box mt={10}>
      <Button
        mr={4}
        size="md"
        variant="secondary"
        onClick={() => {
          setTriggered(true);
          setIsLoading(true);

          setTimeout(() => {
            validate();
            setIsLoading(false);
          }, 220);
        }}
      >
        Est-ce que tous mes champs sont remplis ?
      </Button>
      <Collapse in={triggered} animateOpacity>
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
                {fieldsErrored.map(({ type, name, label }) => {
                  let anchor = `${name}_section-label`;
                  if (
                    type === "text" ||
                    type === "select" ||
                    type === "radio" ||
                    type === "phone" ||
                    type === "email" ||
                    type === "date"
                  ) {
                    anchor = `${name}_section-label`;
                  }
                  return (
                    <ListItem key={name}>
                      <ListIcon as={ArrowRightLine} color="flaterror" />
                      {/*
              TODO SHOULD BE LIKE THIS OR add archor dynanicly with react router
               <Link as={NavLink} to={"#apprenti_departementNaissance_section-label"}>
            Département de naissance
          </Link> */}
                      <Link
                        onClick={() => {
                          const element = document.getElementById(anchor);
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
};

export default CheckEmptyFields;

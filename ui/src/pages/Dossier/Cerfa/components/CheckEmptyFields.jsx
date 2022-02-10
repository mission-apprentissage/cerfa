import React, { useState } from "react";
import { Box, Button, Collapse, Text, List, ListItem, ListIcon, Link } from "@chakra-ui/react";
import Ribbons from "../../../../common/components/Ribbons";
import { ArrowRightLine } from "../../../../theme/components/icons";
// import { NavLink } from "react-router-dom";

const CheckEmptyFields = ({ validate, fieldsErrored }) => {
  const [triggered, setTriggered] = useState(false);
  console.log(fieldsErrored);
  return (
    <Box mt={10}>
      <Button
        mr={4}
        size="md"
        variant="secondary"
        onClick={() => {
          setTriggered(true);
          validate();
        }}
      >
        Est-ce que tous mes champs sont remplis ?
      </Button>
      <Ribbons variant="success" mt={5}>
        <Text>Tous les champs sont remplis</Text>
      </Ribbons>
      <Ribbons variant="error" mt={5}>
        <Text>Tous les champs sont remplis</Text>
      </Ribbons>
      <Ribbons variant="warning" mt={5}>
        <Text>Tous les champs sont remplis</Text>
      </Ribbons>
      <Ribbons variant="info" mt={5}>
        <Text>Tous les champs sont remplis</Text>
      </Ribbons>
      <Collapse in={triggered} animateOpacity>
        {fieldsErrored.length > 0 && (
          <Ribbons variant="error" mt={5}>
            <Box>
              <Text>{fieldsErrored.length} champ(s) non remplis :</Text>
            </Box>
            <List spacing={3} mt={3}>
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
                    >
                      {label.replace(":", "")}
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Ribbons>
        )}
      </Collapse>
    </Box>
  );
};

export default CheckEmptyFields;

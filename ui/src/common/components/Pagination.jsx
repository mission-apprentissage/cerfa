import React from "react";
import { Button, Flex, Icon } from "@chakra-ui/react";

import { IoArrowForward, IoArrowBackward } from "../../theme/components/icons";

const Pagination = React.memo(({ totalPages, activePage, setPage }) => {
  const PagButton = (props) => {
    const activeStyle = {
      bg: "bluefrance",
      color: "white",
    };
    return (
      <Button
        mx={1}
        px={2}
        py={1}
        variant="primary"
        bg="white"
        color="gray.700"
        opacity={props.disabled && 0.6}
        _hover={
          !props.disabled && {
            color: "grey.800",
            bg: "grey.200",
          }
        }
        cursor={props.disabled && "not-allowed"}
        {...(props.active && activeStyle)}
        onClick={props.onClicked}
      >
        {props.children}
      </Button>
    );
  };
  if (!totalPages) return null;

  return (
    <Flex>
      <PagButton
        onClicked={() => {
          if (activePage > 1) {
            setPage(activePage - 1);
          }
        }}
      >
        <Icon as={IoArrowBackward} color="gray.700" boxSize={4} />
      </PagButton>
      {Array(totalPages)
        .fill(1)
        .map((v, i) => {
          return (
            <PagButton
              key={i}
              active={activePage === i + 1}
              onClicked={() => {
                setPage(i + 1);
              }}
            >
              {i + 1}
            </PagButton>
          );
        })}
      <PagButton
        onClicked={() => {
          if (activePage < totalPages) {
            setPage(activePage + 1);
          }
        }}
      >
        <Icon as={IoArrowForward} color="gray.700" boxSize={4} />
      </PagButton>
    </Flex>
  );
});

export default Pagination;

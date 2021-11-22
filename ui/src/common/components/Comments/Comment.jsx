import React from "react";
import {
  Icon,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  IconButton,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  ButtonGroup,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  Box,
  Checkbox,
  CheckboxGroup,
  Text,
  Badge,
} from "@chakra-ui/react";
import FocusLock from "react-focus-lock";

import CardComment from "./Card";

const testData = [
  {
    contenu: "text du commentaire",
    dateAjout: Date.now(),
    qui: "Antoine Bigard",
    role: "CFA",
    assigne: "Paul Pierre",
  },
];

const CommentIcon = (props) => (
  <Icon viewBox="0 0 24 24" w="24px" h="24px" {...props}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM11 10h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2z"
      fill="currentColor"
    />
  </Icon>
);

// 1. Create a text input component
const CommentInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Textarea ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

// 2. Create the form
const Form = ({ firstFieldRef, onCancel }) => {
  return (
    <Stack spacing={4}>
      {testData.map((data, i) => {
        return (
          <Box key={i}>
            <CardComment data={data} />
          </Box>
        );
      })}
      <Stack spacing={4} mt={5}>
        <CommentInput label="ajouter un nouveau commentaire" id="first-name" ref={firstFieldRef} defaultValue="" />

        <CheckboxGroup colorScheme="green" defaultValue={["naruto", "kakashi"]}>
          <Text>Notifier:</Text>
          <Stack>
            <Checkbox value="Paul Pierre">
              Paul Pierre{" "}
              <Badge
                variant="solid"
                bg="greenmedium.300"
                borderRadius="16px"
                color="grey.800"
                textStyle="sm"
                px="15px"
                ml="10px"
              >
                Employeur
              </Badge>
            </Checkbox>
            <Checkbox value="Antoine Bigard">
              Antoine Bigard{" "}
              <Badge
                variant="solid"
                bg="greenmedium.300"
                borderRadius="16px"
                color="grey.800"
                textStyle="sm"
                px="15px"
                ml="10px"
              >
                CFA
              </Badge>
            </Checkbox>
            <Checkbox value="Pablo Hanry">
              Pablo Hanry
              <Badge
                variant="solid"
                bg="greenmedium.300"
                borderRadius="16px"
                color="grey.800"
                textStyle="sm"
                px="15px"
                ml="10px"
              >
                Apprenti
              </Badge>
            </Checkbox>
          </Stack>
        </CheckboxGroup>

        <ButtonGroup d="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button isDisabled colorScheme="teal" variant="primary">
            Save
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

// 3. Create the Popover
// Ensure you set `closeOnBlur` prop to false so it doesn't close on outside click
export default () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton icon={<CommentIcon color={"grey.700"} mt="4px" />} />
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Form firstFieldRef={firstFieldRef} onCancel={onClose} />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

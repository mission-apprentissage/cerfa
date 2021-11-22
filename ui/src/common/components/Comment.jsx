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
  Input,
  Stack,
  ButtonGroup,
  Button,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import FocusLock from "react-focus-lock";

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
const TextInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

// 2. Create the form
const Form = ({ firstFieldRef, onCancel }) => {
  return (
    <Stack spacing={4}>
      <TextInput label="Commentaire" id="first-name" ref={firstFieldRef} defaultValue="John" />
      <ButtonGroup d="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button isDisabled colorScheme="teal">
          Save
        </Button>
      </ButtonGroup>
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
        <IconButton size="sm" icon={<CommentIcon />} />
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

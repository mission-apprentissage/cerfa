import React, { useState, useCallback } from "react";
import {
  Icon,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  IconButton,
  FormControl,
  FormLabel,
  Stack,
  ButtonGroup,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  Box,
  Checkbox,
  CheckboxGroup,
  Text,
  Avatar,
  AvatarBadge,
  // Input,
  Textarea,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import FocusLock from "react-focus-lock";
import { useFormik } from "formik";
// import { useDossier } from "../../hooks/useDossier";
import { useComment } from "../../../common/hooks/useComment";

import CardComment from "./Card";

const CommentIcon = (props) => (
  <Icon viewBox="0 0 25 25" w="24px" h="24px" {...props}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M4.60449 4.30957H20.6045V16.3096H5.77449L4.60449 17.4796V4.30957ZM4.60449 2.30957C3.50449 2.30957 2.61449 3.20957 2.61449 4.30957L2.60449 22.3096L6.60449 18.3096H20.6045C21.7045 18.3096 22.6045 17.4096 22.6045 16.3096V4.30957C22.6045 3.20957 21.7045 2.30957 20.6045 2.30957H4.60449ZM6.60449 12.3096H14.6045V14.3096H6.60449V12.3096ZM6.60449 9.30957H18.6045V11.3096H6.60449V9.30957ZM6.60449 6.30957H18.6045V8.30957H6.60449V6.30957Z"
      fill="currentColor"
    />
  </Icon>
);

// eslint-disable-next-line react/display-name
const CommentInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id} d="none">
        {props.label}
      </FormLabel>
      <Textarea ref={ref} id={props.id} placeholder="Ajouter un commentaire" {...props} />
    </FormControl>
  );
});

const Form = ({ firstFieldRef, onSubmitted, onCancel, feed }) => {
  const [show, setShow] = useState(feed.length === 0);
  const [canSubmit, setCanSubmit] = useState(false);
  // const { users } = useDossier();
  const toogle = () => setShow(!show);

  const { values, handleChange, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: {
      comment: "",
      notify: [],
    },
    onSubmit: ({ comment, notify }) => {
      // eslint-disable-next-line no-undef
      return new Promise(async (resolve) => {
        await onSubmitted({
          comment,
          notify,
        });
        resetForm();
        setCanSubmit(false);
        resolve("onSubmitHandler publish complete");
      });
    },
  });

  const handleNotifyChange = (notify) => {
    let newNotify = [];
    if (values.notify.includes(notify)) {
      newNotify = values.notify.filter((r) => r !== notify);
    } else {
      newNotify = [...values.notify, notify];
    }
    setFieldValue("notify", newNotify);
  };

  return (
    <Stack spacing={4} mt={5}>
      <Stack spacing={4} transition="opacity 0.2s">
        <CommentInput
          label="ajouter un commentaire"
          id="comment"
          onClick={toogle}
          name="comment"
          value={values.comment}
          ref={firstFieldRef}
          onChange={(evt) => {
            setCanSubmit(true);
            handleChange(evt);
          }}
        />
        <Stack display={!show ? "none" : "flex"}>
          <CheckboxGroup colorScheme="green" defaultValue={[]}>
            <Text>Notifier:</Text>
            <Stack>
              {[
                {
                  name: "Paul Pierre",
                  role: "Employeur",
                },
                {
                  name: "Antoine Bigard",
                  role: "CFA",
                },
                {
                  name: "Pablo Hanry",
                  role: "Apprenti",
                },
              ].map((user, i) => {
                return (
                  <Checkbox
                    value={user.name}
                    key={i}
                    name="notify"
                    onChange={() => handleNotifyChange(user.name)}
                    isChecked={values.notify.includes(user.name)}
                  >
                    {user.name}
                    <Text as="span" ml={1} fontWeight={700}>
                      ({user.role})
                    </Text>
                  </Checkbox>
                );
              })}
            </Stack>
          </CheckboxGroup>
          <ButtonGroup d="flex" justifyContent="flex-end" pt={5}>
            <Button variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button colorScheme="teal" variant="primary" onClick={handleSubmit} isDisabled={!canSubmit}>
              Commenter
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Discution = ({ feed }) => {
  return (
    <Stack spacing={4}>
      {feed.map((data, i) => {
        return (
          <Box key={i}>
            <CardComment data={data} />
          </Box>
        );
      })}
    </Stack>
  );
};

// Ensure you set `closeOnBlur` prop to false so it doesn't close on outside click
const Comment = ({ context }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);
  const { isloaded, comments, onAddComment, onResolveFeed } = useComment();

  const onAddClicked = useCallback(
    async (comment) => {
      await onAddComment(context, comment);
      // Dirty refresh
      onClose();
      onOpen();
    },
    [context, onAddComment, onClose, onOpen]
  );

  const onResolveClicked = async () => {
    onClose();
    await onResolveFeed(context);
  };

  if (!isloaded) return null;

  const [{ feed }] = comments[context].discussions;

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
        <Avatar
          icon={<CommentIcon color="grey.700" mt="2px" w={7} h={7} />}
          bg="gray.100"
          h="10"
          w="auto"
          borderRadius="md"
          as={IconButton}
        >
          {feed.length > 0 && (
            <AvatarBadge
              boxSize="1.7em"
              bg="redmarianne"
              fontSize="md"
              fontWeight="semibold"
              color="white"
              top="-4"
              right="-1"
              borderWidth="0"
            >
              {feed.length}
            </AvatarBadge>
          )}
        </Avatar>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton fontSize="12px" padding={3} h={8} />
          {feed.length > 0 && (
            <IconButton
              icon={
                <Box color="bluefrance" fontWeight={400} fontSize="13px">
                  <CheckIcon w="10px" h="10px" mt="-0.5rem" /> Marquer comme résolu
                </Box>
              }
              size="sm"
              position="absolute"
              top={1}
              right={10}
              padding={3}
              fontSize="12px"
              bg="none"
              onClick={onResolveClicked}
            />
          )}
          <Box h="1px" mt="8" />
          {feed.length > 0 && <Discution feed={feed} />}
          <Form firstFieldRef={firstFieldRef} onCancel={onClose} feed={feed} onSubmitted={onAddClicked} />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

export default Comment;

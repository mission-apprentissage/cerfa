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
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import FocusLock from "react-focus-lock";
import { useFormik } from "formik";
import { useDossier } from "../../hooks/useDossier";
import { useComment } from "../../../common/hooks/useComment";

import CardComment from "./Card";

const CommentIcon = (props) => (
  <Icon viewBox="0 0 24 24" w="24px" h="24px" {...props}>
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455zm-.692-2H20V5H4v13.385L5.763 17zM11 10h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2z"
      fill="currentColor"
    />
  </Icon>
);

const CommentInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id} d="none">
        {props.label}
      </FormLabel>
      <Textarea ref={ref} id={props.id} placeholder="Répondre ou notifier" {...props} />
    </FormControl>
  );
});

const Form = ({ firstFieldRef, onSubmitted, onCancel, feed }) => {
  const [show, setShow] = useState(feed.length === 0);
  const [canSubmit, setCanSubmit] = useState(false);
  const { users } = useDossier();
  const toogle = () => setShow(!show);

  const { values, handleChange, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: {
      comment: "",
      notify: [],
    },
    onSubmit: ({ comment, notify }) => {
      return new Promise(async (resolve) => {
        await onSubmitted({
          comment,
          notify,
        });
        resetForm();
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
      <Text onClick={toogle} cursor="pointer">
        {!show ? "+" : "-"} Ajouter un nouveau commentaire
      </Text>
      <Stack spacing={4} mt={5} display={!show ? "none" : "flex"} opacity={!show ? "0" : "1"} transition="opacity 0.2s">
        <CommentInput
          label="ajouter un nouveau commentaire"
          id="comment"
          name="comment"
          value={values.comment}
          ref={firstFieldRef}
          onChange={(evt) => {
            setCanSubmit(true);
            handleChange(evt);
          }}
        />

        <CheckboxGroup colorScheme="green" defaultValue={[]}>
          <Text>Notifier:</Text>
          <Stack>
            {users.map((user, i) => {
              return (
                <Checkbox
                  value={user.name}
                  key={i}
                  name="notify"
                  onChange={() => handleNotifyChange(user.name)}
                  isChecked={values.notify.includes(user.name)}
                >
                  {user.name}
                  <Badge
                    variant="solid"
                    bg="greenmedium.300"
                    borderRadius="16px"
                    color="grey.800"
                    textStyle="sm"
                    px="15px"
                    ml="10px"
                  >
                    {user.role}
                  </Badge>
                </Checkbox>
              );
            })}
          </Stack>
        </CheckboxGroup>

        <ButtonGroup d="flex" justifyContent="flex-end">
          <Button colorScheme="teal" variant="primary" onClick={handleSubmit} isDisabled={!canSubmit}>
            {feed.length === 0 ? "Commenter" : "Répondre"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </ButtonGroup>
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
export default ({ context }) => {
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
                <Box>
                  <CheckIcon color="bluefrance" /> Résourdre
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

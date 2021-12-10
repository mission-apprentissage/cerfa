import React from "react";
import {
  Box,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  useDisclosure,
  IconButton,
  Link,
  Text,
  Center,
} from "@chakra-ui/react";
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import { MenuFill, IoArrowBackward, Parametre, Folder, ArrowDownLine } from "../../../theme/components/icons";

const NavItem = ({ icon, children, to, shoudBeActive, isSubItem, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  const AsLink = (props) => (
    <Link
      as={NavLink}
      to={to}
      color={props.color}
      px={props.px}
      py={props.py}
      pl={props.pl}
      w={props.w}
      display="inline-block"
    >
      {props.children}
    </Link>
  );

  const Component = to ? AsLink : Center;
  return (
    <Flex
      align="center"
      cursor="pointer"
      color="inherit"
      _hover={{
        bg: "gray.100",
        color: "gray.900",
        borderLeft: "2px solid",
        borderColor: isSubItem ? "transparent" : "bluefrance",
      }}
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      borderLeft={"2px solid"}
      borderColor={(isActive || shoudBeActive) && !isSubItem ? "bluefrance" : "transparent"}
      {...rest}
    >
      <Component px="4" pl="4" py="3" w="full" color={isActive || shoudBeActive ? "bluefrance" : "grey.800"}>
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: "gray.600",
            }}
            as={icon}
          />
        )}
        {children}
      </Component>
    </Flex>
  );
};

export default ({ children, topBarContent }) => {
  let { path } = useRouteMatch();
  const isParametresPages = path.includes("/mon-espace/parametres");
  const sidebarMobile = useDisclosure();
  const sidebar = useDisclosure({ defaultIsOpen: true });
  const parametres = useDisclosure({ defaultIsOpen: isParametresPages });

  const SidebarContent = (props) => (
    <Flex direction="column" as="nav" fontSize="sm" color="gray.600" aria-label="Sub Navigation" {...props}>
      <NavItem icon={() => <Folder w={"1rem"} h={"1rem"} mb={"0.125rem"} mr={2} />} to="/mon-espace/mes-dossiers">
        Mes Dossiers
      </NavItem>
      <NavItem
        icon={() => <Parametre w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr={2} />}
        onClick={parametres.onToggle}
        shoudBeActive={isParametresPages}
      >
        <Center w="full" mb={"0.125rem"}>
          <Text flexGrow={1}>Paramètres</Text>
          <Icon
            as={() => (
              <ArrowDownLine
                w={"0.75rem"}
                h={"0.75rem"}
                mt={"0.125rem"}
                transform={parametres.isOpen && "rotate(180deg)"}
              />
            )}
          />
        </Center>
      </NavItem>
      <Collapse in={parametres.isOpen}>
        <NavItem pl="8" to="/mon-espace/parametres/utilisateurs" isSubItem={true}>
          Utilisateurs
        </NavItem>
        <NavItem pl="8" to="/mon-espace/parametres/notifications" isSubItem={true}>
          Notifications
        </NavItem>
      </Collapse>
    </Flex>
  );

  return (
    <Flex as="section" minH="50vh" overflowX="hidden">
      <Flex
        as="nav"
        top="0"
        display={{ base: "none", md: "flex" }}
        zIndex="sticky"
        h="full"
        minH="50vh"
        overflowX="hidden"
        overflowY="auto"
        bg="white"
        w="68"
        transition=".3s ease"
        ml={{ base: 0, md: sidebar.isOpen ? 0 : -60 }}
      >
        <SidebarContent w="60" />
        <Box w="8" borderColor="inherit" borderLeftWidth="1px">
          <IconButton
            aria-label="Menu"
            variant="unstyled"
            display={{ base: "none", md: "inline-flex" }}
            onClick={sidebar.onToggle}
            minW={2}
            icon={
              <IoArrowBackward
                width={"1.4rem"}
                height={"1.4rem"}
                mb={"0.125rem"}
                transform={!sidebar.isOpen && "rotate(180deg)"}
              />
            }
            size="sm"
            mt={-2}
          />
        </Box>
      </Flex>

      <Drawer isOpen={sidebarMobile.isOpen} onClose={sidebarMobile.onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 0 }} transition=".3s ease" flexGrow={1}>
        <Flex as="header" align="center" justify="space-between" w="full" h="16" pt={5}>
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebarMobile.onOpen}
            icon={<MenuFill />}
            size="sm"
            mr={2}
          />

          {children().Header}
        </Flex>

        <Box as="main">{children().Content}</Box>
      </Box>
    </Flex>
  );
};

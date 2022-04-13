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
  Text,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import Link from "../Link";

import { useQuery } from "react-query";
import { _get } from "../../common/httpClient";

import { useRecoilValue } from "recoil";
import { workspacePathsAtom, workspaceTitlesAtom } from "../../hooks/workspaceAtoms";
import {
  MenuFill,
  IoArrowBackward,
  // Parametre,
  // Folder,
  ArrowDownLine,
} from "../../theme/components/icons";

const AsLink = ({ children, ...rest }) => (
  <Link display="inline-block" {...rest}>
    {children}
  </Link>
);

const NavItem = ({ icon, children, to, shoudBeActive, isSubItem, ...rest }) => {
  const router = useRouter();
  const isActive = router.asPath === to;

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
      <Component px="4" pl="4" py="3" w="full" color={isActive || shoudBeActive ? "bluefrance" : "grey.800"} href={to}>
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

function useSharedWithMe() {
  const {
    data: sharedWithMeWorkspaces,
    isLoading: isLoadingSharedWks,
    isFetching: isFetchingSharedwks,
  } = useQuery("sharedWorkspaceDossiers", () => _get(`/api/v1/workspace/sharedwithme`), {
    refetchOnWindowFocus: false,
  });

  return {
    sharedWithMeWorkspaces,
    isLoading: isLoadingSharedWks,
    isFetching: isFetchingSharedwks,
  };
}
const WorkspaceLayout = ({ header, content }) => {
  const paths = useRecoilValue(workspacePathsAtom);
  const titles = useRecoilValue(workspaceTitlesAtom);
  const router = useRouter();
  const isSharedWorkspacesPages = router.pathname.includes(`/mes-dossiers/espaces-partages`);
  const sidebarMobile = useDisclosure();
  const sidebar = useDisclosure({ defaultIsOpen: true });
  const sharedWorkspaces = useDisclosure({ defaultIsOpen: isSharedWorkspacesPages });

  // TODO to decide with business - Auto closing
  // useEffect(() => {
  //   const toogler = setTimeout(() => {
  //     sidebar.onToggle();
  //   }, 8000);
  //   return () => {
  //     clearTimeout(toogler);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const SidebarContent = React.memo(function Sc(props) {
    const { sharedWithMeWorkspaces } = useSharedWithMe();

    return (
      <Flex direction="column" as="nav" fontSize="sm" color="gray.600" aria-label="Sub Navigation" {...props}>
        {/* <Flex alignItems="flex-start" px="4" pl="2" py="3" w="full" fontSize="md">
        {titles.workspace}
      </Flex> */}
        <NavItem
          // icon={() => <Folder w={"1rem"} h={"1rem"} mb={"0.125rem"} mr={2} />}
          to={paths.mesDossiers}
        >
          {titles.myWorkspace}
        </NavItem>
        <NavItem
          // icon={() => <Parametre w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} mr={2} />}
          onClick={sharedWorkspaces.onToggle}
          shoudBeActive={isSharedWorkspacesPages}
        >
          <Center w="full" mb={"0.125rem"}>
            <Text flexGrow={1}>{titles.sharedWorkspaces}</Text>
            <Icon
              as={() => (
                <ArrowDownLine
                  w={"0.75rem"}
                  h={"0.75rem"}
                  mt={"0.125rem"}
                  transform={sharedWorkspaces.isOpen && "rotate(180deg)"}
                />
              )}
            />
          </Center>
        </NavItem>
        <Collapse in={sharedWorkspaces.isOpen}>
          {sharedWithMeWorkspaces?.map((sharedWithMeWorkspace) => {
            return (
              <NavItem
                key={sharedWithMeWorkspace._id}
                pl="8"
                to={`/mes-dossiers/espaces-partages/${sharedWithMeWorkspace._id}/dossiers`}
                isSubItem={true}
              >
                {sharedWithMeWorkspace.nom}
              </NavItem>
            );
          })}
        </Collapse>
        <NavItem
          // icon={() => <Folder w={"1rem"} h={"1rem"} mb={"0.125rem"} mr={2} />}
          to={"/mes-dossiers/dossiers-partages"}
        >
          {titles.sharedDossiers}
        </NavItem>
      </Flex>
    );
  });

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
        transition=".5s ease"
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

          {header}
        </Flex>

        <Box as="main">{content}</Box>
      </Box>
    </Flex>
  );
};

export default WorkspaceLayout;

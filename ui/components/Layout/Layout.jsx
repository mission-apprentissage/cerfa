import React from "react";
import { useRouter } from "next/router";
import { Box, Container } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";
import { HelpBox } from "../HelpBox/HelpBox";

const Layout = ({ children, ...rest }) => {
  const router = useRouter();
  const isMyWorkspace = router.pathname.includes("/mes-dossiers");
  return (
    <Container maxW="full" minH="100vh" d="flex" flexDirection="column" p={0} {...rest}>
      <Header />
      <NavigationMenu isMyWorkspace={isMyWorkspace} />
      <Box minH={"60vh"} flexGrow="1">
        <Box w="100%" py={[4, 8]} px={[1, 1, 12, 24]}>
          <Container maxW="xl">{children}</Container>
        </Box>
      </Box>
      <Footer />
      <HelpBox />
    </Container>
  );
};

export default Layout;

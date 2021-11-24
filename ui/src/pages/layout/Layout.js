import React from "react";
import { Box, Container } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";

import { useUnloadEffect } from "../../common/hooks/useBeforeUnload";

const Layout = ({ children, match, onLeave, ...rest }) => {
  useUnloadEffect(match, onLeave);
  return (
    <Container maxW="full" minH="100vh" d="flex" flexDirection="column" p={0} {...rest}>
      <Header />
      <NavigationMenu />
      <Box minH={"60vh"} flexGrow="1">
        {children}
      </Box>
      <Footer />
    </Container>
  );
};

export default Layout;

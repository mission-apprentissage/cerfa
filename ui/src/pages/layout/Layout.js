import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";

import { useUnloadEffect } from "../../common/hooks/useBeforeUnload";

const Layout = ({ children, onLeave, ...rest }) => {
  let { path } = useRouteMatch();
  useUnloadEffect(onLeave);
  const isDashboard = path.includes("/mon-espace");
  return (
    <Container maxW="full" minH="100vh" d="flex" flexDirection="column" p={0} {...rest}>
      <Header />
      <NavigationMenu isDashboard={isDashboard} />
      <Box minH={"60vh"} flexGrow="1">
        {children}
      </Box>
      <Footer />
    </Container>
  );
};

export default Layout;

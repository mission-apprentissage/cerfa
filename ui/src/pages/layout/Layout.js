import React from "react";
import { Box, Container, Collapse } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";
import SubNavigationMenu from "./components/SubNavigationMenu";

import { useUnloadEffect } from "../../common/hooks/useBeforeUnload";

const Layout = ({ children, match, onLeave, ...rest }) => {
  useUnloadEffect(match, onLeave);
  const isDashboard = match.path.includes("/mon-espace");
  const isMesDossiers = match.path.includes("/mon-espace/mes-dossiers");
  return (
    <Container maxW="full" minH="100vh" d="flex" flexDirection="column" p={0} {...rest}>
      <Header />
      <NavigationMenu isDashboard={isDashboard} />
      <Collapse in={isDashboard} animateOpacity>
        <SubNavigationMenu isMesDossiers={isMesDossiers} />
      </Collapse>
      <Box minH={"60vh"} flexGrow="1">
        {children}
      </Box>
      <Footer />
    </Container>
  );
};

export default Layout;

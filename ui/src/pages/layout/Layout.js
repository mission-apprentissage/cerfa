import React from "react";
import { Box, Container } from "@chakra-ui/react";

import Footer from "./components/Footer";
import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";

const Layout = ({ children, ...rest }) => {
  return (
    <Container maxW="full" p={0} {...rest}>
      <Header />
      <NavigationMenu />
      <Box minH={"60vh"}>{children}</Box>
      <Footer />
    </Container>
  );
};

export default Layout;

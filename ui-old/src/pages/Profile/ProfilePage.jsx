import React, { lazy } from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { Switch, useRouteMatch, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import ProfileInformation from "./components/ProfileInformation";
// import ProfileNotification from "./components/ProfileNotification";
import { setTitle } from "../../common/utils/pageUtils";
import { Breadcrumb } from "../../common/components/Breadcrumb";

import PrivateRoute from "../../common/components/PrivateRoute";

const NotFoundPage = lazy(() => import("../NotFoundPage"));

export default () => {
  let { path } = useRouteMatch();
  const MyProfile = () => {
    setTitle("Mes Informations");
    return (
      <Flex>
        <Box w="30%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
          <Box borderLeft="2px solid" _hover={{ cursor: "pointer" }} borderColor={"bluefrance"} color={"bluefrance"}>
            <Heading as="h2" fontSize="md" ml={3}>
              Mes informations
            </Heading>
          </Box>
        </Box>
        <Box w="100%" pt={[4, 8]} mb={5}>
          <ProfileInformation />
        </Box>
      </Flex>
    );
  };

  // const MyNotification = () => {
  //   setTitle("Mes Notifications");
  //   return (
  //     <Flex>
  //       <Box w="30%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
  //         <Box borderLeft="2px solid" _hover={{ cursor: "pointer" }} borderColor={"bluefrance"} color={"bluefrance"}>
  //           <Heading as="h2" fontSize="md" ml={3}>
  //             Mes notifications
  //           </Heading>
  //         </Box>
  //       </Box>
  //       <Box w="100%" pt={[4, 8]}>
  //         <ProfileNotification />
  //       </Box>
  //     </Flex>
  //   );
  // };

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]} color="#1E1E1E">
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Mon Compte", to: "/" }, { title: "Mes Informations" }]} />
        </Container>
      </Box>
      <Switch>
        <PrivateRoute exact path={`${path}`} component={MyProfile} />
        {/* <PrivateRoute exact path="/notifications" component={MyNotification} /> */}

        {/* Fallback */}
        <Route component={NotFoundPage} />
      </Switch>
    </Layout>
  );
};

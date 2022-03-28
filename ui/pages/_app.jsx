import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Fonts from "../theme/Fonts";
import theme from "../theme/index";
import UserWrapper from "../components/UserWrapper/UserWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme} resetCSS>
        <Fonts />
        <UserWrapper>
          <Component {...pageProps} />
        </UserWrapper>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;

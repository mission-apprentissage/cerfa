import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Fonts from "../theme/Fonts";
import theme from "../theme/index";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme} resetCSS>
        <Fonts />
        <Component {...pageProps} />
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;

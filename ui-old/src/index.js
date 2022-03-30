import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/index";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} resetCSS>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
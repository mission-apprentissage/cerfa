import React from "react";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import Contact from "./Support";
import { BrowserRouter as Router, Route } from "react-router-dom";

Object.defineProperty(window, "matchMedia", {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  },
});

test("should display support", () => {
  const { queryByText } = render(
    <Router>
      <RecoilRoot>
        <Route exact path="/" component={Contact} />
      </RecoilRoot>
    </Router>
  );

  const title = queryByText("Connexion");
  expect(title).toBeInTheDocument();
  // expect(title).toHaveStyle("color: gray.800");
});

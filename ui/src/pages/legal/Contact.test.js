import React from "react";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
// import Contact from "./Contact";
import { BrowserRouter as Router } from "react-router-dom";

test("should display contact", () => {
  const { queryByText } = render(
    <Router>
      <RecoilRoot>
        {/* <Contact /> */}
        <div />
      </RecoilRoot>
    </Router>
  );

  const title = queryByText("Contactez-nous !");
  expect(title).toBeInTheDocument();
  // expect(title).toHaveStyle("color: gray.800");
});

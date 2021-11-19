import React from "react";
import { render } from "@testing-library/react";
import Contact from "./Contact";
import { BrowserRouter as Router } from "react-router-dom";

test("should display contact", () => {
  const { queryByText } = render(
    <Router>
      <Contact />
    </Router>
  );

  const title = queryByText("Contactez-nous !");
  expect(title).toBeInTheDocument();
  // expect(title).toHaveStyle("color: gray.800");
});

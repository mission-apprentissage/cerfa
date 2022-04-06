export const shouldHideRepresentantLegal = ({ values }) => {
  return values.apprenti.apprentiMineurNonEmancipe !== true;
};

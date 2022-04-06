export const shouldHideDateEffetAvenant = ({ values }) => {
  return ![31, 32, 33, 34, 35, 36, 37].includes(values.contrat.typeContratApp);
};

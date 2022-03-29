export const validField = ({ value, validate, dossier, values }) => {
  const result =
    validate?.({
      value,
      dossier,
      values,
    }) ?? {};
  return {
    result,
    isAsync: result.then,
  };
};

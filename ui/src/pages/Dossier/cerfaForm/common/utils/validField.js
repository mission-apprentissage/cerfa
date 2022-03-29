export const validField = ({ value, validate }) => {
  const result =
    validate?.({
      value,
    }) ?? {};
  return {
    result,
    isAsync: result.then,
  };
};

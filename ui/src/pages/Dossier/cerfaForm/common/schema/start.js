export const startRule = ({ value }) => {
  if (!value) {
    return { error: "required" };
  }
};

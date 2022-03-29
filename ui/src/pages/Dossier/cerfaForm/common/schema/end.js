export const endRule = ({ value }) => {
  if (!value) {
    return { error: "required" };
  }
};

export const nameRule = ({ value }) => {
  if (!value) {
    return { error: "required" };
  }
};

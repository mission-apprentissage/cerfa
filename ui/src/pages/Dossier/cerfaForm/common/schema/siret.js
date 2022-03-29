export const siretRule = ({ value }) => {
  if (!value) {
    return {
      error: "required",
    };
  }
  if (value === "siret") {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ error: "siret expired" }), 1000);
    });
  }
  if (value === "good") {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            error: "",
            cascade: { name: { value: "ttoo" }, end: { value: "33" } },
          }),
        1000
      );
    });
  }
};

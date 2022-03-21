export const prettyPrintDate = (date) => {
  const event = new Date(date);
  const options = { hour: "2-digit", minute: "2-digit", year: "numeric", month: "short", day: "numeric" };

  return event.toLocaleDateString("fr-FR", options);
};

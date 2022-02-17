export const fieldsChecker = ({
  action,
  fields,
  setterFields,
  setFieldsErrored,
  setIsValidating,
  resetCheckFields,
  fieldsValided,
  setFieldsValided,
  fieldsErrored,
}) => {
  if (action === "check") {
    let hasBeenChecked = [];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (field.validateField === false && !fieldsValided.includes(field.path)) {
        hasBeenChecked.push(field.path);
      }
    }

    if (hasBeenChecked.length === fields.length - fieldsValided.length) {
      let fErrored = [];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const { errored, name, path, label } = field || { errored: false, name: null, path: null, label: null };
        if (errored) {
          const exist = fieldsErrored.find((e) => e.name === name);
          if (!exist) {
            fErrored = [...fErrored, { name, path, label }];
          }
        }
      }
      setFieldsErrored(fErrored);
      setIsValidating(false);
    }
  } else if (action === "reset") {
    setFieldsErrored([]);

    let previouslyValidated = [];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (field?.errored === false) {
        previouslyValidated.push(field.path);
      }
    }

    setFieldsValided(previouslyValidated);

    const [, setHasBeenReset] = resetCheckFields;
    setHasBeenReset(true);
  } else if (action === "trigger") {
    const trigger = { validateField: true };
    for (let index = 0; index < setterFields.length; index++) {
      const setterField = setterFields[index];
      setterField((item) => ({ ...item, ...(!fieldsValided.includes(item.path) ? trigger : {}) }));
    }

    setIsValidating(true);
  }
};

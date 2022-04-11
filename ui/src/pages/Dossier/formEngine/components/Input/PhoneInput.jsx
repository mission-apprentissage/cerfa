import { InputWrapper } from "./InputWrapper";
import React from "react";
import PInput from "react-phone-input-2";

export const PhoneInput = (props) => {
  const { name, onChange, locked, success, error } = props;
  const value = props.value.replace("+", "");

  const handleChange = (val, country) => {
    onChange(`+${val}`, { countryCode: country.countryCode });
  };

  return (
    <InputWrapper {...props}>
      <PInput
        name={name}
        value={value}
        country={"fr"}
        masks={{
          fr: ". .. .. .. ..",
        }}
        countryCodeEditable={false}
        onChange={handleChange}
        disabled={locked}
        inputClass={`phone-form-input ${success && "valid"} ${error && "error"}`}
        buttonClass={`phone-form-button ${success && "valid"} ${error && "error"}`}
      />
    </InputWrapper>
  );
};

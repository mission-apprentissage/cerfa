const commonFieldStyle = {
  color: "grey.800",
  borderBottomRadius: 0,
  borderTopRadius: "4px",
  borderWidth: 0,
  borderBottom: "2px solid",
  marginBottom: "-2px",
  borderBottomColor: "grey.600",
  bg: "grey.200",
  _focus: {
    borderBottomColor: "grey.600",
    boxShadow: "none",
    outlineColor: "none",
  },
  _focusVisible: {
    borderBottomColor: "grey.600",
    boxShadow: "none",
    outline: "2px solid",
    outlineColor: "#2A7FFE",
    outlineOffset: "2px",
  },
  _invalid: {
    borderBottomColor: "error",
    boxShadow: "none",
    outline: "2px solid",
    outlineColor: "error",
    outlineOffset: "2px",
  },
  _hover: {
    borderBottomColor: "grey.600",
  },
};

const Input = {
  parts: ["field"],
  variants: {
    edition: {
      field: {
        ...commonFieldStyle,
        fontWeight: 700,
      },
    },
    outline: {
      field: {
        ...commonFieldStyle,
        _placeholder: {
          color: "grey.500",
        },
      },
    },
    valid: {
      field: {
        ...commonFieldStyle,
        borderBottomColor: "green.500",
      },
    },
    autoFilled: {
      field: {
        ...commonFieldStyle,
        fontStyle: "italic",
        cursor: "not-allowed",
        borderBottomColor: "green.400",
        _placeholder: {
          color: "grey.800",
        },
      },
    },
  },
};

export { Input };

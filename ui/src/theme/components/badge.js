const commonStatusBadgeStyle = {
  fontSize: "omega",
  fontWeight: 500,
  borderRadius: 20,
  px: 3,
  py: 1,
  textTransform: "none",
};

const Badge = {
  variants: {
    notRelevant: {
      ...commonStatusBadgeStyle,
      bg: "#e3e8ea",
      color: "grey.800",
      border: "1px solid",
      borderColor: "#e3e8ea",
    },
    nonConforme: {
      ...commonStatusBadgeStyle,
      bg: "#e3e8ea",
      color: "grey.800",
      border: "1px solid",
      borderColor: "#e3e8ea",
    },
    conforme: {
      ...commonStatusBadgeStyle,
      bg: "greenmedium.300",
      color: "grey.800",
      border: "1px solid",
      borderColor: "greenmedium.200",
    },
    published: {
      ...commonStatusBadgeStyle,
      bg: "greenmedium.300",
      color: "grey.800",
      border: "1px solid",
      borderColor: "greenmedium.200",
    },
    notPublished: {
      ...commonStatusBadgeStyle,
      bg: "grey.300",
      color: "grey.800",
      border: "1px solid",
      borderColor: "grey.300",
    },
    toBePublished: {
      ...commonStatusBadgeStyle,
      bg: "orangemedium.300",
      color: "grey.800",
      border: "1px solid",
      borderColor: "orangemedium.300",
    },
    termine: {
      ...commonStatusBadgeStyle,
      bg: "greensoftc",
      color: "white",
    },
    pending: {
      ...commonStatusBadgeStyle,
      bg: "greenmedium.200",
      color: "#a3b3b7",
      border: "1px solid",
      borderColor: "greenmedium.200",
    },
    reject: {
      ...commonStatusBadgeStyle,
      bg: "redmarianne",
      color: "white",
    },
    unknown: {
      ...commonStatusBadgeStyle,
      bg: "#D5DBEF",
      color: "grey.800",
      border: "1px solid",
      borderColor: "#D5DBEF",
    },
    year: {
      ...commonStatusBadgeStyle,
      bg: "greenmedium.300",
      color: "grey.800",
      pl: "15px",
      pr: "15px",
    },
    signed: {
      ...commonStatusBadgeStyle,
      bg: "#E3E3FD",
      color: "bluefrance",
    },
    waitingSignature: {
      ...commonStatusBadgeStyle,
      bg: "#E3E3FD",
      color: "bluefrance",
    },
    sign: {
      ...commonStatusBadgeStyle,
      bg: "greensoft.200",
      color: "success",
      pl: "15px",
      fontWeight: "500",
      pr: "15px",
    },
    draft: {
      ...commonStatusBadgeStyle,
      bg: "#FCC0B0",
      color: "#161616",
      pl: "15px",
      pr: "15px",
      fontWeight: "500",
    },
    save: {
      ...commonStatusBadgeStyle,
      bg: "#EEEEEE",
      color: "#161616",
      pl: "15px",
      pr: "15px",
      fontWeight: "500",
    },
  },
};

export { Badge };

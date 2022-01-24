import { StepsStyleConfig as StepsStyle } from "chakra-ui-steps-rework-mna";

const Steps = {
  ...StepsStyle,
  baseStyle: (props) => {
    return {
      ...StepsStyle.baseStyle(props),
      connector: {
        borderColor: "gray.200",
        transitionProperty: "border-color",
        transitionDuration: "normal",
        _highlighted: {
          // borderColor: "green.500",
        },
      },
      description: {
        color: `gray.800`,
      },
      icon: {
        strokeWidth: "2px",
      },
      label: {
        color: `labelgrey`,
        opacity: 1,
      },
      labelContainer: {},
      step: {},
      stepContainer: {
        _focus: { boxShadow: "none", outlineColor: "none" },
        _focusVisible: { boxShadow: "0 0 0 3px #2A7FFE", outlineColor: "#2A7FFE" },
      },
      stepIconContainer: {
        bg: "gray.200",
        borderColor: "gray.200",
        transitionProperty: "background, border-color",
        transitionDuration: "normal",
        _invalid: {
          bg: "flatwarm",
          borderColor: "flatwarm",
        },
        _valid: {
          bg: "greensoftc",
          borderColor: "greensoftc",
        },
        _activeStep: {
          bg: "bluefrance",
          borderColor: "bluefrance",
          color: "white",
          _invalid: {
            bg: "flatwarm",
            borderColor: "flatwarm",
          },
        },
        _highlighted: {
          bg: "greensoftc",
          borderColor: "greensoftc",
          _invalid: {
            bg: "flatwarm",
            borderColor: "flatwarm",
          },
        },
        "&[data-clickable]:hover": {
          borderColor: "bluefrance",
        },
      },
      steps: {},
    };
  },
};

export { Steps };

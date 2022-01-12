import { StepsStyleConfig as StepsStyle } from "chakra-ui-steps";

const Steps = {
  ...StepsStyle,
  baseStyle: (props) => {
    const { cerfaComplete } = props.onClickStep();
    // console.log(props);

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
        strokeWidth: !cerfaComplete && props.activeStep !== 0 ? "-1px" : "2px",
      },
      label: {
        color: `labelgrey`,
        opacity: 1,
      },
      labelContainer: {},
      step: {},
      stepContainer: {},
      stepIconContainer: {
        bg: "gray.200",
        borderColor: "gray.200",
        transitionProperty: "background, border-color",
        transitionDuration: "normal",
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
          bg: !cerfaComplete && props.activeStep !== 0 ? "flatwarm" : "greensoftc",
          borderColor: !cerfaComplete && props.activeStep !== 0 ? "flatwarm" : "greensoftc",
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

const Switch = {
  parts: ["container", "track", "label", "thumb"],
  baseStyle: {
    track: {
      _checked: {
        background: "bluefrance",
        borderColor: "bluefrance",
      },
    },
  },
  variants: {
    icon: {
      thumb: {
        _checked: {
          _before: {
            color: "bluefrance",
            width: "var(--slider-track-height)",
            height: "var(--slider-track-height)",
            content: '"✓"',
            position: "absolute",
            mt: "-1px",
            ml: "2px",
            fontSize: "0.8em",
          },
        },
      },
    },
  },
};

export { Switch };

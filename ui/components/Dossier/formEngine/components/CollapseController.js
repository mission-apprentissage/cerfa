import { memo } from "react";
import { useRecoilValue } from "recoil";
import { valuesSelector } from "../atoms";
import { Collapse } from "@chakra-ui/react";

export const CollapseController = memo(({ hide, children, show }) => {
  const values = useRecoilValue(valuesSelector);
  return (
    <Collapse animateOpacity in={show ? show({ values }) : !hide({ values })} unmountOnExit={true}>
      {children}
    </Collapse>
  );
});

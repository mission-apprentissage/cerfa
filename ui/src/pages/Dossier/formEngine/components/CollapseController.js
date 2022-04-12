import { memo } from "react";
import { useRecoilValue } from "recoil";
import { valuesSelector } from "../atoms";
import { Collapse } from "@chakra-ui/react";

export const CollapseController = memo(({ children, show }) => {
  const values = useRecoilValue(valuesSelector);
  return (
    <Collapse animateOpacity in={show ? show({ values }) : false} unmountOnExit={true}>
      {children}
    </Collapse>
  );
});

import { memo } from "react";
import { useRecoilValue } from "recoil";
import { valuesSelector } from "../formEngine/atoms";
import { Collapse } from "@chakra-ui/react";

export const CollapseController = memo(({ hide, children }) => {
  const values = useRecoilValue(valuesSelector);
  return (
    <Collapse animateOpacity in={!hide({ values })}>
      {children}
    </Collapse>
  );
});

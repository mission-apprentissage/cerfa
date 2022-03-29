import { useRecoilValue } from "recoil";
import { cerfaAtom } from "../common/atoms";
import { InputController } from "../common/Input/InputController";

export const Contrat = ({ controller }) => {
  const cerfa = useRecoilValue(cerfaAtom);

  return (
    <>
      <InputController name={"start"} controller={controller} />
      <InputController name={"end"} controller={controller} />
    </>
  );
};

import { InputController } from "../common/Input/InputController";

export const Employer = ({ controller }) => {
  return (
    <>
      <InputController name={"siret"} controller={controller} />
      <InputController name={"name"} controller={controller} />
    </>
  );
};

import { isInitialServerSideProps } from "./isInitialServerSideProps";
import { anonymous } from "../anonymous";

export const getAuthServerSideProps = async (context) => {
  if (!isInitialServerSideProps(context)) {
    return undefined;
  }
  try {
    const res = await fetch(`${process.env.SERVER_URI}/api/v1/authentified/current`, {
      headers: context.req.headers,
    });
    const auth = res.status === 200 ? await res.json() : anonymous;
    return { auth };
  } catch (e) {
    return { auth: anonymous };
  }
};

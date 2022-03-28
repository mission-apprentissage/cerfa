import { Suspense } from "react";
import Layout from "../Layout/Layout";

export function Page({ children }) {
  return (
    <Suspense fallback={<div></div>}>
      <Layout>{children}</Layout>
    </Suspense>
  );
}

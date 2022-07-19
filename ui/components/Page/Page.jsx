import Layout from "../Layout/Layout";

export function Page({ children, withoutDisplayNavigationBar = false }) {
  return <Layout withoutDisplayNavigationBar={withoutDisplayNavigationBar}>{children}</Layout>;
}

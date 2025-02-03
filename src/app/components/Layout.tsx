import { Layout as DefaultLayout } from "react-admin";
import { AppBar } from "../components/AppBar";

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <DefaultLayout appBar={AppBar}>{children}</DefaultLayout>
);

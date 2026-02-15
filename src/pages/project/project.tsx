import Page from "../../components/Page";
import { Outlet } from "react-router-dom";

export default function Project() {
  return (
    <Page>
      <Outlet />
    </Page>
  );
}

import Page from "../../components/Page";
import { Outlet } from "react-router-dom";

export default function Project() {
  return (
    <Page title="프로젝트" className="space-y-3">
      <Outlet />
    </Page>
  );
}

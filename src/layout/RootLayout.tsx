import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "@/components/footerNavigation/FooterNavigation";

export default function RootLayout() {
  const location = useLocation();

  const isCustomPatch = location.pathname === "/custom/patch";

  return (
    <>
      <Outlet />

      {!isCustomPatch && <BottomNavigation />}
    </>
  );
}

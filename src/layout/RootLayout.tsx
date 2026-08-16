import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "@/components/footerNavigation/FooterNavigation";

export default function RootLayout() {
  const location = useLocation();

  // 커스텀 페이지에서는 바텀 네비게이션 숨김
  const hideBottomNavigation = location.pathname === "/custom/customizing";

  return (
    <>
      <Outlet />

      {/* 커스텀 페이지가 아닐 때만 보여줌 */}
      {!hideBottomNavigation && <BottomNavigation />}
    </>
  );
}

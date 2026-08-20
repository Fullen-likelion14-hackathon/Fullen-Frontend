import { Outlet, useLocation } from "react-router-dom";

import BottomNavigation from "@/components/footerNavigation/FooterNavigation";

export default function RootLayout() {
  const location = useLocation();

  // 제품 커스텀 상세 페이지와 AI 패치 생성 플로우에서는 바텀 네비게이션 숨김
  const hideBottomNavigation =
    location.pathname === "/custom/customizing" || location.pathname.startsWith("/custom/ai-patch");

  return (
    <>
      <Outlet />

      {/* 바텀 네비게이션을 숨기는 페이지가 아닐 때만 보여줌 */}
      {!hideBottomNavigation && <BottomNavigation />}
    </>
  );
}

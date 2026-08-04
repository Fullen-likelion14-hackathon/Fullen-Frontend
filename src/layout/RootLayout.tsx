import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/footerNavigation/FooterNavigation";

export default function RootLayout() {
  return (
    <>
      <main className="pb-20">
        <Outlet />
      </main>

      <BottomNavigation />
    </>
  );
}

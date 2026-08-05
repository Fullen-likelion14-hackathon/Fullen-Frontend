import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "@/layout/RootLayout";

import Login from "@/pages/Login/Login";
import NfcTagging from "@/pages/NfcTagging/NfcTagging";
import MCoM from "@/pages/MCoM/MCoM";
import Passport from "@/pages/Passport/Passport";
import Custom from "@/pages/Custom/Custom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / NFC 태깅 - 하단 네비게이션 없는 온보딩 플로우 */}
        <Route path="/login" element={<Login />} />
        <Route path="/nfc-tagging" element={<NfcTagging />} />

        <Route element={<RootLayout />}>
          {/* MCoM - 피드 구경 페이지 */}
          <Route path="/" element={<MCoM />} />

          {/* Passport - 내 여행기록 페이지 */}
          <Route path="/passport" element={<Passport />} />

          {/* Custom - 제품 커스텀 페이지 */}
          <Route path="/custom" element={<Custom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

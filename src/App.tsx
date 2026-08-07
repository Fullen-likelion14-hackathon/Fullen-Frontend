import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "@/layout/RootLayout";

import Login from "@/pages/Login/Login";
import NfcTagging from "@/pages/NfcTagging/NfcTagging";
import MCoM from "@/pages/MCoM/MCoM";
import Passport from "@/pages/Passport/Passport";
import Custom from "@/pages/Custom/Custom";
import MCoMView from "@/pages/MCoM/MCoMView";
import McoMDetail from "./pages/MCoM/MCoMDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / NFC 태깅 - 하단 네비게이션 없는 온보딩 플로우 */}
        <Route path="/login" element={<Login />} />
        <Route path="/nfc-tagging" element={<NfcTagging />} />

        <Route element={<RootLayout />}>
          {/*메인 페이지 Passport - 내 여행기록 페이지*/}
          <Route path="/" element={<Passport />} />
          {/* MCoM - 피드 구경 페이지 */}
          <Route path="/mcom" element={<MCoM />} />
          {/* MCoM - 피드 미리보기 페이지 */}
          <Route path="/mcom/view/:feedId" element={<MCoMView />} />
          {/* MCoM - 피드 디테일 페이지 */}
          <Route path="/mcom/view/:feedId/detail" element={<McoMDetail />} />

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

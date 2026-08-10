import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "@/layout/RootLayout";

import Login from "@/pages/Login/Login";
import NfcTagging from "@/pages/NfcTagging/NfcTagging";
import MCoM from "@/pages/MCoM/MCoM";
import Passport from "@/pages/Passport/Passport";
import Custom from "@/pages/Custom/Custom";
import MCoMView from "@/pages/MCoM/MCoMView";
import McoMDetail from "@/pages/MCoM/MCoMDetail";
import Map from "@/pages/Map/Map";
import CategoryNew from "@/pages/CategoryNew/CategoryNew";
import CategoryFeed from "@/pages/CategoryFeed/CategoryFeed";
<<<<<<< HEAD
import CustomPatch from "@/pages/Custom/CustomPatch";
=======
import CustomRequest from "@/pages/Custom/CustomRequest";
import CustomRequestComplete from "@/pages/Custom/CustomRequestComplete";
import CustomRequestDetail from "@/pages/Custom/CustomRequestDetail";
>>>>>>> origin/develop

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / NFC 태깅 - 하단 네비게이션 없는 온보딩 플로우 */}
        <Route path="/login" element={<Login />} />
        <Route path="/nfc-tagging" element={<NfcTagging />} />
        {/* 지도 페이지 - 하단 네비게이션 없음(전체화면) */}
        <Route path="/map" element={<Map />} />
        {/* Passport - 카테고리 추가 페이지 - 하단 네비게이션 없음 (⚠️ /passport/:categoryId 보다 반드시 위에 있어야 함) */}
        <Route path="/passport/new" element={<CategoryNew />} />
        {/* Passport - 카테고리 안 피드 목록 페이지 - 하단 네비게이션 없음 */}
        <Route path="/passport/:categoryId" element={<CategoryFeed />} />

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
<<<<<<< HEAD
          <Route path="/custom/patch" element={<CustomPatch />} />
=======
          {/* Custom - 1:1 커스텀 신청 */}
          <Route path="/custom/request" element={<CustomRequest />} />
          {/* Custom - 1:1 커스텀 신청완료 */}
          <Route path="/custom/request/complate" element={<CustomRequestComplete />} />
          {/* Custom - 1:1 커스텀 신청완료 */}
          <Route path="/custom/request/:requestId" element={<CustomRequestDetail />} />
>>>>>>> origin/develop
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

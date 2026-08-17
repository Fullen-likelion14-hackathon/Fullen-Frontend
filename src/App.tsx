import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "@/layout/RootLayout";

import Login from "@/pages/Login/Login";
import NfcTagging from "@/pages/NfcTagging/NfcTagging";
import MCoM from "@/pages/MCoM/MCoM";
import Passport from "@/pages/Passport/Passport";

import MCoMView from "@/pages/MCoM/MCoMView";
import McoMDetail from "@/pages/MCoM/MCoMDetail";
import Map from "@/pages/Map/Map";
import CategoryNew from "@/pages/CategoryNew/CategoryNew";
import CategoryFeed from "@/pages/CategoryFeed/CategoryFeed";
import FeedNew from "@/pages/FeedNew/FeedNew";
import FeedDetail from "@/pages/FeedDetail/FeedDetail";
import PassportDetail from "@/pages/PassportDetail/PassportDetail";

import Customizing from "@/pages/Custom/Customizing";
import CustomMain from "@/pages/Custom/CustomMain";
import CustomOrder from "@/pages/Custom/CustomOrder";

import OneToOneOrderMain from "@/pages/OneToOneOrder/OneToOneOrderMain";
import CustomRequest from "@/pages/OneToOneOrder/CustomRequest";
import CustomArtistSelect from "@/pages/OneToOneOrder/CustomArtistSelect";

import MyPage from "@/pages/MyPage/MyPage";
import MyOrderList from "@/pages/MyPage/MyOrderList";
import DigitalProductPassport from "@/pages/MyPage/DigitalProductPassport";

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
        {/* Passport - 대륙별 상세 페이지 - 하단 네비게이션 없음, "전체" 모드는 continent에 "all" 전달 */}
        <Route path="/passport/detail/:continent" element={<PassportDetail />} />
        {/* Passport - 새 게시물 생성 페이지 - 하단 네비게이션 없음 (⚠️ /passport/:categoryId/:feedId 보다 반드시 위에 있어야 함) */}
        <Route path="/passport/:categoryId/new" element={<FeedNew />} />
        {/* Passport - 카테고리 안 피드 목록 페이지 - 하단 네비게이션 없음 */}
        <Route path="/passport/:categoryId" element={<CategoryFeed />} />
        {/* Passport - 피드 상세 페이지 - 하단 네비게이션 없음 */}
        <Route path="/passport/:categoryId/:feedId" element={<FeedDetail />} />

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
          <Route path="/custom" element={<CustomMain />} />
          <Route path="/custom/customizing" element={<Customizing />} />
          <Route path="/custom/order" element={<CustomOrder />} />

          {/* Custom - 1:1 커스텀 신청 메인 화면 */}
          <Route path="/onetooneorder" element={<OneToOneOrderMain />} />
          {/* Custom - 1:1 커스텀 신청 */}
          <Route path="/onetooneorder/request" element={<CustomRequest />} />
          {/* Custom - 1:1 커스텀 작가 선택 */}
          <Route path="/onetooneorder/artist" element={<CustomArtistSelect />} />

          {/* MyPage- 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          {/* MyPage- 마이페이지 주문내역 */}
          <Route path="/mypage/orders" element={<MyOrderList />} />
          {/* MyPage- 마이페이지 ddp */}
          <Route path="/mypage/ddp" element={<DigitalProductPassport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

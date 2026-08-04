import { BrowserRouter, Route, Routes } from "react-router-dom";

import RootLayout from "@/layout/RootLayout";

import MCoM from "@/pages/MCoM/MCoM";
import Passport from "@/pages/Passport/Passport";
import Custom from "@/pages/Custom/Custom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

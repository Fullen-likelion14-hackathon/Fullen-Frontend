import { Headphones, KeyRound, MapPin, PackageCheck, Pencil, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyPageMenuItem from "@/components/myPage/MyPageMenuItem";

export default function MyPage() {
  const navigate = useNavigate();
  const menuItems = [
    { label: "아이디 관리", icon: <UserRound /> },
    { label: "비밀번호 관리", icon: <KeyRound /> },
    { label: "내 배송지 관리", icon: <MapPin /> },
    { label: "나의 주문 목록", icon: <PackageCheck />, onClick: () => navigate("/mypage/orders") },
  ];
  return (
    <div className="min-h-dvh bg-[#faf5f0] pb-32 font-['Pretendard_Variable'] text-[#192940]">
      <header className="border-b-8 border-[#aa6829] px-6 pb-5 pt-10 text-center">
        <h1 className="text-[24px] font-bold">마이페이지</h1>
      </header>
      <main className="mx-auto max-w-107 px-8 pt-10">
        <div className="mb-1 flex items-center justify-center gap-2 border-b-2 border-[#e2cdb9] pb-4">
          <p className="text-[24px] font-extrabold text-black">@멋쟁이사자처럼</p>
          <Pencil className="size-5 fill-[#c8c9cc] text-[#c8c9cc]" aria-label="닉네임 수정" />
        </div>
        <div>
          {menuItems.map((item) => (
            <MyPageMenuItem key={item.label} {...item} />
          ))}
          <MyPageMenuItem
            label="제품 디지털 여권"
            icon={<span className="text-[17px] font-bold">DDP</span>}
            onClick={() => navigate("/mypage/ddp")}
          />
        </div>
        <button
          type="button"
          className="mt-10 flex w-full items-center rounded-2xl bg-[#e5e2e2] px-7 py-3 text-left"
        >
          <Headphones className="mr-6 size-12 text-[#a7abb0]" strokeWidth={1.8} />
          <span className="flex-1">
            <strong className="block text-[19px]">고객센터</strong>
            <span className="text-[15px] font-semibold text-[#aaadb2]">
              문의 사항이 있으신가요?
            </span>
          </span>
          <span className="text-4xl font-light text-[#8d9299]">›</span>
        </button>
      </main>
    </div>
  );
}

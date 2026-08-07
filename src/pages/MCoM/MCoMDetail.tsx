import { useNavigate } from "react-router-dom";

export default function McoMDetail() {
  const navigate = useNavigate;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col bg-[#242D41] text-white">
        <header className="border-b-[7px] border-[#AB6A37] bg-[#242D41] pb-6.25 pt-11">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate()}
              className="absolute left-5"
            ></button>

            <h1 className="text-center text-xl font-semibold text-[#F7F7F7]">현재 위치한 나라</h1>
          </div>
        </header>
      </div>
    </div>
  );
}

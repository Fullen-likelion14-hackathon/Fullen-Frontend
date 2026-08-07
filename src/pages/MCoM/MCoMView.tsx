import { useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function MCoMView() {
  const { feedId } = useParams();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gray-50 ">
      <div className="mx-auto min-h-screen bg-[#242D41] text-white ">
        <header className="b pt-18 pb-8 border-b-[7px] border-[#AB6A37]">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate(-1)}
              className="absolute left-5"
            >
              <ChevronLeft size={36} strokeWidth={2.5} />
            </button>

            <h1 className="text-center text-xl font-semibold text-[#F7F7F7]">
              현재 위치한 나라 {feedId}
            </h1>
          </div>
        </header>
      </div>
    </main>
  );
}

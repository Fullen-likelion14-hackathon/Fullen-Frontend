import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  const handleTestLogin = () => {
    // TODO: 실제 로그인/회원가입 기능 미구현 상태, 테스트용 버튼으로 임시 대체
    navigate("/nfc-tagging");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#242D41] px-6">
      <Button
        onClick={handleTestLogin}
        className="rounded-full bg-white px-6 py-2 text-2xl font-semibold text-neutral-500 shadow-[0_0_10.5px_0_rgba(120,74,39,0.25),inset_0_3px_3px_0_rgba(255,255,255,0.25),inset_0_-1.5px_1.5px_0_rgba(159,159,159,0.25)] hover:bg-white hover:text-neutral-500"
      >
        테스트용 버튼으로 시작하기
      </Button>
    </div>
  );
}
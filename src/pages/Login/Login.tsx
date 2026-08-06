import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mcmLogo from "@/assets/images/mcmLogo.png";

export default function Login() {
  const navigate = useNavigate();

  const handleTestLogin = () => {
    // TODO: 실제 로그인/회원가입 기능 미구현 상태, 테스트용 버튼으로 임시 대체
    navigate("/nfc-tagging");
  };

  return (
    // 배경색: 피그마 고정 네이비(#242D41), FooterNavigation과 동일 컬러
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#242D41] px-6 pb-5">
      {/* 헤드라인 텍스트 - 문구/줄바꿈 위치는 서비스명 확정되면 수정 필요 */}
      {/* pt-64: 텍스트 세로 위치 조정 (디자인 값 아님, 화면 보면서 조절) */}
      <h1 className="pt-64 text-center text-3xl font-black text-white">
        나의 여정을 함께하는
        <br />
        서비스명
      </h1>

      {/* MCM 로고 - absolute로 문서 흐름에서 분리, 텍스트/버튼 간격에 영향 안 줌 */}
      {/* pointer-events-none: absolute 요소가 버튼 클릭을 가로채는 것 방지 (필수) */}
      {/* top-84: 위치 조정용 값, 다른 요소와 겹쳐도 무방 */}
      <img
        src={mcmLogo}
        alt="MCM 로고"
        className="pointer-events-none absolute top-84 left-1/2 w-full max-w-116.5 -translate-x-1/2 object-contain"
      />

      {/* 시작 버튼 */}
      {/* mb-2: 화면 하단에서 살짝 띄우기 위한 여백 (디자인 값 아님, 화면 보면서 조절한 값) */}
      <Button
        onClick={handleTestLogin}
        className="mt-auto mb-2 h-14 w-80 max-w-full shrink-0 rounded-[10px] bg-white/40 px-6 py-2 text-xl font-semibold text-white shadow-[0_0_10.5px_0_rgba(94,140,136,0.25),inset_0_3px_3px_0_rgba(255,255,255,0.25),inset_0_-1.5px_1.5px_0_rgba(159,159,159,0.25)] hover:bg-white/40"
      >
        테스트용 버튼으로 시작하기
      </Button>
    </div>
  );
}

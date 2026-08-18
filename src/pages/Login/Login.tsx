import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import bagFloor from "@/assets/images/bagFloor.png";
import bagCarrier from "@/assets/images/bagCarrier.png";
import loginPlane from "@/assets/icons/loginplane.png";
import { useLogin } from "@/hooks/queries/useLogin";

// ── 비행기 경로/각도 조절값 (SVG viewBox 0 0 320 160 기준, 숫자만 바꾸며 테스트 가능) ──
const PLANE_START = { x: 0, y: 20 }; // 시작점: 왼쪽 벽, 시작하자마자
const PLANE_CONTROL = { x: 160, y: 160 }; // 중간에 크게 처지는 지점 - 진폭(하강 폭) 담당
const PLANE_END = { x: 310, y: 5 }; // 도착점: 더 멀리, Füllen 옆 고정 위치
const PLANE_ANGLE_OFFSET = 0; // 아이콘이 회전해도 방향이 이상하면 -90, 90, 180 등으로 보정
const PLANE_DURATION = 3500; // ms, 이동+정지 합친 한 사이클 길이
const PLANE_HOLD_RATIO = 0.15; // 도착 후 멈춰있는 비율(0~1)

const PLANE_PATH = `M${PLANE_START.x},${PLANE_START.y} Q${PLANE_CONTROL.x},${PLANE_CONTROL.y} ${PLANE_END.x},${PLANE_END.y}`;

export default function Login() {
  const navigate = useNavigate();
  const geometryPathRef = useRef<SVGPathElement>(null); // 좌표 계산 전용, 화면엔 안 보임
  const revealRef = useRef<HTMLDivElement>(null); // clip-path로 점선을 진행률만큼 드러내는 래퍼
  const planeRef = useRef<HTMLImageElement>(null);
  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    const geometryPath = geometryPathRef.current;
    const reveal = revealRef.current;
    const plane = planeRef.current;
    if (!geometryPath || !reveal || !plane) return;

    const totalLength = geometryPath.getTotalLength();

    let rafId: number;
    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) % PLANE_DURATION;
      const moveDuration = PLANE_DURATION * (1 - PLANE_HOLD_RATIO);
      const progress = Math.min(elapsed / moveDuration, 1);

      const currentLength = progress * totalLength;
      const point = geometryPath.getPointAtLength(currentLength);

      // 살짝 앞선 지점과의 각도 차이로 진행 방향(접선)을 구해서 곡선 기울기에 맞춰 자연스럽게 회전
      const aheadLength = Math.min(currentLength + 1, totalLength);
      const aheadPoint = geometryPath.getPointAtLength(aheadLength);
      const angleDeg =
        (Math.atan2(aheadPoint.y - point.y, aheadPoint.x - point.x) * 180) / Math.PI +
        PLANE_ANGLE_OFFSET;

      plane.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angleDeg}deg)`;

      // clip-path로 왼쪽부터 진행률만큼만 점선을 드러냄 (mask보다 렌더링 안정적)
      reveal.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleTestLogin = () => {
    // TODO: 실제 로그인/회원가입 UI는 미구현, 테스트 계정으로 API 연동 확인용
    login(
      { email: "test@test.com", password: "password123!" },
      {
        onSuccess: () => navigate("/nfc-tagging"),
        onError: (error) => {
          console.error("로그인 실패:", error);
          alert("로그인에 실패했습니다.");
        },
      },
    );
  };

  return (
    // 배경색: 피그마 고정 슬레이트(#1E293B, slate-800)
    <div className="relative mx-auto flex min-h-dvh w-full max-w-97.5 flex-col overflow-hidden bg-slate-800">
      {/* 바닥 이미지 - 화면 하단 고정 */}
      <img
        src={bagFloor}
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-full object-cover"
      />

      {/* 헤드라인 텍스트 */}
      <h1 className="absolute left-[54px] top-[151px] font-['Paperlogy'] text-2xl font-medium tracking-wide text-slate-300">
        여행으로 채워가는
        <br />
        나만의 가방
      </h1>

      {/* 서비스명 로고 */}
      <div className="absolute left-[54px] top-[236px] font-['Paperlogy'] text-5xl font-bold tracking-wide text-stone-100">
        Füllen
      </div>

      {/* 비행기 애니메이션 - 텍스트 블록 아래, 왼쪽 벽에서 시작해 크게 처졌다 위로 올라가며 멀리 이동 */}
      <div className="absolute left-0 top-[250px] z-10 h-40 w-80">
        {/* 좌표 계산 전용 path, 화면에 안 보임 */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 160" fill="none">
          <path ref={geometryPathRef} d={PLANE_PATH} stroke="none" fill="none" />
        </svg>

        {/* 실제 보이는 점선 - clip-path로 진행률만큼만 드러남 */}
        <div ref={revealRef} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 160" fill="none">
            <path
              d={PLANE_PATH}
              stroke="#94A3B8"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeDasharray="4 6"
              fill="none"
            />
          </svg>
        </div>

        <img ref={planeRef} src={loginPlane} alt="" className="absolute left-0 top-0 h-7 w-7" />
      </div>

      {/* 캐리어 일러스트 - MCM 로고 합성된 완성 이미지 */}
      <img
        src={bagCarrier}
        alt="MCM 캐리어"
        className="pointer-events-none absolute -left-6 top-[186px] w-[598px] max-w-none"
      />

      {/* 시작 버튼 */}
      <Button
        onClick={handleTestLogin}
        disabled={isPending}
        className="absolute bottom-[60px] left-1/2 h-14 w-80 max-w-full -translate-x-1/2 shrink-0 rounded-[10px] bg-stone-300 px-6 py-2 text-xl font-bold tracking-tight text-slate-800 shadow-[0_0_10px_0_rgba(81,66,54,0.20),inset_0_1px_1px_1px_rgba(255,255,255,0.10),inset_0_-1px_1px_1px_rgba(0,0,0,0.10)] hover:bg-stone-300/90"
      >
        {isPending ? "로그인 중..." : "테스트 버튼으로 시작하기"}
      </Button>
    </div>
  );
}

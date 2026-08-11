//three.js 공간 담당 컴포넌트
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

import { Product } from "./Product";
import { FloatingShadow } from "./FloatingShadow";

const DEFAULT_DISTANCE = 7; //카메라 기본 거리

type ProductViewerProps = {
  isCustomizing: boolean;
};

export function ProductViewer({ isCustomizing }: ProductViewerProps) {
  return (
    <div className="h-full w-full">
      {/*카메라 설정*/}
      <Canvas
        camera={{
          position: [0, 1.5, DEFAULT_DISTANCE], //카메라 설정
          fov: 45, //카메라 시야각
          near: 0.1, //카메라 렌더링 범위
          far: 100,
        }}
      >
        {/* 가방 조명 */}
        <directionalLight position={[4, 6, 5]} intensity={1.5} />

        {/* 3D 가방 배치 */}
        <Product isCustomizing={isCustomizing} />

        {/* 가방 아래 부드러운 가짜 그림자 */}
        <FloatingShadow isCustomizing={isCustomizing} />

        {/* GLB 재질 반사용 환경광 */}
        <Environment preset="studio" environmentIntensity={0.3} />

        {/* 회전 + 확대 */}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={true}
          enableZoom={true}

          // 가방 중심
          target={[0, 1.5, 0]}

          // 확대 한계
          minDistance={4}

          // 초기 크기보다 더 작게 축소되지 않도록
          maxDistance={DEFAULT_DISTANCE}

          // 위/아래 회전 범위
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI - 0.15}

          // 부드러운 움직임
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}

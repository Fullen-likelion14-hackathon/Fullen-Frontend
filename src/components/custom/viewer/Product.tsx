//제품 렌더링
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import bagUrl from "@/assets/models/OttomarBag.glb";

type ProductProps = {
  isCustomizing: boolean;
};

export function Product({ isCustomizing }: ProductProps) {
  const { scene } = useGLTF(bagUrl); //가방의 전체 묶음 - mesh of 가방 몸체, 손잡이,지퍼 로고, etc.

  // 가방 전체를 감싸는 group을 가리키기 위한 ref
  const groupRef = useRef<THREE.Group>(null);

  // 가방이 최종적으로 회전해야 하는 목표 각도
  const targetRotation = useRef(0);

  // 현재 자동 회전 중인지 확인
  const isRotating = useRef(false);

  useEffect(() => {
    //traverse - 가방 내부 3d요소를 전부 순회
    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = false;
        object.receiveShadow = false;

        const material = object.material; //가방 재질 가져오기

        if (
          material instanceof THREE.MeshStandardMaterial ||
          material instanceof THREE.MeshPhysicalMaterial
        ) {
          material.envMapIntensity = 0.5;
          material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // 커스터마이징 버튼을 클릭해서 isCustomizing이 true가 되면
  // 현재 가방 각도에서 360도만큼 더 회전하도록 목표 설정
  useEffect(() => {
    if (!groupRef.current) return;

    if (isCustomizing) {
      targetRotation.current = groupRef.current.rotation.y + Math.PI * 2;

      isRotating.current = true;
    }
  }, [isCustomizing]);

  // Three.js 화면이 그려질 때마다 실행되는 애니메이션
  useFrame(() => {
    if (!groupRef.current) return;

    // =========================
    // 가방 위/아래 위치 이동
    // ==========================

    // 기본 상태에서는 y = 1.9
    // 커스터마이징 상태에서는 y = 2.5까지 위로 이동
    const targetY = isCustomizing ? 2.5 : 1.9;

    // 현재 위치에서 목표 위치로 부드럽게 이동
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);

    // =========================
    // 가방 360도 자동 회전
    // ==========================

    if (!isRotating.current) return;

    const currentRotation = groupRef.current.rotation.y;

    // 현재 각도에서 목표 각도로 부드럽게 이동
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      currentRotation,
      targetRotation.current,
      0.05,
    );

    // 목표 각도에 거의 도착하면 정확히 맞추고 회전 종료
    if (Math.abs(targetRotation.current - groupRef.current.rotation.y) < 0.01) {
      groupRef.current.rotation.y = targetRotation.current;
      isRotating.current = false;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.9, 0]}>
      <primitive object={scene} scale={1.1} />
    </group>
  );
}

useGLTF.preload(bagUrl);

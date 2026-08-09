//제품 렌더링
import * as THREE from "three";
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

import bagUrl from "@/assets/models/OttomarBag.glb";

export function Product() {
  const { scene } = useGLTF(bagUrl); //가방의 전체 묶음 - mesh of 가방 몸체, 손잡이,지퍼 로고, etc.

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

  return <primitive object={scene} position={[0, 1.9, 0]} scale={1.1} />;
}

useGLTF.preload(bagUrl);

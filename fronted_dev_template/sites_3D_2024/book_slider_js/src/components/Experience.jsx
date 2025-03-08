import { Environment, Float, OrbitControls, useProgress } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Book } from "./Book";
import * as THREE from "three";

export const Experience = ({ onCategoryClick }) => {
  const controlsRef = useRef();
  const bookRef = useRef();
  const { viewport } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const { progress } = useProgress();

  // Ajusta a posição baseado no viewport
  const isMobile = viewport.width < 5;
  const isLandscape = window.innerWidth > window.innerHeight;

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableZoom = true; // Habilita zoom
      controlsRef.current.minDistance = 2; // Distância mínima de zoom
      controlsRef.current.maxDistance = 10; // Distância máxima de zoom
      controlsRef.current.enablePan = true;  // Habilita pan
      // Remove limites de rotação vertical para girar 360°
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = Math.PI;
    }
  }, []);

  return (
    <>
      <group 
        ref={bookRef}
        rotation={[0, 0, 0]} // Remove rotação inicial
      >
        <Book />
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
      />

      <Environment preset="studio" />
      
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <ambientLight intensity={0.3} />

      <mesh 
        position-y={-2}
        rotation-x={-Math.PI / 2} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};

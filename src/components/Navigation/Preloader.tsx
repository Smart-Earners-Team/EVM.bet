// src/components/Preloader.tsx

import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Dot: React.FC<{ position: [number, number, number]; active: boolean }> = ({ position, active }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = active ? Math.sin(Date.now() / 200) * 0.3 : 0;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={active ? 'cyan' : 'lightcyan'} />
    </mesh>
  );
};

const Preloader: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prevActiveDot) => (prevActiveDot + 1) % 5);
    }, 700); // Change the active dot every 200ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 duration-300">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {[...Array(5)].map((_, index) => (
          <Dot key={index} position={[index - 2, 0, 0]} active={activeDot === index} />
        ))}
      </Canvas>
    </div>
  );
};

export default Preloader;

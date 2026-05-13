import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
}

const Model: React.FC<ModelProps> = ({ status }) => {
  const { scene } = useGLTF('/avatar.glb');
  const group = useRef<THREE.Group>(null);

  // Clone the scene to avoid issues with R3F caching if modified directly
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();

      // Gentle idle movement (relative to initial transform in group)
      group.current.rotation.y = Math.sin(t / 4) / 8;
      group.current.position.y = -1 + Math.sin(t / 2) / 10;

      // React to status
      let targetScale = 2;
      if (status === 'speaking') {
        targetScale = 2 + Math.sin(t * 10) * 0.05;
      } else if (status === 'listening') {
        targetScale = 2 + Math.sin(t * 5) * 0.02;
      }

      // Smoothly interpolate scale
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <primitive
      ref={group}
      object={clonedScene}
      scale={2}
      position={[0, -1, 0]}
      rotation={[0, Math.PI / 8, 0]}
    />
  );
};

const Avatar3D: React.FC<ModelProps> = ({ status }) => {
  return (
    <div className="w-full h-full relative min-h-[150px]">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={null}>
          <Model status={status} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default Avatar3D;

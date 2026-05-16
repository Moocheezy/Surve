'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from '@react-three/drei';
import { Scheme, BuildingBlock } from '@/types';

interface MassingCanvasProps {
  scheme: Scheme;
}

const Block = ({ block }: { block: BuildingBlock }) => {
  const color = block.type === 'building' ? '#3b82f6' : block.type === 'parking' ? '#64748b' : '#10b981';

  return (
    <mesh
      position={[block.x, block.y, block.z]}
    >
      <boxGeometry args={[block.width, block.height, block.length]} />
      <meshStandardMaterial color={color} opacity={0.8} transparent />
    </mesh>
  );
};

export default function MassingCanvas({ scheme }: MassingCanvasProps) {
  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[300, 300, 300]} fov={50} />
        <OrbitControls makeDefault target={[0, 0, 0]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

        <Grid
          infiniteGrid
          fadeDistance={100}
          fadeStrength={5}
          cellSize={1}
          sectionSize={10}
          sectionColor="#334155"
          cellColor="#1e293b"
        />

        {/* Site boundary */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[scheme.site.width, scheme.site.length]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Building Blocks */}
        {scheme.blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}

        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={100} blur={2} far={10} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

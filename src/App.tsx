import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HUD } from './components/HUD';
import { Environment } from './components/Environment';
import { Airplane } from './components/Airplane';
import { Rings } from './components/Rings';
import { Scenery } from './components/Scenery';

export default function App() {
  return (
    <main className="w-screen h-screen bg-sky-900 text-white font-sans overflow-hidden">
      <HUD />
      <div className="absolute inset-0">
        <Canvas shadows>
          <Suspense fallback={null}>
            <fog attach="fog" args={['#0c4a6e', 100, 2000]} />
            <Environment />
            <Scenery />
            <Airplane />
            <Rings />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}

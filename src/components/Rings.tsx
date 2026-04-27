import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { useStore } from '../store';
import { planePhysics } from '../physics/AirplanePhysics';

export function Rings() {
  const addScore = useStore(state => state.addScore);
  const gameId = useStore(state => state.gameId);
  
  const rings = useMemo(() => {
    const newRings = [];
    for (let path = 0; path < 25; path++) {
        const startX = MathUtils.randFloatSpread(4000);
        const startY = MathUtils.randFloat(100, 600);
        const startZ = MathUtils.randFloatSpread(4000);
        
        const dirX = MathUtils.randFloatSpread(2);
        const dirY = MathUtils.randFloatSpread(0.5);
        const dirZ = MathUtils.randFloatSpread(2);
        const dir = new Vector3(dirX, dirY, dirZ).normalize();

        const pathLength = MathUtils.randInt(10, 25);
        for (let i = 0; i < pathLength; i++) {
           const offset = i * 60;
           const sX = Math.sin(i * 0.4) * 30;
           const sY = Math.cos(i * 0.4) * 30;
           
           const pos = new Vector3(
               startX + dir.x * offset + sX,
               Math.max(20, startY + dir.y * offset + sY),
               startZ + dir.z * offset
           );
           newRings.push({ position: pos, collected: false });
        }
    }
    return newRings;
  }, [gameId]); // regenerate on new game

  const ringsRef = useRef(rings);
  const [, setTrigger] = useState(0);

  useEffect(() => {
     ringsRef.current = rings;
     setTrigger(t => t + 1);
  }, [rings]);

  useFrame(() => {
    const isGameOver = useStore.getState().isGameOver;
    if (isGameOver) return;

    const pos = planePhysics.position;
    let collectedAny = false;
    
    ringsRef.current.forEach(ring => {
      if (!ring.collected && ring.position.distanceTo(pos) < 30) {
        ring.collected = true;
        addScore(100);
        collectedAny = true;
      }
    });
    
    if (collectedAny) setTrigger(t => t + 1);
  });

  return (
    <group>
      {ringsRef.current.map((ring, i) => (
        !ring.collected && (
           <mesh key={i} position={ring.position}>
             <torusGeometry args={[15, 1.5, 8, 24]} />
             <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.6} />
           </mesh>
        )
      ))}
    </group>
  );
}

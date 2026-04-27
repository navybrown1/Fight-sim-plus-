import { useMemo } from 'react';
import { Vector3, MathUtils } from 'three';

export function Scenery() {
  const clouds = useMemo(() => {
    return Array.from({ length: 400 }).map(() => ({
      position: new Vector3(
        MathUtils.randFloatSpread(6000),
        MathUtils.randFloat(50, 800),
        MathUtils.randFloatSpread(6000)
      ),
      scale: new Vector3(
        MathUtils.randFloat(30, 100),
        MathUtils.randFloat(10, 40),
        MathUtils.randFloat(30, 100)
      )
    }));
  }, []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position} scale={cloud.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

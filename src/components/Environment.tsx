import { Sky, Grid } from '@react-three/drei';

export function Environment() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[100, 50, 100]} intensity={1.5} castShadow />
      
      {/* Endless Grid Floor */}
      <Grid
        position={[0, -0.01, 0]}
        args={[10000, 10000]}
        cellSize={100}
        cellThickness={1}
        cellColor="#6f6f6f"
        sectionSize={1000}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={5000}
        fadeStrength={1}
      />
      {/* Ground plane for physics visual reference when very close */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10000, 10000]} />
        <meshStandardMaterial color="#1a3b1a" />
      </mesh>
    </>
  );
}

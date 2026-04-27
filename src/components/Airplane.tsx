import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, MathUtils } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { planePhysics } from '../physics/AirplanePhysics';
import { useStore } from '../store';

const chaseCamOffset = new Vector3(0, 5, 20);

export function Airplane() {
  const groupRef = useRef<Group>(null);
  const propRef = useRef<Group>(null);
  const keys = useKeyboard();
  const setGameData = useStore((state) => state.setGameData);
  const isGameOver = useStore((state) => state.isGameOver);
  const gameId = useStore((state) => state.gameId);

  const currentCameraPosition = useRef(new Vector3(0, 10, 25));

  useEffect(() => {
    planePhysics.reset();
  }, [gameId]);

  useFrame((state, delta) => {
    let pitch = 0;
    let roll = 0;

    if (!isGameOver) {
      if (keys.current['KeyW'] || keys.current['ArrowDown']) pitch = 1;
      if (keys.current['KeyS'] || keys.current['ArrowUp']) pitch = -1;
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) roll = 1;
      if (keys.current['KeyD'] || keys.current['ArrowRight']) roll = -1;
      planePhysics.boostInput = keys.current['Space'] || keys.current['ShiftLeft'];
      planePhysics.pitchInput = pitch;
      planePhysics.rollInput = roll;
    } else {
      planePhysics.pitchInput = 0.5; // Spiral down
      planePhysics.rollInput = 0.5;
      planePhysics.boostInput = false;
    }

    const dt = Math.min(delta, 0.1);
    planePhysics.update(dt);

    if (groupRef.current) {
      groupRef.current.position.copy(planePhysics.position);
      groupRef.current.quaternion.copy(planePhysics.quaternion);
    }

    if (propRef.current) {
        propRef.current.rotation.z += (planePhysics.velocity.length() * 0.2 + 10) * dt;
    }

    const desiredCamPos = chaseCamOffset.clone().applyQuaternion(planePhysics.quaternion).add(planePhysics.position);
    currentCameraPosition.current.lerp(desiredCamPos, dt * 5.0);
    
    let shakeOffset = new Vector3(0,0,0);
    if (planePhysics.boostInput && planePhysics.boostAmount > 0) {
        shakeOffset.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, 0);
    }
    
    state.camera.position.copy(currentCameraPosition.current).add(shakeOffset);
    
    const lookAtPos = planePhysics.position.clone().add(
      new Vector3(0, 2, -20).applyQuaternion(planePhysics.quaternion)
    );
    state.camera.lookAt(lookAtPos);

    const targetFov = planePhysics.boostInput && planePhysics.boostAmount > 0 ? 90 : 70;
    state.camera.fov = MathUtils.lerp(state.camera.fov, targetFov, dt * 5);
    state.camera.updateProjectionMatrix();

    if (!isGameOver) {
      setGameData({
        speed: planePhysics.velocity.length() * 3.6,
        boost: planePhysics.boostAmount,
      });
    }
  });

  const isBoosting = planePhysics.boostInput && planePhysics.boostAmount > 0;

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.2, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.8, 0.5]}>
        <boxGeometry args={[1.0, 0.6, 1.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.2, 1.5]} />
        <meshStandardMaterial color="#00aaff" />
      </mesh>
      <mesh position={[0, 0.2, 2.0]}>
        <boxGeometry args={[4, 0.1, 1]} />
        <meshStandardMaterial color="#00aaff" />
      </mesh>
      <mesh position={[0, 1, 2.2]}>
        <boxGeometry args={[0.2, 2, 1]} />
        <meshStandardMaterial color="#00aaff" />
      </mesh>
      
      <group position={[0, 0, -2.6]} ref={propRef}>
        <mesh position={[0, 0, -0.2]}>
          <coneGeometry args={[0.4, 0.8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.5, 0.2, 0.1]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Engine Trails */}
      <mesh position={[-2.5, 0, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
         <coneGeometry args={[0.3, 2, 8]} />
         <meshBasicMaterial color="#00ffff" transparent opacity={isBoosting ? 0.6 : 0.0} />
      </mesh>
      <mesh position={[2.5, 0, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
         <coneGeometry args={[0.3, 2, 8]} />
         <meshBasicMaterial color="#00ffff" transparent opacity={isBoosting ? 0.6 : 0.0} />
      </mesh>
    </group>
  );
}

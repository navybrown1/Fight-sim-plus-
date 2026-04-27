import { Vector3, Quaternion } from 'three';

class AirplanePhysics {
  position = new Vector3(0, 100, 0);
  velocity = new Vector3(0, 0, -50);
  quaternion = new Quaternion();
  
  pitchInput = 0;
  rollInput = 0;
  boostInput = false;

  turnSpeed = 2.0;
  baseSpeed = 50;
  boostSpeed = 120;
  
  boostAmount = 100;

  reset() {
    this.position.set(0, 100, 0);
    this.velocity.set(0, 0, -50);
    this.quaternion.identity();
    this.boostAmount = 100;
  }

  update(dt: number) {
    if (this.boostInput && this.boostAmount > 0) {
        this.boostAmount -= 25 * dt;
    } else {
        this.boostAmount += 8 * dt;
        this.boostAmount = Math.min(100, this.boostAmount);
    }
    const isBoosting = this.boostInput && this.boostAmount > 0;

    const rollQ = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), this.rollInput * this.turnSpeed * dt);
    const pitchQ = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), this.pitchInput * this.turnSpeed * dt);
    const yawQ = new Quaternion().setFromAxisAngle(new Vector3(0,1,0), this.rollInput * 0.8 * dt);

    this.quaternion.multiply(pitchQ).multiply(yawQ).multiply(rollQ);
    this.quaternion.normalize();

    const forward = new Vector3(0, 0, -1).applyQuaternion(this.quaternion);
    const targetSpeed = isBoosting ? this.boostSpeed : this.baseSpeed;
    
    this.velocity.lerp(forward.clone().multiplyScalar(targetSpeed), dt * 3.0);
    this.position.add(this.velocity.clone().multiplyScalar(dt));

    if (this.position.y < 2) {
      this.position.y = 2;
      const upQ = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), -3 * dt);
      this.quaternion.multiply(upQ);
      this.quaternion.normalize();
    }
    
    if (this.position.y > 800) {
      this.position.y = 800;
    }
  }
}

export const planePhysics = new AirplanePhysics();

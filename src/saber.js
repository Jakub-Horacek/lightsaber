import * as THREE from "three";

/**
 * @description Animates the blade node(s) to shrink (off) or grow (on) along their longest axis.
 * @param {THREE.Object3D} scene - The root scene of the loaded GLTF.
 * @param {boolean} bladeOn - Whether the blade should be on (grow) or off (shrink).
 * @param {number} [duration=500] - Animation duration in ms.
 */
export function toggleBlade(scene, bladeOn, duration = 500) {
  const bladeNodes = [];
  scene.traverse((child) => {
    if (child.name && child.name.includes("Blade")) {
      bladeNodes.push(child);
    }
  });
  bladeNodes.forEach((blade) => {
    const scale = blade.scale.z;
    let maxVal = scale;
    if (scale > maxVal) {
      maxVal = scale;
    }

    let bladeLength = 1;
    if (blade.geometry && blade.geometry.boundingBox) {
      bladeLength = blade.geometry.boundingBox.max.z - blade.geometry.boundingBox.min.z;
    } else if (blade.geometry) {
      blade.geometry.computeBoundingBox();
      bladeLength = blade.geometry.boundingBox.max.z - blade.geometry.boundingBox.min.z;
    }

    const start = { value: scale };
    const end = { value: bladeOn ? 1 : 0.01 };
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      blade.scale.z = start.value + (end.value - start.value) * t;
      blade.visible = blade.scale.z > 0.01;
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        blade.scale.z = end.value;
        blade.visible = bladeOn;
      }
    }
    requestAnimationFrame(animate);
  });
}

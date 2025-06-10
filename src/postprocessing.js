import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as THREE from "three";
import { scene, camera, renderer } from "./scene.js";

/**
 * @description Default values in case config is not loaded yet
 */
let bloomParams = {
  exposure: 1,
  bloomStrength: 0.5,
  bloomThreshold: 1,
  bloomRadius: 0.75,
};

/**
 * @description Load config/initial-scene-settings.json and update bloomParams
 */
(async () => {
  try {
    const response = await fetch("/initial-scene-settings.json");
    if (response.ok) {
      const config = await response.json();
      bloomParams = {
        exposure: config.bloomExposure ?? 1,
        bloomStrength: config.bloomStrength ?? 0.5,
        bloomThreshold: config.bloomThreshold ?? 1,
        bloomRadius: config.bloomRadius ?? 0.75,
      };

      if (window.bloomPass) {
        window.bloomPass.strength = bloomParams.bloomStrength;
        window.bloomPass.threshold = bloomParams.bloomThreshold;
        window.bloomPass.radius = bloomParams.bloomRadius;
      }
    }
  } catch (e) {
    console.error("Error loading initial scene settings:", e);
  }
})();

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomParams.bloomStrength,
  bloomParams.bloomRadius,
  bloomParams.bloomThreshold
);
window.bloomPass = bloomPass;
composer.addPass(bloomPass);

export { composer, bloomPass, bloomParams, renderPass };

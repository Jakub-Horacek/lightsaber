import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as THREE from "three";
import { scene, camera, renderer } from "./scene.js";

const bloomParams = {
  exposure: 1,
  bloomStrength: 2.2,
  bloomThreshold: 0,
  bloomRadius: 0.25,
};

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomParams.bloomStrength,
  bloomParams.bloomRadius,
  bloomParams.bloomThreshold
);
composer.addPass(bloomPass);

export { composer, bloomPass, bloomParams, renderPass };

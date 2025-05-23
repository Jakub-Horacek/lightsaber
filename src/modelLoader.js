import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { toggleBlade } from "./saber.js";
import { scene } from "./scene.js";

const loader = new GLTFLoader();
let saberScene = null;
let bladeOn = true;

function loadSaberModelAndApplySettings(saberSettings, emissionIntensity) {
  bladeOn = saberSettings.bladeOn;
  loader.load(
    "assets/scene.gltf",
    function (gltf) {
      saberScene = gltf.scene;
      if (saberSettings.model) {
        if (saberSettings.model.position) saberScene.position.set(...saberSettings.model.position);
        if (saberSettings.model.scale) saberScene.scale.set(...saberSettings.model.scale);
        if (saberSettings.model.rotation) saberScene.rotation.set(...saberSettings.model.rotation);
      }
      // Set blade material to MeshStandardMaterial (emissive) for both 'Blade' and 'Blade_LightsaberBlade_Blue_0' if found
      saberScene.traverse((child) => {
        if (child.isMesh && (child.name === "Blade" || child.name === "Blade_LightsaberBlade_Blue_0")) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x00aaff,
            emissiveIntensity: typeof emissionIntensity === "number" ? emissionIntensity * 10 : 8,
            metalness: 0.0,
            roughness: 0.2,
            transparent: false,
            opacity: 1.0,
          });
          child.visible = true;
        }
      });
      // Set emission to match slider value on load (from scene settings)
      if (typeof emissionIntensity === "number") {
        saberScene.traverse((child) => {
          if (child.isMesh && (child.name === "Blade" || child.name === "Blade_LightsaberBlade_Blue_0")) {
            const mat = child.material;
            if (mat && mat.emissive) {
              mat.emissive.setRGB(0.1, 0.1, 1.0);
            }
            if (mat && typeof mat.emissiveIntensity === "number") {
              mat.emissiveIntensity = emissionIntensity * 10;
            }
          }
        });
      }
      toggleBlade(saberScene, bladeOn, 0);
      scene.add(saberScene);
      ensureLayers(saberScene);
      // Expose for controls.js drag
      window.saberScene = saberScene;
      window.scene = scene;
      // TEMP: Log all mesh names in the saber scene
      saberScene.traverse((child) => {
        if (child.isMesh) {
          console.log("Saber mesh:", child.name);
        }
      });
    },
    undefined,
    function (error) {
      console.error("An error happened loading the GLTF model:", error);
    }
  );
}

function ensureLayers(obj) {
  if (obj && !obj.layers) {
    obj.layers = new THREE.Layers();
  }
  if (obj && obj.children) {
    obj.children.forEach(ensureLayers);
  }
}

export { loadSaberModelAndApplySettings, saberScene };

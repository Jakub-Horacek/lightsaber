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
      toggleBlade(saberScene, bladeOn, 0);
      scene.add(saberScene);
      // Expose for controls.js drag
      window.saberScene = saberScene;
      window.scene = scene;
      // Set emission to match slider value on load (from scene settings)
      if (typeof emissionIntensity === "number") {
        saberScene.traverse((child) => {
          if (child.isMesh && child.name && child.name.includes("Blade")) {
            const mat = child.material;
            if (mat) {
              if (mat.emissive) {
                mat.emissive.setRGB(0.1, 0.1, 1.0);
              }
              if (typeof mat.emissiveIntensity === "number") {
                mat.emissiveIntensity = emissionIntensity * 10;
              }
              if (typeof mat.emissiveStrength === "number") {
                mat.emissiveStrength = emissionIntensity * 10;
              }
              if (mat.emissiveFactor) {
                mat.emissiveFactor = [0.1 * emissionIntensity, 0.1 * emissionIntensity, 1.0 * emissionIntensity];
              }
            }
          }
        });
      }
    },
    undefined,
    function (error) {
      console.error("An error happened loading the GLTF model:", error);
    }
  );
}

export { loadSaberModelAndApplySettings, saberScene };

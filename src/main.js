import { scene, camera, renderer } from "./scene.js";
import { composer } from "./postprocessing.js";
import { loadSaberModelAndApplySettings } from "./modelLoader.js";
import { applySceneSettings } from "./settings.js";
import { setupUI } from "./ui.js";
import { setupControls, setZoomDefaults } from "./controls.js";
import { loadInterface } from "./interfaceLoader.js";

/**
 * @description Animate the scene
 */
function animate() {
  requestAnimationFrame(animate);
  const saber = window.saberScene || (window.scene && window.scene.children[0]);
  if (saber) {
    if (window.autorotate) {
      // Cinematic autorotation: slow, smooth, multi-axis
      const time = performance.now() * 0.001;
      saber.rotation.y += 0.004;
      saber.rotation.x += Math.sin(time) * 0.0008;
    }
    // else: manual drag handled in controls.js
  }
  composer.render();
}

/**
 * @description Load the interface and apply the initial settings
 */
window.addEventListener("DOMContentLoaded", async () => {
  await loadInterface();
  Promise.all([
    fetch("/initial-scene-settings.json").then((r) => {
      if (!r.ok) throw new Error("initial-scene-settings.json not found");
      return r.json();
    }),
    fetch("/saber-initial-state.json").then((r) => {
      if (!r.ok) throw new Error("saber-initial-state.json not found");
      return r.json();
    }),
  ])
    .then(([sceneSettings, saberSettings]) => {
      applySceneSettings(sceneSettings);
      setupUI();
      loadSaberModelAndApplySettings(saberSettings, sceneSettings.emissionIntensity);
      setZoomDefaults({
        min: sceneSettings.zoomMin,
        max: sceneSettings.zoomMax,
        speed: sceneSettings.zoomSpeed,
      });
      setupControls();
    })
    .catch((error) => {
      console.error("Failed to load settings:", error);
    });

  animate();
});

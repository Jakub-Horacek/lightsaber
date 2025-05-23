import { scene, camera, renderer } from "./scene.js";
import { composer } from "./postprocessing.js";
import { loadSaberModelAndApplySettings } from "./modelLoader.js";
import { applySceneSettings } from "./settings.js";
import { setupUI } from "./ui.js";
import { setupControls, setZoomDefaults } from "./controls.js";
import { loadInterface } from "./interfaceLoader.js";

function animate() {
  requestAnimationFrame(animate);
  if (scene.children[0]) {
    scene.children[0].rotation.y += 0.01;
  }
  composer.render();
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadInterface();
  Promise.all([
    fetch("/config/initial-scene-settings.json").then((r) => r.json()),
    fetch("/config/saber-initial-state.json").then((r) => r.json()),
  ]).then(([sceneSettings, saberSettings]) => {
    applySceneSettings(sceneSettings);
    setupUI();
    loadSaberModelAndApplySettings(saberSettings, sceneSettings.emissionIntensity);
    setZoomDefaults({
      min: sceneSettings.zoomMin,
      max: sceneSettings.zoomMax,
      speed: sceneSettings.zoomSpeed,
    });
    setupControls();
  });
  animate();
});

import { bloomParams, bloomPass } from "./postprocessing.js";
import { ambientLight, directionalLight, renderer } from "./scene.js";

function applySceneSettings(sceneSettings) {
  bloomParams.exposure = sceneSettings.bloomExposure;
  bloomParams.bloomStrength = sceneSettings.bloomStrength;
  bloomParams.bloomThreshold = sceneSettings.bloomThreshold;
  bloomParams.bloomRadius = sceneSettings.bloomRadius;
  ambientLight.intensity = sceneSettings.ambientLight;
  directionalLight.intensity = sceneSettings.directionalLight;

  // --- Ensure the actual scene and postprocessing match the loaded settings ---
  bloomPass.strength = sceneSettings.bloomStrength;
  bloomPass.threshold = sceneSettings.bloomThreshold;
  bloomPass.radius = sceneSettings.bloomRadius;
  renderer.toneMappingExposure = sceneSettings.bloomExposure;
  // --------------------------------------------------------------------------

  // Helper to set slider and value span
  const setSlider = (id, value) => {
    const slider = document.getElementById(id);
    if (slider) slider.value = value;
    const valueSpan = document.getElementById(id.replace("slider", "value"));
    if (valueSpan) valueSpan.textContent = value;
  };
  setSlider("bloom-strength-slider", sceneSettings.bloomStrength);
  setSlider("bloom-threshold-slider", sceneSettings.bloomThreshold);
  setSlider("bloom-radius-slider", sceneSettings.bloomRadius);
  setSlider("bloom-exposure-slider", sceneSettings.bloomExposure);
  setSlider("ambient-light-slider", sceneSettings.ambientLight);
  setSlider("directional-light-slider", sceneSettings.directionalLight);
  setSlider("emission-intensity-slider", sceneSettings.emissionIntensity);
}

export { applySceneSettings };

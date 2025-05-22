import { bloomPass } from "./postprocessing.js";
import { renderer, ambientLight, directionalLight } from "./scene.js";
import { saberScene } from "./modelLoader.js";
import { toggleBlade } from "./saber.js";

let bladeOn = true;

function setupUI() {
  // Toggle blade switch (new version)
  const toggle = document.getElementById("toggle-switch");
  if (toggle) {
    toggle.checked = bladeOn;
    toggle.addEventListener("change", () => {
      bladeOn = toggle.checked;
      if (saberScene) {
        toggleBlade(saberScene, bladeOn, 400);
      }
    });
  }

  // Emission intensity slider
  const slider = document.getElementById("emission-intensity-slider");
  let sliderValue = document.getElementById("emission-intensity-value");
  if (!sliderValue && slider) {
    sliderValue = document.createElement("span");
    sliderValue.id = "emission-intensity-value";
    sliderValue.style.marginLeft = "8px";
    slider.after(sliderValue);
  }
  if (slider && sliderValue) {
    sliderValue.textContent = slider.value;
    slider.addEventListener("input", () => {
      const val = parseFloat(slider.value);
      sliderValue.textContent = val;
      if (!saberScene) return;
      saberScene.traverse((child) => {
        if (child.isMesh && child.name && child.name.includes("Blade")) {
          const mat = child.material;
          if (mat) {
            if (mat.emissive) {
              mat.emissive.setRGB(0.1, 0.1, 1.0);
            }
            if (typeof mat.emissiveIntensity === "number") {
              mat.emissiveIntensity = val * 10;
            }
            if (typeof mat.emissiveStrength === "number") {
              mat.emissiveStrength = val * 10;
            }
            if (mat.emissiveFactor) {
              mat.emissiveFactor = [0.1 * val, 0.1 * val, 1.0 * val];
            }
          }
        }
      });
    });
  }

  // Bloom controls
  const bloomStrengthSlider = document.getElementById("bloom-strength-slider");
  const bloomStrengthValue = document.getElementById("bloom-strength-value");
  if (bloomStrengthSlider && bloomStrengthValue) {
    bloomStrengthValue.textContent = bloomStrengthSlider.value;
    bloomStrengthSlider.addEventListener("input", () => {
      bloomPass.strength = parseFloat(bloomStrengthSlider.value);
      bloomStrengthValue.textContent = bloomStrengthSlider.value;
    });
  }
  const bloomThresholdSlider = document.getElementById("bloom-threshold-slider");
  const bloomThresholdValue = document.getElementById("bloom-threshold-value");
  if (bloomThresholdSlider && bloomThresholdValue) {
    bloomThresholdValue.textContent = bloomThresholdSlider.value;
    bloomThresholdSlider.addEventListener("input", () => {
      bloomPass.threshold = parseFloat(bloomThresholdSlider.value);
      bloomThresholdValue.textContent = bloomThresholdSlider.value;
    });
  }
  const bloomRadiusSlider = document.getElementById("bloom-radius-slider");
  const bloomRadiusValue = document.getElementById("bloom-radius-value");
  if (bloomRadiusSlider && bloomRadiusValue) {
    bloomRadiusValue.textContent = bloomRadiusSlider.value;
    bloomRadiusSlider.addEventListener("input", () => {
      bloomPass.radius = parseFloat(bloomRadiusSlider.value);
      bloomRadiusValue.textContent = bloomRadiusSlider.value;
    });
  }
  const bloomExposureSlider = document.getElementById("bloom-exposure-slider");
  const bloomExposureValue = document.getElementById("bloom-exposure-value");
  if (bloomExposureSlider && bloomExposureValue) {
    bloomExposureValue.textContent = bloomExposureSlider.value;
    bloomExposureSlider.addEventListener("input", () => {
      renderer.toneMappingExposure = parseFloat(bloomExposureSlider.value);
      bloomExposureValue.textContent = bloomExposureSlider.value;
    });
  }

  // Scene light controls
  const ambientLightSlider = document.getElementById("ambient-light-slider");
  const ambientLightValue = document.getElementById("ambient-light-value");
  if (ambientLightSlider && ambientLightValue) {
    ambientLightValue.textContent = ambientLightSlider.value;
    ambientLightSlider.addEventListener("input", () => {
      ambientLight.intensity = parseFloat(ambientLightSlider.value);
      ambientLightValue.textContent = ambientLightSlider.value;
    });
  }
  const directionalLightSlider = document.getElementById("directional-light-slider");
  const directionalLightValue = document.getElementById("directional-light-value");
  if (directionalLightSlider && directionalLightValue) {
    directionalLightValue.textContent = directionalLightSlider.value;
    directionalLightSlider.addEventListener("input", () => {
      directionalLight.intensity = parseFloat(directionalLightSlider.value);
      directionalLightValue.textContent = directionalLightSlider.value;
    });
  }
}

export { setupUI };

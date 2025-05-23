import * as THREE from "three";
import { bloomPass } from "./postprocessing.js";
import { renderer, ambientLight, directionalLight, scene } from "./scene.js";
import { saberScene } from "./modelLoader.js";
import { toggleBlade } from "./saber.js";

let bladeOn = true;

/**
 * @description Helper to sync a slider and value display, and run a callback on input
 * @param {HTMLInputElement} slider - The slider input element
 * @param {HTMLElement} valueElem - The element to display the value
 * @param {Function} onInput - Callback to run on input (receives the parsed value)
 */
function setupSlider(slider, valueElem, onInput) {
  if (slider && valueElem) {
    valueElem.textContent = slider.value;
    slider.addEventListener("input", () => {
      const val = parseFloat(slider.value);
      valueElem.textContent = slider.value;
      if (onInput) onInput(val);
    });
  }
}

/**
 * @description Setup the UI
 */
function setupUI() {
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

  setupSlider(document.getElementById("bloom-strength-slider"), document.getElementById("bloom-strength-value"), (val) => {
    bloomPass.strength = val;
  });

  setupSlider(document.getElementById("bloom-threshold-slider"), document.getElementById("bloom-threshold-value"), (val) => {
    bloomPass.threshold = val;
  });

  setupSlider(document.getElementById("bloom-radius-slider"), document.getElementById("bloom-radius-value"), (val) => {
    bloomPass.radius = val;
  });

  setupSlider(document.getElementById("bloom-exposure-slider"), document.getElementById("bloom-exposure-value"), (val) => {
    renderer.toneMappingExposure = val;
  });

  setupSlider(document.getElementById("ambient-light-slider"), document.getElementById("ambient-light-value"), (val) => {
    ambientLight.intensity = val;
  });

  setupSlider(document.getElementById("directional-light-slider"), document.getElementById("directional-light-value"), (val) => {
    directionalLight.intensity = val;
  });

  setupSlider(
    document.getElementById("drag-rotation-speed-slider"),
    document.getElementById("drag-rotation-speed-value"),
    () => {} // Only updates value display
  );

  setupSlider(
    document.getElementById("photo-quality-slider"),
    document.getElementById("photo-quality-value"),
    () => {} // Only updates value display
  );

  const bgInput = document.getElementById("photo-bg-color");
  if (bgInput) {
    bgInput.addEventListener("input", () => {
      scene.background = new THREE.Color(bgInput.value);
    });
  }

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
        if (child.isMesh && (child.name === "Blade" || child.name === "Blade_LightsaberBlade_Blue_0")) {
          const mat = child.material;
          if (mat && mat.emissive) {
            mat.emissive.setRGB(0.1, 0.1, 1.0);
          }
          if (mat && typeof mat.emissiveIntensity === "number") {
            mat.emissiveIntensity = val * 10;
          }
        }
      });
    });
  }
}

export { setupUI };

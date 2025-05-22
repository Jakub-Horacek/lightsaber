import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { toggleBlade } from "./saber.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// --- POSTPROCESSING SETUP ---
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomParams = {
  exposure: 1,
  bloomStrength: 2.2,
  bloomThreshold: 0,
  bloomRadius: 0.25,
};
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomParams.bloomStrength,
  bloomParams.bloomRadius,
  bloomParams.bloomThreshold
);
composer.addPass(bloomPass);
// --- END POSTPROCESSING SETUP ---

const loader = new GLTFLoader();
let saberScene = null;
let bladeOn = true;

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
  setSlider("emission-intensity-slider", sceneSettings.emissionIntensity);
  setSlider("bloom-strength-slider", sceneSettings.bloomStrength);
  setSlider("bloom-threshold-slider", sceneSettings.bloomThreshold);
  setSlider("bloom-radius-slider", sceneSettings.bloomRadius);
  setSlider("bloom-exposure-slider", sceneSettings.bloomExposure);
  setSlider("ambient-light-slider", sceneSettings.ambientLight);
  setSlider("directional-light-slider", sceneSettings.directionalLight);
}

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

function animate() {
  requestAnimationFrame(animate);
  if (scene.children[0]) {
    scene.children[0].rotation.y += 0.01;
  }
  composer.render();
}

window.addEventListener("DOMContentLoaded", () => {
  Promise.all([fetch("initial-scene-settings.json").then((r) => r.json()), fetch("assets/saber-initial-state.json").then((r) => r.json())]).then(
    ([sceneSettings, saberSettings]) => {
      applySceneSettings(sceneSettings);
      setupUI();
      loadSaberModelAndApplySettings(saberSettings, sceneSettings.emissionIntensity);
    }
  );
  animate();
});

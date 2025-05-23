import { camera, renderer, scene } from "./scene.js";
import { composer } from "./postprocessing.js";
import * as THREE from "three";

let minZ = 10;
let maxZ = 350;
let zoomSpeed = 25;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let dragRotationSpeed = 0.01;

// Autorotate state
window.autorotate = true;

/**
 * @description Set the default zoom settings
 * @param {Object} params
 * @param {number} params.min
 * @param {number} params.max
 * @param {number} params.speed
 */
function setZoomDefaults({ min, max, speed }) {
  if (typeof min === "number") minZ = min;
  if (typeof max === "number") maxZ = max;
  if (typeof speed === "number") zoomSpeed = speed;
  const minInput = document.getElementById("zoom-min-input");
  const maxInput = document.getElementById("zoom-max-input");
  const speedInput = document.getElementById("zoom-speed-input");
  if (minInput) minInput.value = minZ;
  if (maxInput) maxInput.value = maxZ;
  if (speedInput) speedInput.value = zoomSpeed;
}

/**
 * @description Update the zoom settings
 * @param {Object} params
 * @param {number} params.min
 * @param {number} params.max
 * @param {number} params.speed
 */
function updateZoomSettings() {
  const minInput = document.getElementById("zoom-min-input");
  const maxInput = document.getElementById("zoom-max-input");
  const speedInput = document.getElementById("zoom-speed-input");
  if (minInput) minZ = parseFloat(minInput.value);
  if (maxInput) maxZ = parseFloat(maxInput.value);
  if (speedInput) zoomSpeed = parseFloat(speedInput.value);
}

/**
 * @description Handle wheel event for zooming
 * @param {Object} params
 * @param {Object} params.event
 */
function onWheel(event) {
  event.preventDefault();
  updateZoomSettings(); // Always use latest values
  const delta = Math.sign(event.deltaY) * zoomSpeed;
  camera.position.z = Math.min(maxZ, Math.max(minZ, camera.position.z + delta));
}

/**
 * @description Set the dragging cursor
 * @param {boolean} active
 */
function setDraggingCursor(active) {
  renderer.domElement.style.cursor = active ? "grabbing" : "";
}

/**
 * @description Update the drag settings
 * @param {Object} params
 * @param {Object} params.event
 */
function updateDragSettings() {
  const speedInput = document.getElementById("drag-rotation-speed-slider");
  if (speedInput) dragRotationSpeed = parseFloat(speedInput.value);
}

/**
 * @description Handle pointer down event for dragging
 * @param {Object} params
 * @param {Object} params.event
 */
function onPointerDown(event) {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  setDraggingCursor(true);
  updateDragSettings();
  // Disable autorotate and uncheck the box
  window.autorotate = false;
  const autoCheckbox = document.getElementById("autorotate-checkbox");
  if (autoCheckbox) autoCheckbox.checked = false;
}

/**
 * @description Handle pointer move event for dragging
 * @param {Object} params
 * @param {Object} params.event
 */
function onPointerMove(event) {
  if (!isDragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;

  const saber = window.saberScene || (window.scene && window.scene.children[0]);
  if (saber) {
    saber.rotation.y += dx * dragRotationSpeed;
    saber.rotation.x += dy * dragRotationSpeed;
  }
}

/**
 * @description Handle pointer up event for dragging
 * @param {Object} params
 * @param {Object} params.event
 */
function onPointerUp() {
  isDragging = false;
  setDraggingCursor(false);
}

/**
 * @description Convert data URL to blob
 * @param {string} dataurl
 * @returns {Blob}
 */
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

/**
 * @description Trigger a download of the image
 * @param {string} dataUrl
 * @param {string} filename
 */
function triggerDownload(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * @description Setup the photo mode
 * @param {Object} params
 * @param {Object} params.renderer
 * @param {Object} params.scene
 * @param {Object} params.camera
 */
function setupPhotoMode(renderer, scene, camera) {
  const btn = document.getElementById("photo-take-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const qualitySel = document.getElementById("photo-quality-select");
    let scale = 1.0;
    if (qualitySel) {
      const label = qualitySel.value;
      if (label.includes("8K")) scale = 4.0;
      else if (label.includes("4K")) scale = 2.0;
      else if (label.includes("2K")) scale = 1.5;
      else if (label.includes("FHD")) scale = 1.0;
      else if (label.includes("HD")) scale = 0.5;
    }

    let width = renderer.domElement.width * scale;
    let height = renderer.domElement.height * scale;
    const quality = parseFloat(document.getElementById("photo-quality-slider")?.value || "0.92");
    const bgColor = document.getElementById("photo-bg-color")?.value || "#000000";

    const oldSize = renderer.getSize(new THREE.Vector2());
    const oldBg = scene.background;

    renderer.setSize(width, height, false);
    scene.background = new THREE.Color(bgColor);
    composer.setSize(width, height);
    composer.render();

    const dataUrl = renderer.domElement.toDataURL("image/jpeg", quality);

    let qualityTag = "STANDARD";
    if (qualitySel) {
      const label = qualitySel.value;
      if (label.includes("8K")) qualityTag = "ULTRA";
      else if (label.includes("4K")) qualityTag = "HIGH";
      else if (label.includes("2K")) qualityTag = "MEDIUM";
      else if (label.includes("FHD")) qualityTag = "STANDARD";
      else if (label.includes("HD")) qualityTag = "BASIC";
    }
    const now = new Date();
    const pad = (n, l = 2) => n.toString().padStart(l, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(
      now.getSeconds()
    )}${pad(now.getMilliseconds(), 3)}`;
    const filename = `SABER-RENDER-${qualityTag}-${timestamp}.jpg`;
    triggerDownload(dataUrl, filename);

    renderer.setSize(oldSize.x, oldSize.y, false);
    composer.setSize(oldSize.x, oldSize.y);
    scene.background = oldBg;
  });
}

/**
 * @description Setup the controls
 * @param {Object} params
 * @param {Object} params.renderer
 * @param {Object} params.scene
 * @param {Object} params.camera
 */
function setupControls() {
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
  ["zoom-min-input", "zoom-max-input", "zoom-speed-input"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateZoomSettings);
  });

  updateZoomSettings();

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  const dragSpeedInput = document.getElementById("drag-rotation-speed-slider");
  if (dragSpeedInput) dragSpeedInput.addEventListener("input", updateDragSettings);
  updateDragSettings();

  // Autorotate checkbox event
  const autoCheckbox = document.getElementById("autorotate-checkbox");
  if (autoCheckbox) {
    autoCheckbox.checked = true;
    window.autorotate = true;
    autoCheckbox.addEventListener("change", (e) => {
      window.autorotate = !!e.target.checked;
    });
  }

  setTimeout(() => setupPhotoMode(renderer, scene, camera), 0);
}

export { setupControls, setZoomDefaults };

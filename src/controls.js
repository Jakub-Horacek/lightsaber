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

function updateZoomSettings() {
  const minInput = document.getElementById("zoom-min-input");
  const maxInput = document.getElementById("zoom-max-input");
  const speedInput = document.getElementById("zoom-speed-input");
  if (minInput) minZ = parseFloat(minInput.value);
  if (maxInput) maxZ = parseFloat(maxInput.value);
  if (speedInput) zoomSpeed = parseFloat(speedInput.value);
}

function onWheel(event) {
  event.preventDefault();
  updateZoomSettings(); // Always use latest values
  const delta = Math.sign(event.deltaY) * zoomSpeed;
  camera.position.z = Math.min(maxZ, Math.max(minZ, camera.position.z + delta));
}

function setDraggingCursor(active) {
  renderer.domElement.style.cursor = active ? "grabbing" : "";
}

function updateDragSettings() {
  const speedInput = document.getElementById("drag-rotation-speed-slider");
  if (speedInput) dragRotationSpeed = parseFloat(speedInput.value);
}

function onPointerDown(event) {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  setDraggingCursor(true);
  updateDragSettings();
}

function onPointerMove(event) {
  if (!isDragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;
  // Rotate saber model if present
  const saber = window.saberScene || (window.scene && window.scene.children[0]);
  if (saber) {
    saber.rotation.y += dx * dragRotationSpeed;
    saber.rotation.x += dy * dragRotationSpeed;
  }
}

function onPointerUp() {
  isDragging = false;
  setDraggingCursor(false);
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

function triggerDownload(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setupPhotoMode(renderer, scene, camera) {
  const btn = document.getElementById("photo-take-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    // Get settings
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
    // Always use canvas aspect ratio
    let width = renderer.domElement.width * scale;
    let height = renderer.domElement.height * scale;
    const quality = parseFloat(document.getElementById("photo-quality-slider")?.value || "0.92");
    const bgColor = document.getElementById("photo-bg-color")?.value || "#000000";
    // Save current renderer state
    const oldSize = renderer.getSize(new THREE.Vector2());
    const oldBg = scene.background;
    // Set up for photo
    renderer.setSize(width, height, false);
    scene.background = new THREE.Color(bgColor);
    composer.setSize(width, height);
    composer.render();
    // Get image
    const dataUrl = renderer.domElement.toDataURL("image/jpeg", quality);
    // Generate a unique filename with quality and timestamp
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
    // Restore
    renderer.setSize(oldSize.x, oldSize.y, false);
    composer.setSize(oldSize.x, oldSize.y);
    scene.background = oldBg;
  });
}

function setupControls() {
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
  ["zoom-min-input", "zoom-max-input", "zoom-speed-input"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateZoomSettings);
  });
  updateZoomSettings(); // Initialize from current input values

  // Drag-to-rotate controls
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // Drag speed slider
  const dragSpeedInput = document.getElementById("drag-rotation-speed-slider");
  if (dragSpeedInput) dragSpeedInput.addEventListener("input", updateDragSettings);
  updateDragSettings();

  // Photo mode
  setTimeout(() => setupPhotoMode(renderer, scene, camera), 0);
}

export { setupControls, setZoomDefaults };

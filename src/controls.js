import { camera, renderer } from "./scene.js";

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
}

export { setupControls, setZoomDefaults };

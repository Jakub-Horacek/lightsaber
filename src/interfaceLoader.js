/**
 * Creates a slider control row as a DocumentFragment.
 * @param {Object} options - Options for the slider.
 * @param {string} options.labelText - The label text for the slider.
 * @param {string} options.inputId - The id for the input element.
 * @param {string|number} options.min - The minimum value for the slider.
 * @param {string|number} options.max - The maximum value for the slider.
 * @param {string|number} options.step - The step value for the slider.
 * @param {string|number} options.value - The default value for the slider.
 * @param {string} [options.valueId] - The id for the value display span (optional).
 * @returns {DocumentFragment} The fragment containing the slider row.
 */
function createSlider({ labelText, inputId, min, max, step, value, valueId }) {
  const fragment = document.createDocumentFragment();
  const row = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;
  row.appendChild(label);
  const input = document.createElement("input");
  input.type = "range";
  input.id = inputId;
  input.className = "slider";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  row.appendChild(input);
  if (valueId) {
    const span = document.createElement("span");
    span.id = valueId;
    span.className = "slider-value";
    span.textContent = value;
    row.appendChild(span);
  }
  fragment.appendChild(row);
  return fragment;
}

/**
 * Creates a number input control row as a DocumentFragment.
 * @param {Object} options - Options for the input.
 * @param {string} options.labelText - The label text for the input.
 * @param {string} options.inputId - The id for the input element.
 * @param {string|number} options.min - The minimum value for the input.
 * @param {string|number} options.max - The maximum value for the input.
 * @param {string|number} options.step - The step value for the input.
 * @param {string|number} options.value - The default value for the input.
 * @returns {DocumentFragment} The fragment containing the input row.
 */
function createInput({ labelText, inputId, min, max, step, value }) {
  const fragment = document.createDocumentFragment();
  const row = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;
  row.appendChild(label);
  const input = document.createElement("input");
  input.type = "number";
  input.id = inputId;
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  row.appendChild(input);
  fragment.appendChild(row);
  return fragment;
}

/**
 * Creates the blade controls UI section as a DocumentFragment.
 * @param {Object} settings - The settings object containing default values.
 * @returns {DocumentFragment} The fragment containing the blade controls section.
 */
function createBladeControls(settings) {
  const fragment = document.createDocumentFragment();
  const lightsaberControls = document.createElement("div");
  lightsaberControls.className = "lightsaber-controls";

  const lightsaberHeader = document.createElement("h3");
  lightsaberHeader.textContent = "Lightsaber Controls";
  lightsaberHeader.style.marginBottom = "22px";
  lightsaberControls.appendChild(lightsaberHeader);

  // Blade toggle
  const bladeRow = document.createElement("div");
  bladeRow.style.display = "flex";
  bladeRow.style.alignItems = "center";
  bladeRow.style.gap = "12px";
  bladeRow.style.margin = "24px 0 24px 0";

  const bladeLabel = document.createElement("span");
  bladeLabel.className = "switch-label-text";
  bladeLabel.textContent = "Blade";
  bladeRow.appendChild(bladeLabel);

  const switchContainer = document.createElement("div");
  switchContainer.className = "switch-container";

  const toggleInput = document.createElement("input");
  toggleInput.className = "toggle-checkbox";
  toggleInput.id = "toggle-switch";
  toggleInput.type = "checkbox";
  switchContainer.appendChild(toggleInput);

  const switchLabel = document.createElement("label");
  switchLabel.className = "switch";
  switchLabel.setAttribute("for", "toggle-switch");

  const toggleDiv = document.createElement("div");
  toggleDiv.className = "toggle";
  const ledDiv = document.createElement("div");
  ledDiv.className = "led";
  toggleDiv.appendChild(ledDiv);
  switchLabel.appendChild(toggleDiv);
  switchContainer.appendChild(switchLabel);
  bladeRow.appendChild(switchContainer);

  // Emission Intensity
  const emissionSliderFrag = createSlider({
    labelText: "Emission Intensity:",
    inputId: "emission-intensity-slider",
    min: "0",
    max: "1",
    step: "0.1",
    value: settings.emissionIntensity,
    valueId: "emission-intensity-value",
  });
  lightsaberControls.appendChild(emissionSliderFrag);

  lightsaberControls.appendChild(bladeRow);

  fragment.appendChild(lightsaberControls);
  return fragment;
}

/**
 * Creates the scene controls UI section as a DocumentFragment.
 * @param {Object} settings - The settings object containing default values.
 * @returns {DocumentFragment} The fragment containing the scene controls section.
 */
function createSceneControls(settings) {
  const fragment = document.createDocumentFragment();
  const sceneControls = document.createElement("div");
  sceneControls.className = "scene-controls";
  const sceneHeader = document.createElement("h3");
  sceneHeader.textContent = "Scene Controls";
  sceneControls.appendChild(sceneHeader);

  // Min Zoom (Near)
  sceneControls.appendChild(
    createSlider({
      labelText: "Min Zoom (Near):",
      inputId: "zoom-min-input",
      min: "1",
      max: "350",
      step: "1",
      value: settings.zoomMin,
      valueId: "zoom-min-value",
    })
  );
  // Max Zoom (Far)
  sceneControls.appendChild(
    createSlider({
      labelText: "Max Zoom (Far):",
      inputId: "zoom-max-input",
      min: "10",
      max: "1000",
      step: "1",
      value: settings.zoomMax,
      valueId: "zoom-max-value",
    })
  );
  // Zoom Speed
  sceneControls.appendChild(
    createSlider({
      labelText: "Zoom Speed:",
      inputId: "zoom-speed-input",
      min: "0.1",
      max: "100",
      step: "1",
      value: settings.zoomSpeed,
      valueId: "zoom-speed-value",
    })
  );

  fragment.appendChild(sceneControls);
  return fragment;
}

/**
 * Creates the drag/rotation controls UI section as a DocumentFragment.
 * @param {Object} settings - The settings object containing default values.
 * @returns {DocumentFragment} The fragment containing the drag controls section.
 */
function createDragControls(settings) {
  const fragment = document.createDocumentFragment();
  const dragControls = document.createElement("div");
  dragControls.className = "drag-controls";
  const dragHeader = document.createElement("h3");
  dragHeader.textContent = "Drag & Rotate Controls";
  dragControls.appendChild(dragHeader);

  dragControls.appendChild(
    createSlider({
      labelText: "Drag Rotation Speed:",
      inputId: "drag-rotation-speed-slider",
      min: "0.001",
      max: "0.1",
      step: "0.001",
      value: settings.dragRotationSpeed,
      valueId: "drag-rotation-speed-value",
    })
  );

  fragment.appendChild(dragControls);
  return fragment;
}

/**
 * Creates the photo mode controls UI section as a DocumentFragment.
 * @param {Object} settings - The settings object containing default values.
 * @returns {DocumentFragment} The fragment containing the photo mode controls section.
 */
function createPhotoModeControls(settings) {
  const fragment = document.createDocumentFragment();
  const photoControls = document.createElement("div");
  photoControls.className = "photo-mode-controls";
  const photoHeader = document.createElement("h3");
  photoHeader.textContent = "Photo Mode";
  photoControls.appendChild(photoHeader);

  // Resolution (Quality Label Only)
  const resRow = document.createElement("div");
  const resLabel = document.createElement("label");
  resLabel.setAttribute("for", "photo-quality-select");
  resLabel.textContent = "Photo Quality:";
  resRow.appendChild(resLabel);
  const resSelect = document.createElement("select");
  resSelect.id = "photo-quality-select";
  // Only quality labels, not actual pixel values
  const qualityLabels = ["8K (Ultra)", "4K (High)", "2K (Medium)", "FHD (Standard)", "HD (Basic)"];
  qualityLabels.forEach((label) => {
    const opt = document.createElement("option");
    opt.value = label;
    opt.textContent = label;
    // Optionally, select the current or default
    if (settings.photoMode.qualityLabel === label) {
      opt.selected = true;
    }
    resSelect.appendChild(opt);
  });
  resRow.appendChild(resSelect);
  photoControls.appendChild(resRow);

  // Image Quality
  photoControls.appendChild(
    createSlider({
      labelText: "Image Quality:",
      inputId: "photo-quality-slider",
      min: "0.1",
      max: "1.0",
      step: "0.01",
      value: settings.photoMode.imageQuality,
      valueId: "photo-quality-value",
    })
  );

  // Background color
  const bgRow = document.createElement("div");
  const bgLabel = document.createElement("label");
  bgLabel.setAttribute("for", "photo-bg-color");
  bgLabel.textContent = "Background:";
  bgRow.appendChild(bgLabel);
  const bgInput = document.createElement("input");
  bgInput.type = "color";
  bgInput.id = "photo-bg-color";
  bgInput.value = settings.photoMode.background;
  bgRow.appendChild(bgInput);
  photoControls.appendChild(bgRow);

  // Take Photo Button
  const btnRow = document.createElement("div");
  btnRow.style.justifyContent = "flex-end";
  btnRow.style.display = "flex";
  const photoBtn = document.createElement("button");
  photoBtn.id = "photo-take-btn";
  photoBtn.title = "Take Photo";
  photoBtn.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="4"/><path d="M5 7h2l2-3h6l2 3h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/></svg>';
  photoBtn.style.background = "#181c2a";
  photoBtn.style.border = "1.5px solid #0ff";
  photoBtn.style.borderRadius = "8px";
  photoBtn.style.padding = "8px 16px";
  photoBtn.style.cursor = "pointer";
  btnRow.appendChild(photoBtn);
  photoControls.appendChild(btnRow);

  fragment.appendChild(photoControls);
  return fragment;
}

/**
 * Creates the lighting controls UI section as a DocumentFragment (now includes bloom and light settings).
 * @param {Object} settings - The settings object containing default values.
 * @returns {DocumentFragment} The fragment containing the lighting controls section.
 */
function createLightingControls(settings) {
  const fragment = document.createDocumentFragment();
  const lightingControls = document.createElement("div");
  lightingControls.className = "lighting-controls";
  const lightingHeader = document.createElement("h3");
  lightingHeader.textContent = "Lighting & Bloom Controls";
  lightingControls.appendChild(lightingHeader);

  lightingControls.appendChild(
    createSlider({
      labelText: "Bloom Strength:",
      inputId: "bloom-strength-slider",
      min: "0",
      max: "5",
      step: "0.1",
      value: settings.bloomStrength,
      valueId: "bloom-strength-value",
    })
  );
  lightingControls.appendChild(
    createSlider({
      labelText: "Bloom Threshold:",
      inputId: "bloom-threshold-slider",
      min: "0",
      max: "1",
      step: "0.01",
      value: settings.bloomThreshold,
      valueId: "bloom-threshold-value",
    })
  );
  lightingControls.appendChild(
    createSlider({
      labelText: "Bloom Radius:",
      inputId: "bloom-radius-slider",
      min: "0",
      max: "1",
      step: "0.01",
      value: settings.bloomRadius,
      valueId: "bloom-radius-value",
    })
  );
  lightingControls.appendChild(
    createSlider({
      labelText: "Bloom Exposure:",
      inputId: "bloom-exposure-slider",
      min: "0",
      max: "2",
      step: "0.01",
      value: settings.bloomExposure,
      valueId: "bloom-exposure-value",
    })
  );
  lightingControls.appendChild(
    createSlider({
      labelText: "Ambient Light Intensity:",
      inputId: "ambient-light-slider",
      min: "0",
      max: "10",
      step: "0.01",
      value: settings.ambientLight,
      valueId: "ambient-light-value",
    })
  );
  lightingControls.appendChild(
    createSlider({
      labelText: "Directional Light Intensity:",
      inputId: "directional-light-slider",
      min: "0",
      max: "10",
      step: "0.01",
      value: settings.directionalLight,
      valueId: "directional-light-value",
    })
  );

  fragment.appendChild(lightingControls);
  return fragment;
}

/**
 * Loads the full interface by assembling all control sections and appending them to the DOM.
 * Fetches settings from the JSON config and builds the UI using category functions.
 * @returns {Promise<void>} Resolves when the interface is loaded.
 */
async function loadInterface() {
  const response = await fetch("/config/initial-scene-settings.json");
  const settings = await response.json();
  // Patch photoMode.resolution if set to window size placeholders
  if (
    Array.isArray(settings.photoMode?.resolution) &&
    settings.photoMode.resolution[0] === "window.innerWidth" &&
    settings.photoMode.resolution[1] === "window.innerHeight"
  ) {
    settings.photoMode.resolution = [window.innerWidth, window.innerHeight];
  }

  // Use a fragment for efficient DOM insertion
  const fragment = document.createDocumentFragment();

  // Create controls container
  const controls = document.createElement("div");
  controls.className = "controls";

  controls.appendChild(createBladeControls(settings));
  controls.appendChild(createSceneControls(settings));
  controls.appendChild(createDragControls(settings));
  controls.appendChild(createPhotoModeControls(settings));
  controls.appendChild(createLightingControls(settings));

  fragment.appendChild(controls);
  document.body.appendChild(fragment);
}

export { loadInterface };

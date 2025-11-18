// Renderer process logic
let fonts = [];
let registeredFonts = [];

// DOM elements
let syncButton;
let closeButton;
let fontList;
let emptyState;
let progressContainer;
let progressFill;
let progressText;

/**
 * Initialize the application on DOM load
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Cloud Font Agent initialized");

  // Get DOM element references
  syncButton = document.getElementById("syncButton");
  closeButton = document.getElementById("closeButton");
  fontList = document.getElementById("fontList");
  emptyState = document.getElementById("emptyState");
  progressContainer = document.getElementById("progressContainer");
  progressFill = document.getElementById("progressFill");
  progressText = document.getElementById("progressText");

  // Set up event listeners
  syncButton.addEventListener("click", handleSyncClick);
  closeButton.addEventListener("click", handleCloseClick);

  // Register sync progress listener
  window.fontAPI.onSyncProgress(handleSyncProgress);

  // Load initial font data
  await loadFonts();
});

/**
 * Load fonts from API and registered fonts from local state
 * Requirement 1.2: Display font list in widget window
 */
async function loadFonts() {
  try {
    // Show loading state
    emptyState.style.display = "block";
    emptyState.innerHTML = "<p>폰트를 불러오는 중...</p>";
    fontList.innerHTML = "";

    // Fetch purchased fonts from API
    fonts = await window.fontAPI.fetchFonts();

    // Get currently registered fonts
    registeredFonts = await window.fontAPI.getRegisteredFonts();

    // Render the font list
    renderFontList();
  } catch (error) {
    console.error("Failed to load fonts:", error);
    emptyState.style.display = "block";
    emptyState.innerHTML = `<p style="color: #ff3b30;">폰트 목록을 불러오는데 실패했습니다.<br>${error.message}</p>`;
  }
}

/**
 * Render the font list with sync status
 * Requirement 1.3: Display font name and sync status
 * Requirement 3.3: Display sync status for each font
 */
function renderFontList() {
  // Clear existing list
  fontList.innerHTML = "";

  // Hide empty state if we have fonts
  if (fonts.length === 0) {
    emptyState.style.display = "block";
    emptyState.innerHTML = "<p>구매한 폰트가 없습니다.</p>";
    return;
  }

  emptyState.style.display = "none";

  // Render each font
  fonts.forEach((font) => {
    // Check if this font is registered
    const isRegistered = registeredFonts.some((rf) => rf.name === font.name);

    // Create list item
    const li = document.createElement("li");
    li.className = "font-item";

    // Format file size
    const fileSizeMB = (font.fileSize / 1024 / 1024).toFixed(2);

    li.innerHTML = `
      <div class="font-info">
        <div class="font-name">${escapeHtml(font.name)}</div>
        <div class="font-status ${isRegistered ? "synced" : ""}">
          ${isRegistered ? "동기화됨" : "동기화 필요"}
        </div>
      </div>
      <div class="font-size">
        ${fileSizeMB} MB
      </div>
    `;

    fontList.appendChild(li);
  });
}

/**
 * Handle sync button click
 * Requirement 2.4: Start sync when button is clicked
 */
async function handleSyncClick() {
  // Disable button during sync
  syncButton.disabled = true;
  syncButton.textContent = "동기화 중...";

  // Show progress container
  progressContainer.style.display = "block";
  progressFill.style.width = "0%";
  progressText.textContent = "동기화를 시작합니다...";

  try {
    // Start synchronization
    const result = await window.fontAPI.syncFonts();

    // Show completion message
    if (result.failed === 0) {
      progressText.textContent = `✓ 모든 폰트 동기화 완료 (${result.success}개)`;
      progressFill.style.width = "100%";
    } else {
      progressText.textContent = `동기화 완료: 성공 ${result.success}개, 실패 ${result.failed}개`;
      progressFill.style.width = "100%";
      progressFill.style.backgroundColor = "#ff9500";

      // Show error details if any
      if (result.errors.length > 0) {
        console.error("Sync errors:", result.errors);
        const errorMsg = result.errors
          .map((e) => `${e.fontName}: ${e.error}`)
          .join("\n");
        alert(`일부 폰트 동기화 실패:\n\n${errorMsg}`);
      }
    }

    // Reload font list to update sync status
    await loadFonts();

    // Hide progress after delay
    setTimeout(() => {
      progressContainer.style.display = "none";
      progressFill.style.backgroundColor = "";
    }, 2000);
  } catch (error) {
    console.error("Sync failed:", error);
    progressText.textContent = `✗ 동기화 실패: ${error.message}`;
    progressFill.style.backgroundColor = "#ff3b30";

    alert(`동기화 실패:\n${error.message}`);

    // Hide progress after delay
    setTimeout(() => {
      progressContainer.style.display = "none";
      progressFill.style.backgroundColor = "";
    }, 3000);
  } finally {
    // Re-enable button
    syncButton.disabled = false;
    syncButton.textContent = "동기화";
  }
}

/**
 * Handle sync progress updates
 * Requirement 2.5: Display sync progress to user
 */
function handleSyncProgress(progress) {
  // Update progress bar
  progressFill.style.width = progress.percentage + "%";

  // Update progress text
  progressText.textContent = `${progress.current} (${progress.completed}/${progress.total})`;

  console.log(`Sync progress: ${progress.percentage}% - ${progress.current}`);
}

/**
 * Handle close button click
 * Hides the window instead of quitting the app
 */
function handleCloseClick() {
  window.close();
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

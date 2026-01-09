// Login page logic
// Requirements: 9.1, 9.2, 9.3, 9.4, 10.2, 10.4

// DOM elements
let loginForm;
let emailInput;
let passwordInput;
let loginButton;
let errorMessage;
let closeButton;
let minimizeButton;
let maximizeButton;
let signUpLink;
let findIdLink;

/**
 * Initialize the login page on DOM load
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Login page initialized");

  // Get DOM element references
  loginForm = document.getElementById("loginForm");
  emailInput = document.getElementById("emailInput");
  passwordInput = document.getElementById("passwordInput");
  loginButton = document.getElementById("loginButton");
  errorMessage = document.getElementById("errorMessage");
  closeButton = document.getElementById("closeButton");
  minimizeButton = document.getElementById("minimizeButton");
  maximizeButton = document.getElementById("maximizeButton");
  signUpLink = document.getElementById("signUpLink");
  findIdLink = document.getElementById("findIdLink");

  // Set up event listeners
  loginForm.addEventListener("submit", handleLoginSubmit);
  emailInput.addEventListener("input", handleInputChange);
  passwordInput.addEventListener("input", handleInputChange);
  closeButton.addEventListener("click", handleCloseClick);
  minimizeButton.addEventListener("click", handleMinimizeClick);
  maximizeButton.addEventListener("click", handleMaximizeClick);
  signUpLink.addEventListener("click", handleSignUpClick);
  findIdLink.addEventListener("click", handleFindIdClick);

  // Initial validation state
  updateLoginButtonState();
});

/**
 * Validate email format
 * Requirement 10.4: Validate email format before submitting
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handle input change events
 * Requirement 10.4: Enable login button when email format is valid and password is non-empty
 */
function handleInputChange() {
  // Clear error message when user types
  hideError();

  // Update button state
  updateLoginButtonState();
}

/**
 * Update login button enabled/disabled state
 * Requirement 10.4: Login form should only enable submit button when email format is valid and password is non-empty
 */
function updateLoginButtonState() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Enable button only if email is valid and password is not empty
  const isValid = isValidEmail(email) && password.length > 0;
  loginButton.disabled = !isValid;
}

/**
 * Show error message
 * Requirement 10.2: Display error message when login fails
 *
 * @param {string} message - Error message to display
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.classList.add("hidden");
  errorMessage.textContent = "";
}

/**
 * Set loading state
 * Requirement 10.3: Disable login button and show loading indicator during authentication
 *
 * @param {boolean} loading - Whether loading state is active
 */
function setLoading(loading) {
  if (loading) {
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner"></span>';
    emailInput.disabled = true;
    passwordInput.disabled = true;
  } else {
    loginButton.innerHTML = "로그인";
    emailInput.disabled = false;
    passwordInput.disabled = false;
    updateLoginButtonState();
  }
}

/**
 * Handle login form submission
 * Requirement 9.3: Submit credentials when login button is clicked
 * Requirement 10.1: Authenticate user and navigate to main font list
 * Requirement 10.2: Display error message on invalid credentials
 *
 * @param {Event} event - Form submit event
 */
async function handleLoginSubmit(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validate inputs
  if (!isValidEmail(email)) {
    showError("올바른 이메일 형식을 입력해주세요.");
    return;
  }

  if (password.length === 0) {
    showError("비밀번호를 입력해주세요.");
    return;
  }

  // Clear any previous errors
  hideError();

  // Set loading state
  setLoading(true);

  try {
    // Call authentication API (will be implemented in next sub-task)
    const result = await window.authAPI.login(email, password);

    if (result.success) {
      // Authentication successful - navigate to main app
      console.log("Login successful");
      // The main process will handle navigation to index.html
    } else {
      // Authentication failed
      showError(result.error || "로그인에 실패했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    setLoading(false);
  }
}

/**
 * Handle close button click
 */
function handleCloseClick() {
  window.close();
}

/**
 * Handle minimize button click
 */
function handleMinimizeClick() {
  // Will be implemented when window controls are wired up
  console.log("Minimize clicked");
}

/**
 * Handle maximize button click
 */
function handleMaximizeClick() {
  // Will be implemented when window controls are wired up
  console.log("Maximize clicked");
}

/**
 * Handle sign up link click
 * Requirement 9.4: Provide link for sign up
 *
 * @param {Event} event - Click event
 */
function handleSignUpClick(event) {
  event.preventDefault();
  console.log("Sign up clicked");
  // TODO: Open sign up page or external URL
  alert("회원가입 기능은 준비 중입니다.");
}

/**
 * Handle find ID link click
 * Requirement 9.4: Provide link for find ID
 *
 * @param {Event} event - Click event
 */
function handleFindIdClick(event) {
  event.preventDefault();
  console.log("Find ID clicked");
  // TODO: Open find ID page or external URL
  alert("아이디 찾기 기능은 준비 중입니다.");
}

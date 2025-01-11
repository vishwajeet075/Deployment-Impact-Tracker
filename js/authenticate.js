// Form Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// Navigation Elements
const switchToSignupLinks = document.querySelectorAll('.switch-to-signup');
const switchToLoginLinks = document.querySelectorAll('.switch-to-login');
const forgotPasswordLinks = document.querySelectorAll('.forgot-password-link');

// Google Auth Configuration
const googleConfig = {
    clientId: process.env.client_id, // Replace with your Google Client ID
    scope: 'email profile'
};

// Form Navigation
function showForm(formToShow) {
    // Hide all forms first
    [loginForm, signupForm, forgotPasswordForm].forEach(form => {
        form.classList.add('hidden');
    });
    
    // Show the requested form
    formToShow.classList.remove('hidden');
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}

// Password Visibility Toggle
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
}

// Form Submission Handlers
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (!validateEmail(email)) {
        showError('login-email', 'Please enter a valid email address');
        return;
    }

    try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMe }),
        });

        if (response.ok) {
            window.location.href = '/dashboard'; // Redirect to dashboard on success
        } else {
            const data = await response.json();
            showError('login-form', data.message || 'Login failed');
        }
    } catch (error) {
        showError('login-form', 'An error occurred. Please try again later.');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!validateEmail(email)) {
        showError('signup-email', 'Please enter a valid email address');
        return;
    }

    if (!validatePassword(password)) {
        showError('signup-password', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
        return;
    }

    if (password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
        return;
    }

    try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            window.location.href = '/dashboard'; // Redirect to dashboard on success
        } else {
            const data = await response.json();
            showError('signup-form', data.message || 'Signup failed');
        }
    } catch (error) {
        showError('signup-form', 'An error occurred. Please try again later.');
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('reset-email').value;

    if (!validateEmail(email)) {
        showError('reset-email', 'Please enter a valid email address');
        return;
    }

    try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            showSuccess('forgot-password-form', 'Password reset instructions have been sent to your email');
        } else {
            const data = await response.json();
            showError('forgot-password-form', data.message || 'Password reset request failed');
        }
    } catch (error) {
        showError('forgot-password-form', 'An error occurred. Please try again later.');
    }
}

// Google Sign In
async function initializeGoogleAuth() {
    try {
        await google.accounts.id.initialize({
            client_id: googleConfig.clientId,
            callback: handleGoogleSignIn
        });
        
        const googleButtons = document.querySelectorAll('.google-btn');
        googleButtons.forEach(button => {
            google.accounts.id.renderButton(button, {
                theme: 'outline',
                size: 'large',
                width: button.offsetWidth
            });
        });
    } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
    }
}

async function handleGoogleSignIn(response) {
    try {
        // Replace with your actual API endpoint
        const result = await fetch('/api/google-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: response.credential }),
        });

        if (result.ok) {
            window.location.href = '/dashboard';
        } else {
            showError('login-form', 'Google sign-in failed');
        }
    } catch (error) {
        showError('login-form', 'An error occurred during Google sign-in');
    }
}

// Error and Success Handlers
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error messages
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    element.parentElement.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000); // Remove error after 5 seconds
}

function showSuccess(formId, message) {
    const form = document.getElementById(formId);
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    form.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000); // Remove message after 5 seconds
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Setup form navigation
    switchToSignupLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(signupForm);
        });
    });

    switchToLoginLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(loginForm);
        });
    });

    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(forgotPasswordForm);
        });
    });

    // Setup form submissions
    loginForm.querySelector('form').addEventListener('submit', handleLogin);
    signupForm.querySelector('form').addEventListener('submit', handleSignup);
    forgotPasswordForm.querySelector('form').addEventListener('submit', handleForgotPassword);

    // Setup password toggles
    setupPasswordToggles();

    // Initialize Google Sign-In
    initializeGoogleAuth();
});
// Form Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// Navigation Elements
const switchToSignupLinks = document.querySelectorAll('.switch-to-signup');
const switchToLoginLinks = document.querySelectorAll('.switch-to-login');
const forgotPasswordLinks = document.querySelectorAll('.forgot-password-link');


// Form Navigation
function showForm(formToShow) {
    // Hide all forms first
    [loginForm, signupForm, forgotPasswordForm].forEach(form => {
        form.classList.add('hidden');
    });
    
    // Show the requested form
    formToShow.classList.remove('hidden');
}


function validatePassword(password) {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}

// Utility Function: Validate Email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

async function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate email
    if (!validateEmail(email)) {
        showError('login-email', 'Please enter a valid email address');
        return;
    }
    
    // Create login data object
    const loginData = {
        email: email,
        password: password,
        rememberMe: rememberMe
    };
    
    try {
        const response = await fetch('http://localhost:8080/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(loginData)
        });
        
        console.log('Response status:', response.status);
        
        // Get response text
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        // Parse JSON response
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Parsed response:', data);
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Invalid JSON response from server');
        }
        
        if (response.ok && data.success) {
            // Store user information in cookies
            document.cookie = `user_id=${encodeURIComponent(data.user.id)}; path=/; SameSite=Strict`;
            document.cookie = `email=${encodeURIComponent(data.user.email)}; path=/; SameSite=Strict`;
            
            if (rememberMe) {
                document.cookie = `remember_me=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
            }
            
            // Redirect to homepage/dashboard
            window.location.href = '../index.html';
        } else {
            const errorMessage = data.message || 'Login failed';
            showError('login-form', errorMessage);
        }
    } catch (error) {
        console.error('Login error:', error);
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
        const response = await fetch('http://localhost:8080/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            showForm(loginForm);
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






// Function to show error messages
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
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
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

  
});
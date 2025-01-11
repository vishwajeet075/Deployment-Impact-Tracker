document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const contactForm = document.getElementById('contactForm');
    const formControls = document.querySelectorAll('.form-control');
    const submitButton = contactForm.querySelector('button[type="submit"]'); // Define submit button once
    const originalButtonText = submitButton.textContent; // Store original text

    // Add floating label behavior
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.classList.add('active');
        });

        control.addEventListener('blur', function() {
            if (this.value === '') {
                this.classList.remove('active');
            }
        });

        if (control.value !== '') {
            control.classList.add('active');
        }
    });

    // Form submission handling
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Basic form validation
        let isValid = true;
        formControls.forEach(control => {
            if (!control.value.trim()) {
                isValid = false;
                showError(control, 'This field is required');
            } else {
                removeError(control);
            }

            // Email validation
            if (control.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(control.value)) {
                    isValid = false;
                    showError(control, 'Please enter a valid email address');
                }
            }
        });

        if (isValid) {
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                // Collect form data
                const formData = new FormData();
                formData.append('name', document.getElementById('name').value);
                formData.append('email', document.getElementById('email').value);
                formData.append('subject', document.getElementById('subject').value);
                formData.append('message', document.getElementById('message').value);

                // Send data to the server
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to send message');
                }

                // Show success message
                showSuccessMessage(result.message || 'Thank you for your message! We\'ll get back to you soon.');
                
                // Reset form
                contactForm.reset();
                formControls.forEach(control => control.classList.remove('active'));

            } catch (error) {
                // Show error message
                showError(document.getElementById('name'), error.message);
                
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});

function showError(element, message) {
    const formGroup = element.parentElement;
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    
    element.classList.add('error');
}

function removeError(element) {
    const formGroup = element.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        formGroup.removeChild(errorDiv);
    }
    element.classList.remove('error');
}

function showSuccessMessage(message) {
    // Remove any existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message fade-in';
    successMessage.textContent = message;
    
    // Insert message after form
    const formContainer = document.querySelector('.form-container');
    formContainer.appendChild(successMessage);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.classList.add('fade-out');
        setTimeout(() => {
            if (successMessage.parentNode) {
                formContainer.removeChild(successMessage);
            }
        }, 500);
    }, 5000);
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
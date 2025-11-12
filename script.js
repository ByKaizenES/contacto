// Character counter for message textarea
document.addEventListener('DOMContentLoaded', function() {
    // Generate timestamp for security
    const timestamp = Date.now();
    const formTimestamp = document.getElementById('formTimestamp');
    if (formTimestamp) {
        formTimestamp.value = timestamp;
    }
    
    // Disable right-click on form to prevent inspection
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Character counter
    const messageTextarea = document.getElementById('message');
    const charCounter = document.querySelector('.char-counter');
    
    if (messageTextarea && charCounter) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = this.getAttribute('maxlength');
            charCounter.textContent = `${currentLength} / ${maxLength} caracteres`;
            
            // Change color when approaching limit
            if (currentLength > maxLength * 0.9) {
                charCounter.style.color = '#ef4444'; // red
            } else if (currentLength > maxLength * 0.7) {
                charCounter.style.color = '#f59e0b'; // orange
            } else {
                charCounter.style.color = '#6b7280'; // gray
            }
        });
    }
    
    // Input sanitization
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Remove potential XSS attempts
            this.value = sanitizeInput(this.value);
        });
    });
});

// Sanitize input to prevent XSS
function sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
}

// Check for suspicious patterns
function containsSuspiciousContent(text) {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /eval\(/i,
        /document\./i,
        /window\./i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(text));
}

// Form validation and submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const privacyChecked = document.getElementById('privacy').checked;
        
        // Check privacy checkbox
        if (!privacyChecked) {
            e.preventDefault();
            alert('Debes aceptar la Política de Privacidad para continuar.');
            return false;
        }
        
        // Show loading state
        const submitButton = document.getElementById('submitBtn');
        submitButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Enviando...';
        submitButton.disabled = true;
        
        // Let the form submit naturally to FormSubmit
        return true;
    });
}

// Function to reset the form
function resetForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    contactForm.reset();
    contactForm.style.display = 'flex';
    successMessage.style.display = 'none';
    
    // Reset character counter
    const charCounter = document.querySelector('.char-counter');
    if (charCounter) {
        charCounter.textContent = '0 / 2000 caracteres';
        charCounter.style.color = '#6b7280';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add spin animation for loading state
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll('.info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Contact form enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const alertContainer = document.getElementById('alert-container');
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                mobile: formData.get('mobile'),
                message: formData.get('message')
            };
            
            // Send to Vercel API
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(result => {
                if (result.message === 'Email sent successfully') {
                    // Show success message
                    alertContainer.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <i class="fas fa-check-circle me-2"></i>Thank you for your message! We will get back to you within 24 hours.
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `;
                    
                    // Reset form
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                } else {
                    throw new Error(result.message);
                }
            })
            .catch(error => {
                // Show specific error message
                const errorMessage = error.message || 'There was an error sending your message. Please try again.';
                alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>${errorMessage}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
                submitBtn.disabled = false;
                
                // Scroll to alert
                alertContainer.scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                if (input.checkValidity()) {
                    input.classList.add('is-valid');
                    input.classList.remove('is-invalid');
                } else {
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                }
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid') && input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links
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
    
    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
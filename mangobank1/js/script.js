/**
 * MangoBank - Main JavaScript
 * General functionality for the MangoBank website
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initForms();
    initScrollEffects();
    setCurrentYear();
    checkLoginStatus();
});

/**
 * Set the current year in the footer copyright
 */
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize responsive navigation
 */
function initNavigation() {
    // Mobile menu toggle (to be implemented when adding mobile menu)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Add active class to current nav item based on URL
    const currentUrl = window.location.href;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (currentUrl.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize all forms with validation and submission handling
 */
function initForms() {
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = contactForm.querySelector('#name').value;
            const email = contactForm.querySelector('#email').value;
            const message = contactForm.querySelector('#message').value;
            
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

/**
 * Add scroll effects for better UX
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    window.scrollTo({
                        top: target.offsetTop - navbarHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.feature-card, .about-content, .contact-container');
    if (revealElements.length > 0) {
        window.addEventListener('scroll', function() {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('revealed');
                }
            });
        });
        
        // Trigger initial reveal
        window.dispatchEvent(new Event('scroll'));
    }
}

/**
 * Check if user is logged in and update UI accordingly
 * Using sessionStorage for demo purposes only - in a real application, 
 * this would use proper authentication
 */
function checkLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const authButtons = document.querySelector('.auth-buttons');

    if (user) {
        authButtons.innerHTML = `
            <a href="${user.isAdmin ? 'admin-dashboard.html' : 'dashboard.html'}" class="btn btn-outline">Dashboard</a>
            <a href="#" id="logout-btn" class="btn btn-primary">Logout</a>
        `;
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
}

/**
 * Log out the user (demo only using localStorage)
 */
function logoutUser() {
    localStorage.removeItem('mangobank_logged_in');
    localStorage.removeItem('mangobank_user_id');
    localStorage.removeItem('mangobank_user_data');
    
    showNotification('You have been logged out successfully', 'success');
    
    // Redirect to home page after logout
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

/**
 * Display notification messages to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add notification styles dynamically if not already in CSS
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.innerHTML = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .notification {
                background: white;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                padding: 15px 20px;
                min-width: 280px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                animation: slideIn 0.3s ease forwards;
                border-left: 4px solid #333;
            }
            
            .notification.success {
                border-left-color: #28a745;
            }
            
            .notification.error {
                border-left-color: #dc3545;
            }
            
            .notification.info {
                border-left-color: #17a2b8;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #6c757d;
            }
            
            .notification.hiding {
                animation: slideOut 0.3s ease forwards;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Call the style function on load
addNotificationStyles();

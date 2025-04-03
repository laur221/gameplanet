/**
 * MangoBank - Login Page JavaScript
 * Handles user login functionality
 */

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});

/**
 * Handle the login form submission
 * @param {Event} event - Form submission event
 */
function handleLogin(event) {
    if (event) {
        event.preventDefault(); // Prevent form submission
    }
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    // Basic validation
    if (!email || !password) {
        showError("Please enter both email and password");
        return false;
    }
    
    // Save login status
    sessionStorage.setItem("loggedInUser", email);
    sessionStorage.setItem("isLoggedIn", "true");
    
    // Redirect to dashboard
    window.location.href = "dashboard.html";
    
    return false; // Prevent default form action as backup
}

/**
 * Show an error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Create or get notification container
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Setup close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

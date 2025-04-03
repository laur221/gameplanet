/**
 * MangoBank - Authentication JavaScript
 * Handles login and registration functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
});

/**
 * Authentication utility functions for MangoBank
 */

// Check if user is logged in
function isAuthenticated() {
    return sessionStorage.getItem("isLoggedIn") === "true" && 
           sessionStorage.getItem("loggedInUser") !== null;
}

// Login function
function login(username, password) {
    // In a real app, you would validate against a server here
    
    // Store authentication state
    sessionStorage.setItem("loggedInUser", username);
    sessionStorage.setItem("isLoggedIn", "true");
    
    // Return success
    return true;
}

// Logout function
function logout() {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("isLoggedIn");
    
    // Redirect to login page
    window.location.href = "login.html";
}

// Protect pages that require authentication
function protectPage() {
    if (!isAuthenticated()) {
        alert("Please login to access this page");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// For non-login pages, check authentication
if (!window.location.href.includes("login.html") && 
    !window.location.href.includes("register.html") &&
    !window.location.href.includes("index.html")) {
    document.addEventListener("DOMContentLoaded", function() {
        protectPage();
    });
}

function initAuthForms() {
    // Login form handling is moved to login.js
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;

            if (fullName && email) {
                sessionStorage.setItem('user', JSON.stringify({ email, isAdmin: false }));
                window.location.href = 'dashboard.html'; // Redirecționează către dashboard-ul utilizatorului
            } else {
                // Afișează un mesaj de eroare dacă datele sunt incomplete
                alert('Please fill in all required fields.');
            }
        });
    }
}

function showNotification(message, type) {
    alert(message); // Simple implementation that could be enhanced
}

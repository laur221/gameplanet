/**
 * MangoBank - Admin JavaScript
 * Handles admin dashboard functionality
 */

let allUsers = [];
let allTransactions = [];
let adminUser = null;
let systemSettings = {
    bankName: 'MangoBank',
    defaultBalance: 8250.00,
    allowRegistrations: true,
    maxTransferAmount: 10000.00,
    maintenanceMode: false
};

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is admin
    checkAdminAuth();

    // Initialize section navigation
    initSectionNavigation();

    // Initialize admin actions
    initAdminActions();

    // Add logout functionality
    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
});

/**
 * Check if the current user is an admin
 */
function checkAdminAuth() {
    // Check session storage for admin session
    const sessionAdmin = sessionStorage.getItem('admin_session');
    if (sessionAdmin) {
        try {
            // Use session storage data
            adminUser = JSON.parse(sessionAdmin);
            console.log('Using session storage admin data');
            initAdminDashboard();
            return;
        } catch (e) {
            console.error('Error parsing session data:', e);
        }
    }
    // else { window.location.href = 'login.html'; }
}

/**
 * Initialize the admin dashboard with data
 */
function initAdminDashboard() {
    updateUserInfo();
    // ...existing code...
}

/**
 * Update the admin user info in the sidebar
 */
function updateUserInfo() {
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');

    if (userNameElement && adminUser) {
        userNameElement.textContent = adminUser.fullName;
    }

    if (userEmailElement && adminUser) {
        userEmailElement.textContent = adminUser.email;
    }
}

/**
 * Initialize section navigation
 */
function initSectionNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.admin-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Ignore if it's the logout link
            if (this.id === 'logout-btn') return;

            e.preventDefault();

            // Get the target section ID from the href
            const targetId = this.getAttribute('href');

            // Remove active class from all links and add to the clicked one
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Hide all sections and show the target one
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetId.substring(1)) {
                    section.classList.add('active-section');
                }
            });
        });
    });
}

/**
 * Initialize admin actions
 */
function initAdminActions() {
    // Create user button
    const createUserBtn = document.getElementById('create-user-btn');
    if (createUserBtn) {
        createUserBtn.addEventListener('click', createNewUser);
    }

    // Add funds button
    const addFundsBtn = document.getElementById('add-funds-btn');
    if (addFundsBtn) {
        addFundsBtn.addEventListener('click', addFundsToUser);
    }

    // Reset system button
    const resetSystemBtn = document.getElementById('reset-system');
    if (resetSystemBtn) {
        resetSystemBtn.addEventListener('click', resetSystem);
    }

    // Export data button
    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }

    // Filter transactions button
    const filterTransactionsBtn = document.getElementById('filter-transactions');
    if (filterTransactionsBtn) {
        filterTransactionsBtn.addEventListener('click', filterTransactions);
    }

    // Search users button
    const searchUsersBtn = document.getElementById('search-users-btn');
    if (searchUsersBtn) {
        searchUsersBtn.addEventListener('click', searchUsers);
    }
}

/**
 * Log out the user
 */
async function logoutUser() {
    console.log('Logout functionality disabled as database is not in use.');
}

// Check if showNotification function exists (defined in script.js)
if (typeof showNotification !== 'function') {
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
        notification.querySelector('.notification-close').addEventListener('click', function () {
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
}

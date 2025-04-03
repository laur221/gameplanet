/**
 * MangoBank - Dashboard JavaScript
 * Handles dashboard functionality, account display, and money transfers
 */

let currentUser = null;
let activePage = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Setup logout functionality
    setupLogout();
    
    // Setup page navigation
    setupPageNavigation();
    
    // Setup header actions
    setupHeaderActions();
    
    // Setup transaction view all button
    setupTransactionViewAll();
    
    // Setup search functionality
    setupSearch();
    
    // Store user info in sessionStorage for homepage return
    storeUserInfoForReturn();
    
    // Setup logo link to maintain login state
    setupLogoLink();
    
    setupSidebarMobileToggle();
    
    // Close sidebar when a menu item is clicked on mobile
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.remove('expanded');
                const toggleBtn = document.querySelector('.sidebar-toggle i');
                if (toggleBtn) {
                    toggleBtn.className = 'fas fa-chevron-down';
                }
            }
        });
    });
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('expanded');
            }
        }
    });
    
    // Setup add card functionality
    setupAddCardForm();
});

/**
 * Check if user is authenticated
 */
function checkAuth() {
    // Load user email from sessionStorage using the key set by login.js
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (loggedInUser && isLoggedIn === 'true') {
        // Use the actual logged in email
        currentUser = { 
            email: loggedInUser, 
            full_name: loggedInUser.split('@')[0], 
            balance: 2750.50 // Example balance for demo
        };
    } else {
        // If not logged in properly, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    initDashboard();
}

/**
 * Initialize dashboard with user data
 */
function initDashboard() {
    // Update user information in the sidebar
    updateUserInfo();
    updateFinancialOverview();
    loadTransactions();
}

/**
 * Update user information in the sidebar
 */
function updateUserInfo() {
    if (!currentUser) return;
    
    // Update user name and email in sidebar
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        if (element) element.textContent = currentUser.full_name;
    });
    
    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(element => {
        if (element) element.textContent = currentUser.email;
    });
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.full_name}! Here's your financial summary.`;
    }
}

/**
 * Update balance and financial overview
 */
function updateFinancialOverview() {
    if (!currentUser) return;
    
    // Update current balance
    const balanceElement = document.querySelector('#current-balance');
    if (balanceElement) {
        balanceElement.textContent = formatCurrency(currentUser.balance);
    }
    
    // Example values for income and expenses
    const incomeElement = document.querySelector('#income-amount');
    const expenseElement = document.querySelector('#expense-amount');
    
    if (incomeElement) {
        incomeElement.textContent = formatCurrency(3521.75);
    }
    
    if (expenseElement) {
        expenseElement.textContent = formatCurrency(1403.25);
    }
}

/**
 * Load and display recent transactions
 */
function loadTransactions() {
    if (!currentUser) return;
    
    const transactionsTableBody = document.querySelector('.transactions-table tbody');
    if (!transactionsTableBody) return;
    
    // Clear existing rows
    transactionsTableBody.innerHTML = '';
    
    // Display a message indicating no transactions
    transactionsTableBody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; padding: 2rem;">
                No transactions yet. Your activity will appear here.
            </td>
        </tr>
    `;
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

/**
 * Improved logout function - handles both API and fallback
 * No longer shows confirmation dialog
 */
function logout() {
    // Show logout notification
    showNotification('Logging you out...', 'info');
    
    // Try to call the logout API
    fetch('../api/users.php?action=logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Logout response:', data);
        
        if (data.status === 'success') {
            showNotification('Logout successful', 'success');
        }
        
        // Regardless of API response, clear local session data
        clearSessionAndRedirect();
    })
    .catch(error => {
        console.error('Logout API error:', error);
        // Even if API call fails, we still want to logout locally
        clearSessionAndRedirect();
    });
}

/**
 * Helper function to clear session storage and redirect
 */
function clearSessionAndRedirect() {
    // Clear all relevant session data
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('returnToDashboard');
    sessionStorage.removeItem('dashboardUser');
    
    // Redirect after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Setup sidebar navigation
 */
function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav ul li a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the icon and text content to identify which menu item was clicked
            const icon = this.querySelector('i').className;
            
            // Handle specific navigation items
            if (icon.includes('fa-home')) {
                // Dashboard is already loaded, no need to do anything
                return;
            } else if (icon.includes('fa-exchange-alt')) {
                e.preventDefault();
                showNotification('Transactions feature coming soon!', 'info');
            } else if (icon.includes('fa-credit-card')) {
                e.preventDefault();
                showNotification('Cards feature coming soon!', 'info');
            } else if (icon.includes('fa-user-cog')) {
                e.preventDefault();
                showNotification('Profile management coming soon!', 'info');
            } else if (icon.includes('fa-cog')) {
                e.preventDefault();
                showNotification('Settings feature coming soon!', 'info');
            } else if (icon.includes('fa-sign-out-alt')) {
                e.preventDefault();
                logout();
            }
        });
    });
}

/**
 * Setup header actions (search, notifications, messages)
 */
function setupHeaderActions() {
    // Setup search functionality
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    showNotification(`Searching for: "${searchTerm}"`, 'info');
                    // Clear search field
                    this.value = '';
                }
            }
        });
    }
    
    // Setup notification button
    const notificationBtn = document.querySelector('.header-actions .btn-icon:nth-child(1)');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('You have no new notifications', 'info');
        });
    }
    
    // Setup message button
    const messageBtn = document.querySelector('.header-actions .btn-icon:nth-child(2)');
    if (messageBtn) {
        messageBtn.addEventListener('click', function() {
            showNotification('You have no new messages', 'info');
        });
    }
}

/**
 * Enhanced setup for transfer form
 */
function setupTransferForm() {
    const transferForm = document.getElementById("transferForm");
    if (transferForm) {
        transferForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const recipient = document.getElementById("recipient").value;
            const amount = document.getElementById("amount").value;
            const note = document.getElementById("transferNote")?.value || '';
            
            if (!recipient || !amount) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (isNaN(amount) || parseFloat(amount) <= 0) {
                showNotification('Please enter a valid amount', 'error');
                return;
            }
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API delay
            setTimeout(() => {
                showNotification(`Successfully sent $${amount} to ${recipient}`, 'success');
                
                // Reset form and button
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Add a mock transaction to the table
                addMockTransaction(recipient, amount, note);
            }, 1500);
        });
    }
}

/**
 * Add a mock transaction to the transactions table
 */
function addMockTransaction(recipient, amount, note) {
    const tableBody = document.getElementById("transactions-table-body");
    if (!tableBody) return;
    
    // Clear "no transactions" message if it exists
    if (tableBody.querySelector('td[colspan="4"]')) {
        tableBody.innerHTML = '';
    }
    
    // Create new transaction row
    const newRow = document.createElement('tr');
    
    // Get current date in formatted string
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    
    // Create and append transaction cells
    newRow.innerHTML = `
        <td>${note || 'Transfer to ' + recipient}</td>
        <td>${formattedDate}</td>
        <td class="expense">-$${parseFloat(amount).toFixed(2)}</td>
        <td><span class="status completed">Completed</span></td>
    `;
    
    // Add the new row at the top of the table
    if (tableBody.firstChild) {
        tableBody.insertBefore(newRow, tableBody.firstChild);
    } else {
        tableBody.appendChild(newRow);
    }
    
    // Update balance to reflect transaction
    updateBalanceAfterTransaction(amount);
}

/**
 * Update balance after a transaction
 */
function updateBalanceAfterTransaction(amount) {
    if (!currentUser) return;
    
    // Subtract transaction amount from current balance
    currentUser.balance -= parseFloat(amount);
    
    // Update display
    const balanceElement = document.querySelector('#current-balance');
    if (balanceElement) {
        balanceElement.textContent = formatCurrency(currentUser.balance);
    }
    
    // Update expense amount
    const expenseElement = document.querySelector('#expense-amount');
    if (expenseElement) {
        const currentExpense = parseFloat(expenseElement.textContent.replace(/[^\d.-]/g, ''));
        const newExpense = currentExpense + parseFloat(amount);
        expenseElement.textContent = formatCurrency(newExpense);
    }
}

/**
 * Setup transaction "View All" button
 */
function setupTransactionViewAll() {
    const viewAllBtn = document.querySelector('.recent-transactions .view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Full transaction history coming soon!', 'info');
        });
    }
}

/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Use showNotification function from script.js if available
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
}

/**
 * Setup page navigation
 */
function setupPageNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-nav li');
    
    menuItems.forEach(item => {
        if (item.classList.contains('logout')) return; // Skip logout button
        
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });
}

/**
 * Navigate to a specific page
 * @param {string} pageId - The ID of the page to navigate to
 */
function navigateToPage(pageId) {
    if (pageId === activePage) return; // Already on this page
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.sidebar-nav li');
    menuItems.forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageId}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Load page-specific content
        loadPageContent(pageId);
    }
    
    // Update active page
    activePage = pageId;
}

/**
 * Load content for specific pages
 * @param {string} pageId - The ID of the page to load content for
 */
function loadPageContent(pageId) {
    switch (pageId) {
        case 'dashboard':
            // Dashboard page is already loaded, but we could refresh data here
            break;
        case 'transactions':
            loadTransactionsPage();
            break;
        case 'cards':
            loadCardsPage();
            break;
        case 'profile':
            loadProfilePage();
            break;
        case 'settings':
            loadSettingsPage();
            break;
    }
}

/**
 * Load transactions page content
 */
function loadTransactionsPage() {
    // Show loading spinner
    const tableBody = document.getElementById('full-transactions-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i> Loading transactions...
                </div>
            </td>
        </tr>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        // Generate mock transaction data
        const mockTransactions = [
            { description: 'Salary Deposit', date: '2023-07-01', amount: '$2,500.00', type: 'incoming', status: 'completed' },
            { description: 'Grocery Shopping', date: '2023-06-28', amount: '-$145.30', type: 'outgoing', status: 'completed' },
            { description: 'Monthly Rent', date: '2023-06-25', amount: '-$850.00', type: 'outgoing', status: 'completed' },
            { description: 'Freelance Payment', date: '2023-06-20', amount: '$750.00', type: 'incoming', status: 'completed' },
            { description: 'Electricity Bill', date: '2023-06-15', amount: '-$95.20', type: 'outgoing', status: 'completed' },
            { description: 'Gasoline', date: '2023-06-12', amount: '-$65.80', type: 'outgoing', status: 'completed' },
            { description: 'Online Shopping', date: '2023-06-10', amount: '-$127.50', type: 'outgoing', status: 'completed' },
            { description: 'Interest Payment', date: '2023-06-05', amount: '$15.25', type: 'incoming', status: 'completed' },
            { description: 'Restaurant Dinner', date: '2023-06-02', amount: '-$78.40', type: 'outgoing', status: 'completed' },
            { description: 'Mobile Phone Bill', date: '2023-05-28', amount: '-$45.99', type: 'outgoing', status: 'completed' }
        ];
        
        // Clear and populate table
        tableBody.innerHTML = '';
        
        if (mockTransactions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No transactions found</td>
                </tr>
            `;
            return;
        }
        
        mockTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Create and add table cells
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td>${transaction.date}</td>
                <td class="${transaction.type === 'incoming' ? 'income' : 'expense'}">
                    ${transaction.amount}
                </td>
                <td>
                    <span class="status ${transaction.status}">${transaction.status}</span>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Set up filter functionality
        setupTransactionFilters(mockTransactions, tableBody);
        
    }, 1000); // Simulate 1 second API delay
}

/**
 * Setup transaction filters
 */
function setupTransactionFilters(transactions, tableBody) {
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Get filter values
            const typeFilter = document.getElementById('transaction-type').value;
            const dateFilter = document.getElementById('transaction-date-range').value;
            
            // Show filter is working with notification
            showNotification(`Filtering transactions: ${typeFilter} - ${dateFilter}`, 'info');
            
            // Show loading effect
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i> Applying filters...
                        </div>
                    </td>
                </tr>
            `;
            
            // Simulate filtering delay
            setTimeout(() => {
                // Filter transactions (in a real app, this would use actual filter logic)
                let filteredTransactions = [...transactions];
                
                // Apply filters (simplified example)
                if (typeFilter !== 'all') {
                    filteredTransactions = filteredTransactions.filter(t => 
                        typeFilter === 'incoming' ? t.type === 'incoming' : t.type === 'outgoing'
                    );
                }
                
                // Clear and populate table with filtered data
                tableBody.innerHTML = '';
                
                if (filteredTransactions.length === 0) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="4" class="text-center">No transactions match your filters</td>
                        </tr>
                    `;
                    return;
                }
                
                filteredTransactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${transaction.description}</td>
                        <td>${transaction.date}</td>
                        <td class="${transaction.type === 'incoming' ? 'income' : 'expense'}">
                            ${transaction.amount}
                        </td>
                        <td>
                            <span class="status ${transaction.status}">${transaction.status}</span>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
            }, 800);
        });
    }
}

/**
 * Load cards page content
 */
function loadCardsPage() {
    // Update card holder name
    const cardHolderName = document.getElementById('card-holder-name');
    if (cardHolderName && currentUser) {
        cardHolderName.textContent = currentUser.full_name.toUpperCase();
    }
    
    // Set up card action buttons
    const cardActionButtons = document.querySelectorAll('.card-actions button');
    cardActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            switch (true) {
                case buttonText.includes('View Details'):
                    showNotification('Card details opened', 'info');
                    break;
                case buttonText.includes('Lock Card'):
                    this.innerHTML = '<i class="fas fa-unlock"></i> Unlock Card';
                    showNotification('Card locked successfully', 'success');
                    break;
                case buttonText.includes('Unlock Card'):
                    this.innerHTML = '<i class="fas fa-lock"></i> Lock Card';
                    showNotification('Card unlocked successfully', 'success');
                    break;
                case buttonText.includes('Request New Card'):
                    showRequestCardModal();
                    break;
            }
        });
    });
    
    // Setup add card button
    const addCardBtn = document.getElementById('add-card-btn');
    if (addCardBtn) {
        addCardBtn.addEventListener('click', function() {
            showAddCardModal();
        });
    }
    
    // Setup request card form
    setupRequestCardForm();
}

/**
 * Setup add card form and modal
 */
function setupAddCardForm() {
    console.log("Setting up add card form and modal");
    const modal = document.getElementById('add-card-modal');
    if (!modal) {
        console.error("Modal element not found");
        return;
    }
    
    // Close modal when clicking on close button or cancel button
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    console.log("Close button found:", !!closeBtn);
    console.log("Cancel button found:", !!cancelBtn);
    
    // Direct approach with onclick attribute as backup
    if (closeBtn) {
        closeBtn.onclick = function() {
            console.log("Close button clicked");
            hideAddCardModal();
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            console.log("Cancel button clicked");
            hideAddCardModal();
        };
    }
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log("Clicked outside modal");
            hideAddCardModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
            console.log("Escape key pressed");
            hideAddCardModal();
        }
    });
    
    // Format card number with spaces
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // Remove any non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            // Update the input value
            this.value = formattedValue;
        });
    }
    
    // Format expiry date with slash
    const expiryDateInput = document.getElementById('expiry-date');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            // Remove any non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Format as MM/YY
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            this.value = value;
        });
    }
    
    // Allow only digits in CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Handle form submission
    const addCardForm = document.getElementById('add-card-form');
    if (addCardForm) {
        addCardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardType = document.getElementById('card-type').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const nameOnCard = document.getElementById('name-on-card').value;
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Create a new card element in the UI
                addNewCardToUI(cardType, cardNumber, expiryDate, nameOnCard);
                
                // Reset form and hide modal
                addCardForm.reset();
                hideAddCardModal();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showNotification('Card added successfully', 'success');
            }, 1500);
        });
    }
}

/**
 * Show the add card modal
 */
function showAddCardModal() {
    console.log("Showing add card modal");
    const modal = document.getElementById('add-card-modal');
    if (modal) {
        // Reset any previously added inline styles
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.display = 'flex';
        
        // Add active class for transitions
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Set the name on card field to user's name if logged in
        if (currentUser) {
            const nameOnCardInput = document.getElementById('name-on-card');
            if (nameOnCardInput) {
                nameOnCardInput.value = currentUser.full_name.toUpperCase();
            }
        }
    } else {
        console.error("Modal element not found");
    }
}

/**
 * Hide the add card modal
 */
function hideAddCardModal() {
    console.log("Hiding add card modal");
    const modal = document.getElementById('add-card-modal');
    if (modal) {
        // Remove active class first
        modal.classList.remove('active');
        
        // Then hide after transition completes
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.display = 'none';
            console.log("Modal hidden");
        }, 300);
    } else {
        console.error("Modal element not found");
    }
}

/**
 * Add a new card to the UI after form submission
 */
function addNewCardToUI(cardType, cardNumber, expiryDate, nameOnCard) {
    // Format card number for display (mask all but last 4 digits)
    const lastDigits = cardNumber.replace(/\s/g, '').slice(-4);
    const displayNumber = `**** **** **** ${lastDigits}`;
    
    // Create a new card element
    const cardsContainer = document.querySelector('.cards-container');
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card credit-card';
    
    // Add card content
    cardDiv.innerHTML = `
        <div class="card-front ${cardType}-card">
            <div class="card-logo">MangoBank ${cardType === 'credit' ? 'Credit' : 'Debit'}</div>
            <div class="chip-icon"><i class="fas fa-microchip"></i></div>
            <div class="card-number">${displayNumber}</div>
            <div class="card-holder">
                <span class="label">Card Holder</span>
                <span class="name">${nameOnCard}</span>
            </div>
            <div class="card-expires">
                <span class="label">Expires</span>
                <span>${expiryDate}</span>
            </div>
            <div class="card-type"><i class="fab fa-cc-visa"></i></div>
        </div>
    `;
    
    // Add it to the container before the existing cards
    if (cardsContainer.firstChild) {
        cardsContainer.insertBefore(cardDiv, cardsContainer.firstChild);
    } else {
        cardsContainer.appendChild(cardDiv);
    }
}

/**
 * Setup request card form and modal
 */
function setupRequestCardForm() {
    const modal = document.getElementById('request-card-modal');
    if (!modal) return;
    
    // Close modal when clicking on close button or cancel button
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            hideRequestCardModal();
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            hideRequestCardModal();
        };
    }
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideRequestCardModal();
        }
    });
    
    // Show/hide "other reason" field based on selection
    const reasonSelect = document.getElementById('request-reason');
    const otherReasonGroup = document.getElementById('other-reason-group');
    
    if (reasonSelect && otherReasonGroup) {
        reasonSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherReasonGroup.style.display = 'block';
            } else {
                otherReasonGroup.style.display = 'none';
            }
        });
    }
    
    // Handle form submission
    const requestCardForm = document.getElementById('request-card-form');
    if (requestCardForm) {
        requestCardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const reason = document.getElementById('request-reason').value;
            let otherReason = '';
            
            if (reason === 'other') {
                otherReason = document.getElementById('other-reason').value;
            }
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Reset form and hide modal
                requestCardForm.reset();
                hideRequestCardModal();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showNotification('Virtual card request submitted successfully. Your card details will be available in your account within 15 minutes.', 'success');
            }, 1500);
        });
    }
}

/**
 * Show the request card modal
 */
function showRequestCardModal() {
    const modal = document.getElementById('request-card-modal');
    if (modal) {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.display = 'flex';
        
        // Add active class for transitions
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

/**
 * Hide the request card modal
 */
function hideRequestCardModal() {
    const modal = document.getElementById('request-card-modal');
    if (modal) {
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Load profile page content
 */
function loadProfilePage() {
    // Set profile data based on current user
    if (currentUser) {
        document.getElementById('profile-email').value = currentUser.email;
        
        // If we have full name, split it into first and last
        const nameParts = currentUser.full_name.split(' ');
        if (nameParts.length >= 2) {
            document.getElementById('profile-firstname').value = nameParts[0];
            document.getElementById('profile-lastname').value = nameParts.slice(1).join(' ');
        } else {
            document.getElementById('profile-firstname').value = currentUser.full_name;
        }
    }
    
    // Set up profile form submission
    const profileForm = document.getElementById('profile-update-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get updated values
            const firstName = document.getElementById('profile-firstname').value;
            const lastName = document.getElementById('profile-lastname').value;
            const email = document.getElementById('profile-email').value;
            
            // Show loading on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            // Simulate API delay
            setTimeout(() => {
                // Update current user data
                currentUser.full_name = `${firstName} ${lastName}`;
                currentUser.email = email;
                
                // Update UI elements that display user info
                updateUserInfo();
                
                // Reset button and show success
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showNotification('Profile updated successfully', 'success');
            }, 1500);
        });
    }
}

/**
 * Load settings page content
 */
function loadSettingsPage() {
    // Set up toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            const isEnabled = this.checked;
            
            showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
        });
    });
    
    // Set up change password button
    const changePasswordBtn = document.querySelector('.setting-item button');
    if (changePasswordBtn && changePasswordBtn.textContent.trim() === 'Change') {
        changePasswordBtn.addEventListener('click', function() {
            // Show a mock password change form
            showPasswordChangeForm();
        });
    }
    
    // Set up notification settings button
    const notificationSettingsBtn = document.getElementById('notification-settings-btn');
    if (notificationSettingsBtn) {
        notificationSettingsBtn.addEventListener('click', function() {
            showNotificationSettingsModal();
        });
    }
    
    // Set up notification settings form
    setupNotificationSettingsForm();
}

/**
 * Setup notification settings form and modal
 */
function setupNotificationSettingsForm() {
    const modal = document.getElementById('notification-settings-modal');
    if (!modal) return;
    
    // Close modal when clicking on close button or cancel button
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            hideNotificationSettingsModal();
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            hideNotificationSettingsModal();
        };
    }
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideNotificationSettingsModal();
        }
    });
    
    // Handle form submission
    const notificationForm = document.getElementById('notification-settings-form');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const emailNotifications = document.getElementById('email-notifications').checked;
            const pushNotifications = document.getElementById('push-notifications').checked;
            const transactionAlerts = document.getElementById('transaction-alerts').checked;
            const securityAlerts = document.getElementById('security-alerts').checked;
            const marketingUpdates = document.getElementById('marketing-updates').checked;
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Hide modal
                hideNotificationSettingsModal();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showNotification('Notification settings updated successfully', 'success');
            }, 1500);
        });
    }
}

/**
 * Show the notification settings modal
 */
function showNotificationSettingsModal() {
    const modal = document.getElementById('notification-settings-modal');
    if (modal) {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.display = 'flex';
        
        // Add active class for transitions
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

/**
 * Hide the notification settings modal
 */
function hideNotificationSettingsModal() {
    const modal = document.getElementById('notification-settings-modal');
    if (modal) {
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Show password change form in a modal
 */
function showPasswordChangeForm() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Create modal content
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="password-change-form">
                    <div class="form-group">
                        <label for="current-password">Current Password</label>
                        <input type="password" id="current-password" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Change Password</button>
                        <button type="button" class="btn btn-outline modal-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    const closeBtn = modalContainer.querySelector('.modal-close');
    const cancelBtn = modalContainer.querySelector('.modal-cancel');
    const passwordForm = modalContainer.querySelector('#password-change-form');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        // Show loading on button
        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate API delay
        setTimeout(() => {
            document.body.removeChild(modalContainer);
            showNotification('Password changed successfully', 'success');
        }, 1500);
    });
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.querySelector('.header-search input');
    const searchButton = document.querySelector('.header-search .search-btn');
    
    if (searchInput && searchButton) {
        // Handle button click
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        // Handle enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
}

/**
 * Perform search with the given query
 */
function performSearch(query) {
    if (query && query.trim()) {
        showNotification(`Searching for: "${query.trim()}"`, 'info');
        
        // Show spinner in search input
        const searchIcon = document.querySelector('.header-search i');
        searchIcon.className = 'fas fa-spinner fa-spin';
        
        // Simulate search delay
        setTimeout(() => {
            // Restore search icon
            searchIcon.className = 'fas fa-search';
            
            // Clear search field
            document.querySelector('.header-search input').value = '';
            
            // Show results (mock functionality)
            showSearchResults(query);
        }, 1000);
    }
}

/**
 * Display search results
 */
function showSearchResults(query) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    modalContainer.innerHTML = `
        <div class="modal search-results-modal">
            <div class="modal-header">
                <h3>Search Results for "${query}"</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="search-results">
                    <p>No results found for "${query}"</p>
                    <p>Try using different keywords or check your spelling.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    const closeBtn = modalContainer.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
}

/**
 * Store user info in sessionStorage for homepage return
 */
function storeUserInfoForReturn() {
    if (currentUser) {
        sessionStorage.setItem('returnToDashboard', 'true');
        sessionStorage.setItem('dashboardUser', JSON.stringify({
            email: currentUser.email,
            name: currentUser.full_name
        }));
    }
}

/**
 * Setup logo link to maintain login state when going to home page
 */
function setupLogoLink() {
    const logoLink = document.getElementById('logo-home-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            // Store special flag to indicate coming from dashboard
            sessionStorage.setItem('comingFromDashboard', 'true');
            // Don't prevent default - let the navigation happen
        });
    }
    
    // Return Home button code removed
}
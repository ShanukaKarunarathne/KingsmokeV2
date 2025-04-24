// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and not on the login page, redirect to login
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
}

// Function to log out
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

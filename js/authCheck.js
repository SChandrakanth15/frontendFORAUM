document.addEventListener("DOMContentLoaded", function () {
    const tokenData = localStorage.getItem('jwtToken');
    
    if (!tokenData) {
        // Redirect to login page and show a login message
        localStorage.setItem('loginMessage', 'You must log in to access this page.');
        window.location.href = 'login.html';
        return; // Prevent further execution
    }

    // Parse the tokenData and extract only the token
    const parsedToken = JSON.parse(tokenData);
    const token = parsedToken.token; // Extract the token part only
    console.log("JWT Token: " + token);
});

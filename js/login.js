document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form from submitting traditionally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    try {
        const response = await fetch('http://authservice:8081/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const token = await response.text(); // Assuming JWT token is returned as plain text
            localStorage.setItem('jwtToken', token); // Store the token in local storage
            localStorage.setItem('username', username); // Store the username for later use

            // Show success message
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.style.color = 'green';

            // Redirect to the homepage after a short delay
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirect to the homepage
            }, 1000); // Redirect after 1 second
        } else if (response.status === 400) {
            loginMessage.textContent = 'Invalid username or password. Please try again.';
            loginMessage.style.color = 'red';
        } else {
            const errorMessage = await response.text();
            loginMessage.textContent = `Error: ${errorMessage}`;
            loginMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginMessage.textContent = 'An error occurred. Please try again.';
        loginMessage.style.color = 'red';
    }
});

// Show message if user was redirected to login page
document.addEventListener("DOMContentLoaded", function () {
    const loginMessageElement = document.getElementById('loginMessage');
    const loginMessage = localStorage.getItem('loginMessage');
    
    if (loginMessage) {
        loginMessageElement.textContent = loginMessage;
        loginMessageElement.style.color = 'red';
        localStorage.removeItem('loginMessage'); // Clear the message after displaying it
    }
});

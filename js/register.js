// Check if the user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('jwtToken'); // Replace with your actual token storage method
    if (token) {
        alert("Please log out to register a new account."); // Alert message
        window.location.href = 'homepage.html'; // Redirect to homepage
    }
}

// Call the function on page load
window.onload = checkLoginStatus;

// Registration form submission
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the form from submitting traditionally

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const registerMessage = document.getElementById('registerMessage');

    // Validate if passwords match
    if (password !== confirmPassword) {
        registerMessage.textContent = 'Passwords do not match.';
        registerMessage.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:8082/users/register', {
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
            const result = await response.json();
            registerMessage.textContent = 'Registration successful!';
            registerMessage.style.color = 'green';

            // Redirect to login page after successful registration
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000); // Redirect after 1 second
        } else if (response.status === 400) {
            const errorMessage = await response.text();
            registerMessage.textContent = `Error: ${errorMessage}`;
            registerMessage.style.color = 'red';
        } else {
            registerMessage.textContent = 'An error occurred during registration.';
            registerMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        registerMessage.textContent = 'An unexpected error occurred.';
        registerMessage.style.color = 'red';
    }
});

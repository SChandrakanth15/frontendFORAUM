document.addEventListener("DOMContentLoaded", function () {
    const tokenData = localStorage.getItem('jwtToken');
    
    if (!tokenData) {
        // Redirect to login page and show login message
        localStorage.setItem('loginMessage', 'You must log in to access the messaging page.');
        window.location.href = 'login.html';
        return; // Prevent further execution
    }

    // Parse the tokenData and extract only the token
    const parsedToken = JSON.parse(tokenData);
    const token = parsedToken.token; // Extract the token part only
    console.log("JWT Token: " + token);
});

document.getElementById('sendButton').addEventListener('click', async function () {
    const message = document.getElementById('messageInput').value.trim();
    const receiver = document.getElementById('receiver').value.trim();
    const tokenData = localStorage.getItem('jwtToken'); // Get the token data from localStorage
    const parsedToken = JSON.parse(tokenData);
    const token = parsedToken.token; // Extract the token part only
    console.log("JWT Token: " + token);
    const sender = localStorage.getItem('username'); // Retrieve the logged-in user's username

    if (!receiver) {
        alert('Error: Receiver field cannot be empty.');
        return;
    }

    if (!message) {
        alert('Error: Message field cannot be empty.');
        return;
    }

    try {
        const response = await fetch('http://messageservice:8080/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include JWT token in Authorization header
            },
            body: JSON.stringify({
                sender: sender, // Include the sender's username
                receiverUsername: receiver,
                message: message
            })
        });

        if (response.ok) {
            alert('Message sent successfully!');
        } else {
            const errorMessage = await response.text();
            alert('Error: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('jwtToken'); // Clear the JWT token
    localStorage.removeItem('username'); // Clear the username
    window.location.href = 'login.html'; // Redirect to login page
});

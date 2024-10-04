document.addEventListener("DOMContentLoaded", function () {
    const tokenData = localStorage.getItem('jwtToken');
    
    if (!tokenData) {
        // Redirect to login page and show login message
        localStorage.setItem('loginMessage', 'You must log in to view messages.');
        window.location.href = 'login.html';
        return; // Prevent further execution
    }

    // Parse the tokenData and extract only the token
    const parsedToken = JSON.parse(tokenData);
    const token = parsedToken.token; // Extract the token part only

    const messageList = document.getElementById("messageList");

    fetch(`${config.messageBaseUrl}/messages/user`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include JWT token in Authorization header
        }
    })
    .then(response => response.json())
    .then(messages => {
        messages.forEach(message => {
            const row = document.createElement("tr");

            // Create table cells for each message property
            const senderCell = document.createElement("td");
            senderCell.textContent = message.senderUsername;

            const receiverCell = document.createElement("td");
            receiverCell.textContent = message.receiverUsername;

            const messageCell = document.createElement("td");
            messageCell.textContent = message.message;

            const timeStampCell = document.createElement("td");
            timeStampCell.textContent = message.timeStamp; // Already formatted on the backend

            // Append cells to the row
            row.appendChild(senderCell);
            row.appendChild(receiverCell);
            row.appendChild(messageCell);
            row.appendChild(timeStampCell);

            // Append the row to the table body
            messageList.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching messages:", error));
});

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('jwtToken'); // Clear the JWT token
    localStorage.removeItem('username'); // Clear the username
    window.location.href = 'login.html'; // Redirect to login page
});

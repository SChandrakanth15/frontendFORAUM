document.addEventListener("DOMContentLoaded", function () {
    const jwtObject = localStorage.getItem('jwtToken');
    const token = jwtObject ? JSON.parse(jwtObject).token : null; 
    const loggedInUsername = localStorage.getItem('username');
    
    if (!token) {
        localStorage.setItem('loginMessage', 'You must log in to access the chat.');
        window.location.href = 'login.html';
        return;
    }

    // Display the logged-in username at the top of the chat screen
    const loggedInUsernameDisplay = document.getElementById('loggedInUsername');
    if (loggedInUsernameDisplay && loggedInUsername) {
        loggedInUsernameDisplay.textContent = loggedInUsername;
    }

    fetch("http://usermanagementservice:8082/users/except", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById("userList");

        users.forEach(user => {
            if (user.username !== loggedInUsername) {
                const li = document.createElement("li");
                li.textContent = user.username;
                li.addEventListener('click', function () {
                    startChat(user.username);
                });
                userList.appendChild(li);
            }
        });
    })
    .catch(error => console.error("Error fetching users:", error));
});

function startChat(username) {
    document.getElementById('chatWithUsername').textContent = username;
    document.getElementById('messageDisplay').innerHTML = '';
    
    // Clear the previous interval if it exists
    const previousIntervalId = document.getElementById('chatAppContainer')?.getAttribute('data-interval-id');
    if (previousIntervalId) {
        clearInterval(previousIntervalId);
    }
    
    // Fetch chat history for the selected user
    fetchChatHistory(username);
    
    // Start polling to check for new messages
    startRealTimeChatUpdate(username);
}

function fetchChatHistory(selectedUsername) {
    const jwtObject = localStorage.getItem('jwtToken');
    const token = jwtObject ? JSON.parse(jwtObject).token : null; 
    const loggedInUsername = localStorage.getItem('username');

    fetch(`http://messageservice:8080/messages/history/${selectedUsername}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(messages => {
        displayChatHistory(messages, loggedInUsername);
    })
    .catch(error => console.error("Error fetching chat history:", error));
}

function displayChatHistory(messages, loggedInUsername) {
    const messageDisplay = document.getElementById('messageDisplay');
    messageDisplay.innerHTML = ''; // Clear previous messages

    messages.forEach(message => {
        const msgDiv = document.createElement('div');
        if (message.senderUsername === loggedInUsername) {
            msgDiv.classList.add('sentMessage');
            msgDiv.style.backgroundColor = '#d4edda';  // Green background for sent messages
            msgDiv.style.textAlign = 'right';
            msgDiv.textContent = `You: ${message.message}`;
        } else {
            msgDiv.classList.add('receivedMessage');
            msgDiv.style.backgroundColor = '#cce5ff';  // Blue background for received messages
            msgDiv.style.textAlign = 'left';
            msgDiv.textContent = `${message.senderUsername}: ${message.message}`;
        }
        messageDisplay.appendChild(msgDiv);
    });

    // Scroll to the bottom of the chat after rendering messages
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
}

document.getElementById('sendButton').addEventListener('click', function () {
    const message = document.getElementById('messageInput').value.trim();
    const receiver = document.getElementById('chatWithUsername').textContent;
    const jwtObject = localStorage.getItem('jwtToken');
    const token = jwtObject ? JSON.parse(jwtObject).token : null;

    if (!message || !receiver) {
        alert('Please enter a message and select a user to chat with.');
        return;
    }

    // Send the message to the server
    fetch('http://messageservice:8080/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            receiverUsername: receiver,
            message: message
        })
    })
    .then(response => {
        if (response.ok) {
            const messageDisplay = document.getElementById('messageDisplay');
            const msgDiv = document.createElement('div');
            msgDiv.style.backgroundColor = '#d4edda';  // Green for sent messages
            msgDiv.style.textAlign = 'right';
            msgDiv.textContent = `You: ${message}`;
            messageDisplay.appendChild(msgDiv);
            document.getElementById('messageInput').value = '';  // Clear the input field
            messageDisplay.scrollTop = messageDisplay.scrollHeight;  // Scroll to the bottom
        } else {
            alert('Error sending message.');
        }
    })
    .catch(error => console.error('Error:', error));
});

function startRealTimeChatUpdate(selectedUsername) {
    const intervalId = setInterval(() => {
        fetchChatHistory(selectedUsername);  // Fetch new messages every 3 seconds
    }, 3000);

    // Store the interval ID so it can be cleared when switching users
    document.getElementById('chatAppContainer').setAttribute('data-interval-id', intervalId);
}

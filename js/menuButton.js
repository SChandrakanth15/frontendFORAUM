function myFunction(x) {
    x.classList.toggle("change");
    // Add any additional functionality here for when the menu is clicked
}

function toggleDropdown(element) {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
}

document.getElementById("editUsernameBtn").addEventListener("click", function () {
    const newUsername = prompt("Enter your new username:");
    if (newUsername) {
        editUsername(newUsername);
    }
    document.getElementById("dropdownMenu").style.display = "none"; // Close dropdown after action
});

document.getElementById("deleteAccountBtn").addEventListener("click", function () {
    const confirmation = confirm("Are you sure you want to delete your account?");
    if (confirmation) {
        deleteAccount();
    }
    document.getElementById("dropdownMenu").style.display = "none"; // Close dropdown after action
});

function editUsername(newUsername) {
    const jwtObject = localStorage.getItem('jwtToken');
    const token = jwtObject ? JSON.parse(jwtObject).token : null;

    fetch('http://usermanagementservice:8082/users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
    })
    .then(response => {
        if (response.ok) {
            alert("Username updated successfully. You need to log in again.");
            localStorage.clear(); // Clear localStorage after success
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page after message
            }, 2000); // Wait for 2 seconds to show the message
        } else {
            alert("Error updating username.");
        }
    })
    .catch(error => console.error("Error editing username:", error));
}

function deleteAccount() {
    const jwtObject = localStorage.getItem('jwtToken');
    const token = jwtObject ? JSON.parse(jwtObject).token : null;

    fetch('http://usermanagementservice:8082/users/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Account deleted successfully. You need to log in again.");
            localStorage.clear(); // Clear localStorage after account deletion
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page after message
            }, 2000); // Wait for 2 seconds to show the message
        } else {
            alert("Error deleting account.");
        }
    })
    .catch(error => console.error("Error deleting account:", error));
}

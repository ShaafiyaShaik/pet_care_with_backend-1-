// Event listener for the login form submission
document.getElementById('loginForm4').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const email = event.target.email.value; // Get email
    const password = event.target.password.value; // Get password
    loginUser(email, password);
});

// Example of loginUser function to be called on form submission
async function loginUser(email, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) { // Check if the response status is 200-299
        // Store the token in local storage
        localStorage.setItem('token', data.token);
        alert(data.message); // Display success message
        window.location.href = '/'; // Redirect to home page or the same page
    } else {
        alert('Login failed: ' + data.message); // Show error message
    }
}

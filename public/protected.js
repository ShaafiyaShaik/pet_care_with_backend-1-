async function getProtectedData() {
    const token = localStorage.getItem('token');
    const response = await fetch('/protected', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.text();
        console.log(data); // Handle the protected data
    } else {
        console.error('Failed to retrieve protected data:', response.status);
    }
}

// Call this function when you want to access protected data
// Example: you can call this when the page loads or on a button click
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        getProtectedData(); // Fetch protected data if token exists
    } else {
        console.log('No token found, user is not logged in');
    }
});

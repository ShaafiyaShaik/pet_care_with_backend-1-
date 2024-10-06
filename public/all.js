//registration form
function showRegistration() {
    document.getElementById('registration-form').style.display = 'flex';
    document.querySelector('.hero').style.display = 'none';
    }

// Login form submission
document.querySelector('#loginForm4').addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mobile = document.getElementById('mobile').value;

    if (email === '' || password === '' || mobile === '') {
        alert('Please fill in all fields: email, password, and mobile number.');
        e.preventDefault(); 
    } 
});

document.querySelector('.reset-btn').addEventListener('click', function() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('mobile').value = '';
    document.querySelector('.message4').textContent = ''; 
});

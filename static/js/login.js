document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `password=${encodeURIComponent(password)}`
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                document.getElementById('password').value = '';
                throw new Error('Отказ доступа!');
            }
        })
        .then(data => {
            alert(data.message);
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
});
// Клик по любому объекту, кроме модального окна
document.addEventListener('click', function(event) {

    if (!event.target.closest('.modal')) {
        focusPassword();
    }
});

function focusPassword() {
    document.getElementById('password').focus();
}

window.onload = function() {
    focusPassword();
};
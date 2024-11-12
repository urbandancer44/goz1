document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Предотвращаем стандартное поведение браузера

    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `password=${password}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        window.location.href = data;  // Перенаправляем пользователя на страницу, указанную в ответе сервера
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
document.getElementById("password").focus();
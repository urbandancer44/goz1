function getUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.forEach(user => {
                if (user[1] !== 'admin') {
                    const row = document.createElement('tr');
                    const usernameCell = document.createElement('td');
                    const roleCell = document.createElement('td');
                    const actionCell = document.createElement('td');
                    const editButton = document.createElement('button');
                    const deleteButton = document.createElement('button');

                    usernameCell.innerText = user[0];
                    roleCell.innerText = user[1];
                    editButton.innerText = 'Редактировать';
                    editButton.className = 'btn btn-warning btn-sm';
                    editButton.onclick = function() {
                        updateUser(user[0]);
                    };
                    deleteButton.innerText = 'Удалить';
                    deleteButton.className = 'btn btn-danger btn-sm';
                    deleteButton.onclick = function() {
                        deleteUser(user[0]);
                    };
                    actionCell.appendChild(editButton);
                    actionCell.appendChild(deleteButton);
                    row.appendChild(usernameCell);
                    row.appendChild(roleCell);
                    row.appendChild(actionCell);
                    tableBody.appendChild(row);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteUser(username) {
    fetch('/delete_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${username}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        getUsers();  // Перезагружаем таблицу после удаления
    })
    .catch(error => console.error('Error:', error));
}

function updateUser(username) {
    const newPassword = prompt('Введите новый пароль для пользователя ' + username);
    if (newPassword) {
        fetch('/update_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${username}&new_password=${newPassword}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            getUsers();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    }
}

function addUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    fetch('/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${username}&password=${password}&role=${role}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        getUsers();  // Перезагружаем таблицу после добавления
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addUser();
});

window.onload = function() {
    getUsers();  // Загружаем пользователей при загрузке страницы
    setInterval(getUsers, 5000);  // Обновляем данные каждые 5 секунд
};
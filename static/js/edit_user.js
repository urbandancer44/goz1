/*function getUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.forEach(user => {
                if (user[3] !== 'admin') {
                    const row = document.createElement('tr');
                    const usernameCell = document.createElement('td');
                    const roleCell = document.createElement('td');
                    const actionCell = document.createElement('td');
                    const editButton = document.createElement('button');
                    const deleteButton = document.createElement('button');

                    usernameCell.innerText = user[1];
                    roleCell.innerText = user[3];
                    editButton.innerText = 'Редактировать';
                    editButton.className = 'btn btn-warning btn-sm';
                    editButton.onclick = function() {
                        updateUser(user[1]);
                    };
                    deleteButton.innerText = 'Удалить';
                    deleteButton.className = 'btn btn-danger btn-sm';
                    deleteButton.onclick = function() {
                        deleteUser(user[1]);
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
        body: `username=${encodeURIComponent(username)}`
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
            body: `username=${encodeURIComponent(username)}&new_password=${encodeURIComponent(newPassword)}`
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
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
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
};*/
let username = null;
let editPasswordModal = null;

function getUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.forEach((user, index) => {
                if (user[3] !== 'admin') {
                    const row = document.createElement('tr');
                    const numberCell = document.createElement('td');
                    const usernameCell = document.createElement('td');
                    const roleCell = document.createElement('td');

                    numberCell.innerText = index + 1;
                    usernameCell.innerText = user[1];
                    roleCell.innerText = user[3];
                    row.appendChild(numberCell);
                    row.appendChild(usernameCell);
                    row.appendChild(roleCell);
                    tableBody.appendChild(row);

                    row.dataset.user = user[1];
                    row.addEventListener("click", (event) => {
                        //alert(product[1]);
                        activateRow(event.currentTarget);
                    });
                }
            });
        })
        .catch(error => console.error('Error:', error));
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
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
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

function activateRow(row) {
    document.querySelectorAll('#usersTableBody tr').forEach(r => r.classList.remove('table-active'));
    row.classList.add('table-active')
    username = row.dataset.user;
    //alert(product_name);
}
//---изменение фото в таблице---
document.getElementById('editUserPasswordButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#usersTableBody tr.table-active');
    if (activeRow) {
        editPasswordModal = new bootstrap. Modal(document.getElementById('editPasswordModal'));
        editPasswordModal.show();
    } else {
        username = null;
        editPasswordModal = null;
        alert('Выберите строку для редактирования!');
    }
});
document.getElementById('savePasswordButton').addEventListener('click', function () {
    const newPassword = document.getElementById('newPassword').value;
    if (newPassword) {
        fetch('/update_user_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                newPassword: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editPasswordModal.hide();
            editPasswordModal = null;
            username = null;
            getUsers();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
    document.getElementById('newPassword').value = '';
});

//---удаление записи в таблице---
document.getElementById('deleteUserButton').addEventListener('click', function () {
    const activeRow = document.querySelector('#usersTableBody tr.table-active');
    if (activeRow) {
        fetch('/delete_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            username = null;
            getUsers();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Выберите строку для удаления!')
    }
});

window.onload = function() {
    getUsers();  // Загружаем пользователей при загрузке страницы
};




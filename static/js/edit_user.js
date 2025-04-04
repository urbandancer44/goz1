function getUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('usersTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            // Сортируем данные по имени пользователя (username) в алфавитном порядке
            data.sort((a, b) => a.username.localeCompare(b.username));

            // Проходим по каждому элементу данных
            data.forEach((user, index) => {
                if (user.role !== 'admin') {  // Исключаем пользователей с ролью 'admin'
                    const row = document.createElement('div');
                    row.classList.add('grid-row');

                    // Создаем ячейки для каждой колонки
                    const numberCell = document.createElement('div');
                    const usernameCell = document.createElement('div');
                    const roleCell = document.createElement('div');

                    // Заполняем ячейки данными из словаря
                    numberCell.innerText = index + 1;
                    usernameCell.innerText = user.username;  // Доступ через ключ словаря
                    roleCell.innerText = user.role;          // Доступ через ключ словаря

                    // Добавляем ячейки в строку
                    row.appendChild(numberCell);
                    row.appendChild(usernameCell);
                    row.appendChild(roleCell);

                    // Добавляем строку в таблицу
                    gridBody.appendChild(row);

                    // Добавляем атрибут dataset для хранения имени пользователя
                    row.dataset.user = user.username;

                    // Добавляем обработчик события клика
                    row.addEventListener("click", (event) => {
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
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        getUsers();  // Перезагружаем таблицу после добавления
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addUser();
});

function activateRow(row) {
    document.querySelectorAll('#usersTableBody .grid-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row');
    username = row.dataset.user;
}

// --- Изменение пароля пользователя ---
document.getElementById('editUserPasswordButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#usersTableBody .grid-row.active-row');
    if (activeRow) {
        document.getElementById('newPassword').value = '';
        editPasswordModal = new bootstrap. Modal(document.getElementById('editPasswordModal'));
        editPasswordModal.show();
    } else {
        username = null;
        editPasswordModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При открытии модального окна
document.getElementById('editPasswordModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('newPassword').focus();
})
// При закрытии модального окна
// document.getElementById('editPasswordModal').addEventListener('hidden.bs.modal', function () {
//     document.getElementById('newPassword').value = '';
// })
// При нажатии кнопки модального окна
document.getElementById('editPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault();
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
});

// --- Изменение роли пользователя ---
document.getElementById('editUserRoleButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#usersTableBody .grid-row.active-row');
    if (activeRow) {
        editRoleModal = new bootstrap. Modal(document.getElementById('editRoleModal'));
        editRoleModal.show();
    } else {
        username = null;
        editRoleModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При закрытии модального окна
// document.getElementById('editRoleModal').addEventListener('hidden.bs.modal', function () {
//     document.getElementById('newRole').value = '';
// })
// При нажатии кнопки модального окна
document.getElementById('saveRoleButton').addEventListener('click', function () {
    const newRole = document.getElementById('newRole').value;
    if (newRole) {
        fetch('/update_user_role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                newRole: newRole
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editRoleModal.hide();
            editRoleModal = null;
            username = null;
            getUsers();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Удаление записи в таблице---
document.getElementById('deleteUserButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#usersTableBody .grid-row.active-row');
    if (activeRow) {
        deleteUserModal = new bootstrap. Modal(document.getElementById('deleteUserModal'));
        deleteUserModal.show();
    } else {
        username = null;
        deleteUserModal = null;
        alert('Выберите строку для удаления!');
    }
});
document.getElementById('applyDeleteUserButton').addEventListener('click', function () {
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
        deleteUserModal.hide();
        deleteUserModal = null;
        username = null;
        getUsers();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
});

window.onload = function() {

    getTime();
    getWorkplaceName();
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду

    getUsers();  // Загружаем пользователей при загрузке страницы
};




let username = null;
let editPasswordModal = null;
let editRoleModal = null;


function getUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a, b) => a[1].localeCompare(b[1]));

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
    document.querySelectorAll('#usersTableBody tr').forEach(r => r.classList.remove('table-active'));
    row.classList.add('table-active')
    username = row.dataset.user;
    //alert(product_name);
}
//---изменение пароля пользователя---
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

//---изменение роли пользователя---
document.getElementById('editUserRoleButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#usersTableBody tr.table-active');
    if (activeRow) {
        editRoleModal = new bootstrap. Modal(document.getElementById('editRoleModal'));
        editRoleModal.show();
    } else {
        username = null;
        editRoleModal = null;
        alert('Выберите строку для редактирования!');
    }
});
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
    document.getElementById('newRole').value = '';
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




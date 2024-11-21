let productionUid = null;
let editTimeModal = null;
let editOrderModal = null;
let editUserModal = null;

function editProductionsInfo() {
    fetch('/get_edit_productions_info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.username;
            document.getElementById('role').innerText = data.role;
        })
        .catch(error => console.error('Error:', error));
}

function getProductions() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('productionsTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a,b) => new Date(b[1]) - new Date(a[1]));

            data.forEach((production, index) => {
                const row = document.createElement('tr');
                const numberCell = document.createElement('td');
                const datetimeCell = document.createElement('td');
                const product_nameCell = document.createElement('td');
                const order_numCell = document.createElement('td');
                const product_uidCell = document.createElement('td');
                const usernameCell = document.createElement('td');
                const production_statusCell = document.createElement('td');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = production[1];
                product_nameCell.innerText = production[2];
                order_numCell.innerText = production[3];
                product_uidCell.innerText = production[4];
                usernameCell.innerText = production[5];
                production_statusCell.innerText = production[6]
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                row.appendChild(product_nameCell);
                row.appendChild(order_numCell);
                row.appendChild(product_uidCell);
                row.appendChild(usernameCell);
                row.appendChild(production_statusCell);
                tableBody.appendChild(row);

                row.dataset.uid = production[4];
                row.addEventListener("click", (event) => {
                    //alert(production[4]);
                    activateRow(event.currentTarget);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function activateRow(row) {
    document.querySelectorAll('#productionsTableBody tr').forEach(r => r.classList.remove('table-active'));
    row.classList.add('table-active')
    productionUid = row.dataset.uid;
    //alert(productionUid);
}
//---изменение времени в таблице---
document.getElementById('editProductionTimeButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody tr.table-active');
    if (activeRow) {
        //productionUid = activeRow.dataset.uid;
        editTimeModal = new bootstrap. Modal(document.getElementById('editTimeModal'));
        editTimeModal.show();
    } else {
        productionUid = null;
        editTimeModal = null;
        alert('Выберите строку для редактирования!');
    }
});
document.getElementById('saveTimeButton').addEventListener('click', function () {
    const newDatetime = document.getElementById('newDatetime').value;
    if (newDatetime) {
        fetch('/update_production_time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productionUid: productionUid,
                newDatetime: newDatetime
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            //const editTimeModal = new bootstrap.Modal(document.getElementById('editTimeModal'));
            editTimeModal.hide();
            editTimeModal = null;
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
    document.getElementById('newDatetime').value = '';
});

//---изменение номера ШПЗ в таблице---
document.getElementById('editProductionOrderButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody tr.table-active');
    if (activeRow) {
        //productionUid = activeRow.dataset.uid;
        editOrderModal = new bootstrap. Modal(document.getElementById('editOrderModal'));
        editOrderModal.show();
    } else {
        productionUid = null;
        editOrderModal = null;
        alert('Выберите строку для редактирования!');
    }
});
document.getElementById('saveOrderButton').addEventListener('click', function () {
    const newOrder = document.getElementById('newOrder').value;
    if (newOrder) {
        fetch('/update_production_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productionUid: productionUid,
                newOrder: newOrder
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            //const editTimeModal = new bootstrap.Modal(document.getElementById('editTimeModal'));
            editOrderModal.hide();
            editOrderModal = null;
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
    document.getElementById('newOrder').value = '';
});

//---изменение пользователя в таблице---
document.getElementById('editProductionUserButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody tr.table-active');
    if (activeRow) {
        //productionUid = activeRow.dataset.uid;
        editUserModal = new bootstrap. Modal(document.getElementById('editUserModal'));
        editUserModal.show();
    } else {
        productionUid = null;
        editUserModal = null;
        alert('Выберите строку для редактирования!');
    }
});
document.getElementById('saveUserButton').addEventListener('click', function () {
    const newUser = document.getElementById('newUser').value;
    if (newUser) {
        fetch('/update_production_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productionUid: productionUid,
                newUser: newUser
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            //const editTimeModal = new bootstrap.Modal(document.getElementById('editTimeModal'));
            editUserModal.hide();
            editUserModal = null;
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
    document.getElementById('newUser').value = '';
});

//---удаление записи в таблице---
document.getElementById('deleteProductionButton').addEventListener('click', function () {
    const activeRow = document.querySelector('#productionsTableBody tr.table-active');
    if (activeRow) {
        fetch('/delete_production', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productionUid: productionUid,
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            //const editTimeModal = new bootstrap.Modal(document.getElementById('editTimeModal'));
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Выберите строку для удаления!')
    }
});

function getTime() {
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('datetime').innerText = data.datetime_value;
        })
        .catch(error => console.error('Error:', error));
}


window.onload = function() {
    editProductionsInfo();  // Вызываем функцию при загрузке страницы
    setInterval(getTime, 1000);  // Обновляем данные каждую секунду
    getProductions();  // Загружаем продукты при загрузке страницы
};
function editProductionsInfo() {
    fetch('/get_info')
        .then(response => response.json())
        .then(data => {
            sessionUsername = data.username;
            document.getElementById('username').innerText = sessionUsername;
            sessionRole = data.role;
            document.getElementById('role').innerText = sessionRole;

            if ((data.product_name) != null) {
                sessionProductName = data.product_name;
            }
            if ((data.order_num) != null) {
                sessionOrderNum = data.order_num;
            }
        })
        .catch(error => console.error('Error:', error));
}

function getProductions() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            // console.log('Server response:', data);
            const gridBody = document.getElementById('productionsTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));

            data.forEach((production, index) => {
                const row = document.createElement('div');
                row.classList.add('grid_production-row');

                const numberCell = document.createElement('div');
                const datetimeCell = document.createElement('div');
                const product_nameCell = document.createElement('div');
                const order_numCell = document.createElement('div');
                const product_uidCell = document.createElement('div');
                const serial_numCell = document.createElement('div');
                const usernameCell = document.createElement('div');
                const production_statusCell = document.createElement('div');
                const qc_statusCell = document.createElement('div');
                const qc_return_quantityCell = document.createElement('div');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = new Date(production.datetime).toLocaleString(); // Преобразование времени
                product_nameCell.innerText = production.product_name;
                order_numCell.innerText = production.order_num;
                product_uidCell.innerText = production.product_uid;
                serial_numCell.innerText = production.serial_num;
                usernameCell.innerText = production.username;
                production_statusCell.innerText = production.production_status;
                qc_statusCell.innerText = production.qc_status;
                qc_return_quantityCell.innerText = production.qc_return_quantity;
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                row.appendChild(product_nameCell);
                row.appendChild(order_numCell);
                row.appendChild(product_uidCell);
                row.appendChild(serial_numCell);
                row.appendChild(usernameCell);
                row.appendChild(production_statusCell);
                row.appendChild(qc_statusCell);
                row.appendChild(qc_return_quantityCell);
                gridBody.appendChild(row);

                row.dataset.uid = production.product_uid;
                row.addEventListener("click", (event) => {
                    //alert(production.product_uid);
                    activateRow(event.currentTarget);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function activateRow(row) {
    document.querySelectorAll('#productionsTableBody .grid_production-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row')
    productionUid = row.dataset.uid;
    //alert(productionUid);
}
// ---Изменение времени в таблице---
// Открытие модального окна
document.getElementById('editProductionTimeButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        editTimeModal = new bootstrap. Modal(document.getElementById('editTimeModal'));
        editTimeModal.show();
    } else {
        productionUid = null;
        editTimeModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При нажатии кнопки модального окна
document.getElementById('saveTimeButton').addEventListener('click', function () {
    const newDatetime = new Date(document.getElementById('newDatetime').value);
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
            editTimeModal.hide();
            editTimeModal = null;
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Изменение номера ШПЗ в таблице---
// Открытие модального окна
document.getElementById('editProductionOrderButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        document.getElementById('newOrder').value = '';
        editOrderModal = new bootstrap. Modal(document.getElementById('editOrderModal'));
        editOrderModal.show();
    } else {
        productionUid = null;
        editOrderModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При открытии модального окна
document.getElementById('editOrderModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('newOrder').focus();
})
// При нажатии кнопки модального окна
document.getElementById('editOrderForm').addEventListener('submit', function (event) {
    event.preventDefault();
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
            editOrderModal.hide();
            editOrderModal = null;
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Изменение пользователя в таблице---
function getUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            const newUser = document.getElementById('newUser');
            newUser.innerHTML = '';  // Очищаем список

            data.forEach(user => {
                if (user.role !== 'admin') {
                    const option = document.createElement('option');
                    option.value = user.username; // Предполагаем, что user[1] содержит имя пользователя
                    option.innerText = user.username;
                    newUser.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}
// Открытие модального окна
document.getElementById('editProductionUserButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editUserModal.show();
        getUsers();  // Загружаем список пользователей
    } else {
        productionUid = null;
        editUserModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При нажатии кнопки модального окна
document.getElementById('saveUserButton').addEventListener('click', function() {
    const selectedUser = document.getElementById('newUser').value;
    if (selectedUser) {
        fetch('/update_production_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productionUid: productionUid,
                newUser: selectedUser
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editUserModal.hide();
            editUserModal = null;
            productionUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Удаление записи в таблице---
// Открытие модального окна
document.getElementById('deleteProductionButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        deleteProductionModal = new bootstrap. Modal(document.getElementById('deleteProductionModal'));
        deleteProductionModal.show();
    } else {
        productionUid = null;
        deleteProductionModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При нажатии кнопки модального окна
document.getElementById('applyDeleteProductionButton').addEventListener('click', function () {
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
        deleteProductionModal.hide();
        deleteProductionModal = null;
        productionUid = null;
        getProductions();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
});

// --- Сброс фильтра ---
document.getElementById('clearFilterButton').addEventListener('click', clearFilter);
// Фильтр
function clearFilter() {
    getProductions();  // Сбрасываем фильтр, загружая все данные
}

// --- Фильтрация по времени ---
document.getElementById('timeFilterButton').addEventListener('click', function() {
    // document.getElementById('startDatetime').value = '';
    // document.getElementById('endDatetime').value = '';
    timeFilterModal = new bootstrap.Modal(document.getElementById('timeFilterModal'));
    timeFilterModal.show();
});
// При нажатии кнопки модального окна
document.getElementById('applyTimeFilterButton').addEventListener('click', function () {
    const startDatetime = document.getElementById('startDatetime').value;
    const endDatetime = document.getElementById('endDatetime').value;
    if (startDatetime && endDatetime) {
        const startDate = new Date(startDatetime);
        const endDate = new Date(endDatetime);

        if (endDate >= startDate) {
            filterByTime(startDatetime, endDatetime);
            timeFilterModal.hide();
            timeFilterModal = null;
        } else {
            alert('Конечная дата должна быть больше или равна начальной дате!');
        }
    } else {
        alert('Установите временной интервал!');
    }
});// Фильтр
function filterByTime(startDatetime, endDatetime) {
    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);
    // console.log('Start Date:', startDate, 'End Date:', endDate); // Логирование дат
    filterProductions((production) => {
        const productionDate = new Date(production.datetime);
        // console.log('Production Date:', productionDate); // Логирование даты производства
        return productionDate >= startDate && productionDate <= endDate;
    });
}

// --- Фильтрация по изделию ---
function getProductionsProducts() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const productSelect = document.getElementById('productSelect');
            productSelect.innerHTML = '';  // Очищаем список

            // Создаем Set для хранения уникальных номеров ШПЗ
            const uniqueProducts = new Set();

            data.forEach(production => {
                const productName = production.product_name;  // Предполагаем, что production[2] содержит наименование изделия
                if (!uniqueProducts.has(productName)) {
                    uniqueProducts.add(productName);
                    const option = document.createElement('option');
                    option.value = productName;
                    option.innerText = productName;
                    productSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}
// Открытие модального окна
document.getElementById('productFilterButton').addEventListener('click', function() {
    productFilterModal = new bootstrap.Modal(document.getElementById('productFilterModal'));
    productFilterModal.show();
    getProductionsProducts();  // Загружаем список изделий
});
// При нажатии кнопки модального окна
document.getElementById('applyProductFilterButton').addEventListener('click', function() {
    const selectedProduct = document.getElementById('productSelect').value;
    if (selectedProduct) {
        filterByProduct(selectedProduct);
        productFilterModal.hide();
        productFilterModal = null;
    } else {
        alert('Выберите изделие из списка!');
    }
});
// Фильтр
function filterByProduct(productName) {
    filterProductions((production) => production.product_name.includes(productName));
}

// --- Фильтрация по номеру ШПЗ ---
function getProductionsOrders() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const orderSelect = document.getElementById('orderSelect');
            orderSelect.innerHTML = '';  // Очищаем список

            // Создаем Set для хранения уникальных номеров ШПЗ
            const uniqueOrders = new Set();

            data.forEach(production => {
                const orderNum = production.order_num;  // Предполагаем, что production[3] содержит номер ШПЗ
                if (!uniqueOrders.has(orderNum)) {
                    uniqueOrders.add(orderNum);
                    const option = document.createElement('option');
                    option.value = orderNum;
                    option.innerText = orderNum;
                    orderSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}
// Открытие модального кона
document.getElementById('orderFilterButton').addEventListener('click', function() {
    orderFilterModal = new bootstrap.Modal(document.getElementById('orderFilterModal'));
    orderFilterModal.show();
    getProductionsOrders();  // Загружаем список ШПЗ
});
// При нажатии кнопки модального окна
document.getElementById('applyOrderFilterButton').addEventListener('click', function() {
    const selectedOrder = document.getElementById('orderSelect').value;
    if (selectedOrder) {
        filterByOrder(selectedOrder);
        orderFilterModal.hide();
        orderFilterModal = null;
    } else {
        alert('Выберите номер ШПЗ из списка!');
    }
});
// Фильтр
function filterByOrder(orderNum) {
    filterProductions((production) => production.order_num.includes(orderNum));
}

// --- Фильтрация по UID ---
// Открытие модального окна
document.getElementById('uidFilterButton').addEventListener('click', function() {
    document.getElementById('filterUid').value = '';
    uidFilterModal = new bootstrap.Modal(document.getElementById('uidFilterModal'));
    uidFilterModal.show();
});
// При открытии модального окна
document.getElementById('uidFilterModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('filterUid').focus();
})
// При нажатии кнопки модального окна
document.getElementById('filterUidForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const filterUid = document.getElementById('filterUid').value;
    if (filterUid) {
        filterByUid(filterUid);
        uidFilterModal.hide();
        uidFilterModal = null;
    } else {
        alert('Введите UID изделия!');
    }
});
// Фильтр
function filterByUid(productUid) {
    const transliterateUid = transliterate(productUid)
    filterProductions((production) => production.product_uid.includes(transliterateUid));
}

// ---Фильтрация по S/N---
// Открытие модального окна
document.getElementById('serialNumFilterButton').addEventListener('click', function() {
    document.getElementById('filterSerialNum').value = '';
    serialNumFilterModal = new bootstrap.Modal(document.getElementById('serialNumFilterModal'));
    serialNumFilterModal.show();
});
// При открытии модального окна
document.getElementById('serialNumFilterModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('filterSerialNum').focus();
})
// При нажатии кнопки модального окна
document.getElementById('filterSerialNumForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const filterSerialNum = document.getElementById('filterSerialNum').value;
    if (filterSerialNum) {
        filterBySerialNum(filterSerialNum);
        serialNumFilterModal.hide();
        serialNumFilterModal = null;
    } else {
        alert('Введите серийный номер изделия!');
    }
});
// Фильтр
function filterBySerialNum(serialNum) {
    filterProductions((production) => production.serial_num.includes(serialNum));
}

// ---Фильтрация по пользователю---
function getProductionsUsers() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const userSelect = document.getElementById('userSelect');
            userSelect.innerHTML = '';  // Очищаем список

            // Создаем Set для хранения уникальных имён
            const uniqueUsers = new Set();

            data.forEach(production => {
                const username = production.username;  // Предполагаем, что production[5] содержит имя пользователя
                if (!uniqueUsers.has(username)) {
                    uniqueUsers.add(username);
                    const option = document.createElement('option');
                    option.value = username;
                    option.innerText = username;
                    userSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}
// Открытие модального окна
document.getElementById('userFilterButton').addEventListener('click', function() {
    userFilterModal = new bootstrap.Modal(document.getElementById('userFilterModal'));
    userFilterModal.show();
    getProductionsUsers();  // Загружаем список ШПЗ
});
// При нажатии кнопки модального окна
document.getElementById('applyUserFilterButton').addEventListener('click', function() {
    const selectedUser = document.getElementById('userSelect').value;
    if (selectedUser) {
        filterByUser(selectedUser);
        userFilterModal.hide();
        document.getElementById('userSelect').value = '';
        userFilterModal = null;
    } else {
        alert('Выберите пользователя из списка!');
    }
});
// Фильтр
function filterByUser(username) {
    filterProductions((production) => production.username.includes(username));
}

// ---Общая функция для фильтрации---
function filterProductions(filterFunction) {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('productionsTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

            data.forEach((production, index) => {
                if (filterFunction(production)) {
                    // console.log('Server response:', data);
                    const row = document.createElement('div');
                    row.classList.add('grid_production-row');

                    const numberCell = document.createElement('div');
                    const datetimeCell = document.createElement('div');
                    const product_nameCell = document.createElement('div');
                    const order_numCell = document.createElement('div');
                    const product_uidCell = document.createElement('div');
                    const serial_numCell = document.createElement('div');
                    const usernameCell = document.createElement('div');
                    const production_statusCell = document.createElement('div');
                    const qc_statusCell = document.createElement('div');
                    const qc_return_quantityCell = document.createElement('div');

                    numberCell.innerText = index + 1;
                    datetimeCell.innerText = new Date(production.datetime).toLocaleString(); // Преобразование времени
                    product_nameCell.innerText = production.product_name;
                    order_numCell.innerText = production.order_num;
                    product_uidCell.innerText = production.product_uid;
                    serial_numCell.innerText = production.serial_num;
                    usernameCell.innerText = production.username;
                    production_statusCell.innerText = production.production_status;
                    qc_statusCell.innerText = production.qc_status;
                    qc_return_quantityCell.innerText = production.qc_return_quantity;
                    row.appendChild(numberCell);
                    row.appendChild(datetimeCell);
                    row.appendChild(product_nameCell);
                    row.appendChild(order_numCell);
                    row.appendChild(product_uidCell);
                    row.appendChild(serial_numCell);
                    row.appendChild(usernameCell);
                    row.appendChild(production_statusCell);
                    row.appendChild(qc_statusCell);
                    row.appendChild(qc_return_quantityCell);
                    gridBody.appendChild(row);

                    row.dataset.uid = production.product_uid;
                    row.addEventListener("click", (event) => {
                        //alert(production.product_uid);
                        activateRow(event.currentTarget);
                    });
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

// Функция для кнопки "НАЗАД"
document.getElementById('prev_button').addEventListener('click', function () {
    if (sessionProductName !== null) {
         window.location.href = '/productions';
    } else {
        window.location.href = '/select_product';
    }
});

window.onload = function() {

    getTime();
    getWorkplaceName();
    editProductionsInfo();  // Вызываем функцию при загрузке страницы
    getProductions();  // Загружаем продукты при загрузке страницы
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};
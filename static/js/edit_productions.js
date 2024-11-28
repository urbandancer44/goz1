let productionUid = null;
let productFilterModal = null;
let timeFilterModal = null;
let orderFilterModal = null;
let uidFilterModal = null;
let userFilterModal = null;
let serialNumFilterModal = null;
let editTimeModal = null;
let editOrderModal = null;
let editUserModal = null;
let deleteProductionModal = null;

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
                const serial_numCell = document.createElement('td');
                const usernameCell = document.createElement('td');
                const production_statusCell = document.createElement('td');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = production[1];
                product_nameCell.innerText = production[2];
                order_numCell.innerText = production[3];
                product_uidCell.innerText = production[4];
                serial_numCell.innerText = production[7];
                usernameCell.innerText = production[5];
                production_statusCell.innerText = production[6]
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                row.appendChild(product_nameCell);
                row.appendChild(order_numCell);
                row.appendChild(product_uidCell);
                row.appendChild(serial_numCell);
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
// ---Изменение времени в таблице---
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
            editTimeModal.hide();
            document.getElementById('newDatetime').value = '';
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
            editOrderModal.hide();
            document.getElementById('newOrder').value = '';
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
                if (user[3] !== 'admin') {
                    const option = document.createElement('option');
                    option.value = user[1]; // Предполагаем, что user[1] содержит имя пользователя
                    option.innerText = user[1];
                    newUser.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('editProductionUserButton').addEventListener('click', function() {
    editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
    getUsers();  // Загружаем список пользователей
});

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
            document.getElementById('newUser').value = '';
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
document.getElementById('deleteProductionButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody tr.table-active');
    if (activeRow) {
        deleteProductionModal = new bootstrap. Modal(document.getElementById('deleteProductionModal'));
        deleteProductionModal.show();
    } else {
        productionUid = null;
        deleteProductionModal = null;
        alert('Выберите строку для редактирования!');
    }
});
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

// ---Отображение времени---
function getTime() {
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('datetime').innerText = data.datetime_value;
        })
        .catch(error => console.error('Error:', error));
}

// ---Сброс фильтра---
document.getElementById('clearFilterButton').addEventListener('click', clearFilter);

function clearFilter() {
    getProductions();  // Сбрасываем фильтр, загружая все данные
}

// ---Фильтрация по времени---
document.getElementById('timeFilterButton').addEventListener('click', function() {
    timeFilterModal = new bootstrap.Modal(document.getElementById('timeFilterModal'));
    timeFilterModal.show();
});

document.getElementById('applyTimeFilterButton').addEventListener('click', function () {
    const startDatetime = document.getElementById('startDatetime').value;
    const endDatetime = document.getElementById('endDatetime').value;
    if (startDatetime && endDatetime) {
        filterByTime(startDatetime, endDatetime);
        timeFilterModal.hide();
        document.getElementById('startDatetime').value = '';
        document.getElementById('endDatetime').value = '';
        timeFilterModal = null;
    } else {
        alert('Установите временной интервал!');
    }
});

function filterByTime(startDatetime, endDatetime) {
    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);
    filterProductions((production) => {
        const productionDate = new Date(production[1]);
        return productionDate >= startDate && productionDate <= endDate
    });
}

// ---Фильтрация по изделию---
function getProducts() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const productSelect = document.getElementById('productSelect');
            productSelect.innerHTML = '';  // Очищаем список

            // Создаем Set для хранения уникальных номеров ШПЗ
            const uniqueProducts = new Set();

            data.forEach(production => {
                const productName = production[2];  // Предполагаем, что production[2] содержит наименование изделия
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

document.getElementById('productFilterButton').addEventListener('click', function() {
    productFilterModal = new bootstrap.Modal(document.getElementById('productFilterModal'));
    productFilterModal.show();
    getProducts();  // Загружаем список изделий
});

document.getElementById('applyProductFilterButton').addEventListener('click', function() {
    const selectedProduct = document.getElementById('productSelect').value;
    if (selectedProduct) {
        filterByProduct(selectedProduct);
        productFilterModal.hide();
        document.getElementById('productSelect').value = '';
        productFilterModal = null;
    } else {
        alert('Выберите изделие из списка!');
    }
});

function filterByProduct(productName) {
    filterProductions((production) => production[2].includes(productName));
}

// ---Фильтрация по номеру ШПЗ---
function getOrders() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const orderSelect = document.getElementById('orderSelect');
            orderSelect.innerHTML = '';  // Очищаем список

            // Создаем Set для хранения уникальных номеров ШПЗ
            const uniqueOrders = new Set();

            data.forEach(production => {
                const orderNum = production[3];  // Предполагаем, что production[3] содержит номер ШПЗ
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

document.getElementById('orderFilterButton').addEventListener('click', function() {
    orderFilterModal = new bootstrap.Modal(document.getElementById('orderFilterModal'));
    orderFilterModal.show();
    getOrders();  // Загружаем список ШПЗ
});

document.getElementById('applyOrderFilterButton').addEventListener('click', function() {
    const selectedOrder = document.getElementById('orderSelect').value;
    if (selectedOrder) {
        filterByOrder(selectedOrder);
        orderFilterModal.hide();
        document.getElementById('orderSelect').value = '';
        orderFilterModal = null;
    } else {
        alert('Выберите номер ШПЗ из списка!');
    }
});

function filterByOrder(orderNum) {
    filterProductions((production) => production[3].includes(orderNum));
}

// ---Фильтрация по UID---
document.getElementById('uidFilterButton').addEventListener('click', function() {
    uidFilterModal = new bootstrap.Modal(document.getElementById('uidFilterModal'));
    uidFilterModal.show();
});

document.getElementById('applyUidFilterButton').addEventListener('click', function () {
    const filterUid = document.getElementById('filterUid').value;
    if (filterUid) {
        filterByUid(filterUid);
        uidFilterModal.hide();
        document.getElementById('filterUid').value = '';
        uidFilterModal = null;
    } else {
        alert('Введите UID изделия!');
    }
});

function filterByUid(productUid) {
    const transliterateUid = transliterate(productUid)
    filterProductions((production) => production[4].includes(transliterateUid));
}

// ---Фильтрация по S/N---
document.getElementById('serialNumFilterButton').addEventListener('click', function() {
    serialNumFilterModal = new bootstrap.Modal(document.getElementById('serialNumFilterModal'));
    serialNumFilterModal.show();
});

document.getElementById('applySerialNumFilterButton').addEventListener('click', function () {
    const filterSerialNum = document.getElementById('filterSerialNum').value;
    if (filterSerialNum) {
        filterBySerialNum(filterSerialNum);
        serialNumFilterModal.hide();
        document.getElementById('filterSerialNum').value = '';
        serialNumFilterModal = null;
    } else {
        alert('Введите серийный номер изделия!');
    }
});

function filterBySerialNum(serialNum) {
    filterProductions((production) => production[7].includes(serialNum));
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
                const username = production[5];  // Предполагаем, что production[5] содержит имя пользователя
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

document.getElementById('userFilterButton').addEventListener('click', function() {
    userFilterModal = new bootstrap.Modal(document.getElementById('userFilterModal'));
    userFilterModal.show();
    getProductionsUsers();  // Загружаем список ШПЗ
});

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

function filterByUser(username) {
    filterProductions((production) => production[5].includes(username));
}

// ---Общая функция для фильтрации---
function filterProductions(filterFunction) {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('productionsTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a, b) => new Date(b[1]) - new Date(a[1]));

            data.forEach((production, index) => {
                if (filterFunction(production)) {
                    const row = document.createElement('tr');
                    const numberCell = document.createElement('td');
                    const datetimeCell = document.createElement('td');
                    const product_nameCell = document.createElement('td');
                    const order_numCell = document.createElement('td');
                    const product_uidCell = document.createElement('td');
                    const serial_numCell = document.createElement('td');
                    const usernameCell = document.createElement('td');
                    const production_statusCell = document.createElement('td');

                    numberCell.innerText = index + 1;
                    datetimeCell.innerText = production[1];
                    product_nameCell.innerText = production[2];
                    order_numCell.innerText = production[3];
                    product_uidCell.innerText = production[4];
                    serial_numCell.innerText = production[7];
                    usernameCell.innerText = production[5];
                    production_statusCell.innerText = production[6];
                    row.appendChild(numberCell);
                    row.appendChild(datetimeCell);
                    row.appendChild(product_nameCell);
                    row.appendChild(order_numCell);
                    row.appendChild(product_uidCell);
                    row.appendChild(serial_numCell);
                    row.appendChild(usernameCell);
                    row.appendChild(production_statusCell);
                    tableBody.appendChild(row);

                    row.dataset.uid = production[4];
                    row.addEventListener("click", (event) => {
                        //alert(production[4]);
                        activateRow(event.currentTarget);
                    });
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

function transliterate(text) {
    const translitMap = {
        'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
        'х': '[', 'ъ': ']', 'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k',
        'д': 'l', 'ж': ';', 'э': '\'', 'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm',
        'б': ',', 'ю': '.', 'ё': '`',
        'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
        'Х': '{', 'Ъ': '}', 'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K',
        'Д': 'L', 'Ж': ':', 'Э': '"', 'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M',
        'Б': '<', 'Ю': '>', 'Ё': '~'
    };

    return text.split('').map(char => translitMap[char] || char).join('');
}

window.onload = function() {
    editProductionsInfo();  // Вызываем функцию при загрузке страницы
    setInterval(getTime, 1000);  // Обновляем данные каждую секунду
    getProductions();  // Загружаем продукты при загрузке страницы
};
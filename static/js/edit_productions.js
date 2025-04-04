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
                row.dataset.product_name = production.product_name;
                row.dataset.qc_return_quantity = production.qc_return_quantity;
                row.dataset.username = production.username;
                row.dataset.production_status = production.production_status;
                row.addEventListener("click", (event) => {
                    //alert(production.product_name);
                    activateRow(event.currentTarget);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function activateRow(row) {
    document.querySelectorAll('#productionsTableBody .grid_production-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row')
    sessionProductUID = row.dataset.uid;
    sessionProductName = row.dataset.product_name;
    sessionQcReturnQuantity = Number(row.dataset.qc_return_quantity);
    sessionUsername = row.dataset.username;
    sessionProductionStatus = Number(row.dataset.production_status);
    // getPictureName(sessionProductName);
    getProductionControl(sessionProductUID);
    getQualityControl(sessionProductUID);

    // if (sessionQcReturnQuantity > 0) {
    //     getQualityControl(sessionProductUID);
    // } else {
    //     const gridBody = document.getElementById('quality_controlTableBody');
    //         gridBody.innerHTML = '';  // Очищаем таблицу
    // }
    //alert(sessionProductName);
}

function getQualityControl(productUID) {
    let filteredData = null;
    fetch('/get_quality_control')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('quality_controlTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));

            if (productUID != null) {
                filteredData = data.filter(quality_control => { // Фильтруем данные: оставляем только записи с выделенным UID
                    const product_uid = quality_control.product_uid;
                    return product_uid === productUID;
                });
            } else {
                filteredData = data;    // Оставляем начальные данные
            }

            // Отображаем отфильтрованные данные
            filteredData.forEach((quality_control, index) => {
                const row = document.createElement('div');
                row.classList.add('grid_quality_control-row');

                const numberCell = document.createElement('div');
                const datetimeCell = document.createElement('div');
                // const product_uidCell = document.createElement('div');
                const usernameCell = document.createElement('div');
                const production_statusCell = document.createElement('div');
                const qc_usernameCell = document.createElement('div');
                const qc_statusCell = document.createElement('div');
                const qc_commentCell = document.createElement('div');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = new Date(quality_control.datetime).toLocaleString(); // Преобразование времени
                // product_uidCell.innerText = quality_control.product_uid;
                usernameCell.innerText = quality_control.username;
                production_statusCell.innerText = quality_control.production_status;
                qc_usernameCell.innerText = quality_control.qc_username;
                qc_statusCell.innerText = quality_control.qc_status;
                qc_commentCell.innerText = quality_control.qc_comment;
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                // row.appendChild(product_uidCell);
                row.appendChild(usernameCell);
                row.appendChild(production_statusCell);
                row.appendChild(qc_usernameCell);
                row.appendChild(qc_statusCell);
                row.appendChild(qc_commentCell);
                gridBody.appendChild(row);

                row.dataset.id = quality_control.id;
                row.dataset.qc_uid = quality_control.product_uid;
                row.dataset.qc_comment = quality_control.qc_comment;
                row.addEventListener("click", (event) => {
                    activateQualityRow(event.currentTarget);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function activateQualityRow(row) {
    document.querySelectorAll('#quality_controlTableBody .grid_quality_control-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row')
    sessionQualityID = Number(row.dataset.id);
    sessionQualityUID = row.dataset.qc_uid;
}

function getProductionControl(productUID) {
    let filteredData = null;
    fetch('/get_production_control')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('production_controlTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));

            if (productUID != null) {
                filteredData = data.filter(production_control => { // Фильтруем данные: оставляем только записи с выделенным UID
                    const product_uid = production_control.product_uid;
                    return product_uid === productUID;
                });
            } else {
                filteredData = data;    // Оставляем начальные данные
            }

            // Отображаем отфильтрованные данные
            filteredData.forEach((production_control, index) => {
                const row = document.createElement('div');
                row.classList.add('grid_production_control-row');

                const numberCell = document.createElement('div');
                const datetimeCell = document.createElement('div');
                // const product_uidCell = document.createElement('div');
                const usernameCell = document.createElement('div');
                const production_statusCell = document.createElement('div');
                // const qc_usernameCell = document.createElement('div');
                // const qc_statusCell = document.createElement('div');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = new Date(production_control.datetime).toLocaleString(); // Преобразование времени
                // product_uidCell.innerText = production_control.product_uid;
                usernameCell.innerText = production_control.username;
                production_statusCell.innerText = production_control.production_status;
                // qc_usernameCell.innerText = production_control.qc_username;
                // qc_statusCell.innerText = production_control.qc_status;
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                // row.appendChild(product_uidCell);
                row.appendChild(usernameCell);
                row.appendChild(production_statusCell);
                // row.appendChild(qc_usernameCell);
                // row.appendChild(qc_statusCell);
                gridBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// ---Изменение времени в таблице---
// Открытие модального окна
document.getElementById('editProductionTimeButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        editTimeModal = new bootstrap.Modal(document.getElementById('editTimeModal'));
        editTimeModal.show();
    } else {
        sessionProductUID = null;
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
                productionUid: sessionProductUID,
                newDatetime: newDatetime
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editTimeModal.hide();
            editTimeModal = null;
            sessionProductUID = null;
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
        editOrderModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
        editOrderModal.show();
    } else {
        sessionProductUID = null;
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
                productionUid: sessionProductUID,
                newOrder: newOrder
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editOrderModal.hide();
            editOrderModal = null;
            sessionProductUID = null;
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
        sessionProductUID = null;
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
                productionUid: sessionProductUID,
                newUser: selectedUser
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editUserModal.hide();
            editUserModal = null;
            sessionProductUID = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Удаление записи в таблице производства---
// Открытие модального окна
document.getElementById('deleteProductionButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        deleteProductionModal = new bootstrap.Modal(document.getElementById('deleteProductionModal'));
        deleteProductionModal.show();
    } else {
        sessionProductUID = null;
        deleteProductionModal = null;
        alert('Выберите строку для удаления!');
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
            productionUid: sessionProductUID,
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        deleteProductionModal.hide();
        deleteProductionModal = null;
        sessionProductUID = null;
        getProductions();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
});

// ---Удаление записи в таблице качества---
// Открытие модального окна
document.getElementById('deleteQualityButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#quality_controlTableBody .grid_quality_control-row.active-row');
    if (activeRow) {
        deleteQualityModal = new bootstrap.Modal(document.getElementById('deleteQualityModal'));
        deleteQualityModal.show();
    } else {
        sessionQualityID = null;
        deleteQualityModal = null;
        alert('Выберите строку для удаления!');
    }
});
// При нажатии кнопки модального окна
document.getElementById('applyDeleteQualityButton').addEventListener('click', function () {
    fetch('/delete_quality_control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quality_controlID: sessionQualityID,
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        deleteQualityModal.hide();
        deleteQualityModal = null;
        sessionQualityID = null;
        getQualityControl(sessionProductUID);   // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));

    fetch('/sub_quality', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productionUid: sessionProductUID,
            newQcReturnQuantity: sessionQcReturnQuantity - 1
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        getProductions();    // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
});

// --- Сброс фильтра ---
document.getElementById('clearFilterButton').addEventListener('click', clearFilter);
// Фильтр
function clearFilter() {
    getProductions();  // Сбрасываем фильтр, загружая все данные
    const gridBodyQuality = document.getElementById('quality_controlTableBody');
            gridBodyQuality.innerHTML = '';  // Очищаем таблицу
    const gridBodyProduction = document.getElementById('production_controlTableBody');
            gridBodyProduction.innerHTML = '';  // Очищаем таблицу
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
            getQualityControl();

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

// ---Фильтрация по статусу--
// Открытие модального окна
document.getElementById('statusFilterButton').addEventListener('click', function() {
    // document.getElementById('filterStatus').value = null;
    statusFilterModal = new bootstrap.Modal(document.getElementById('statusFilterModal'));
    statusFilterModal.show();
});

// При нажатии кнопки модального окна
document.getElementById('filterStatusForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedStatus = Number(document.getElementById('statusSelect').value);
    if (selectedStatus) {
        filterByStatus(selectedStatus);
        statusFilterModal.hide();
        statusFilterModal = null;
        sessionProductUID = null;
    } else {
        alert('Выберите статус производства из списка!');
    }
});

// Фильтр
function filterByStatus(status) {
    // Фильтруем записи, где production_status строго равен введённому статусу
    filterProductions((production) => {
        // Преобразуем статус из данных в число (на случай, если он приходит как строка)
        const productionStatus = Number(production.production_status);
        return productionStatus === status;
    });
}

// ---Фильтрация по статусу проверки--
// Открытие модального окна
document.getElementById('qcStatusFilterButton').addEventListener('click', function() {
    qcStatusFilterModal = new bootstrap.Modal(document.getElementById('qcStatusFilterModal'));
    qcStatusFilterModal.show();
});

// При нажатии кнопки модального окна
document.getElementById('filterQcStatusForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedQcStatus = document.getElementById('qcStatusSelect').value;
    if (selectedQcStatus != null) {
        filterByQcStatus(selectedQcStatus);
        qcStatusFilterModal.hide();
        qcStatusFilterModal = null;
    } else {
        alert('Выберите статус проверки из списка!');
    }
});

// Фильтр
function filterByQcStatus(qcStatus) {
    // Фильтруем записи, где qc_status строго равен введённому статусу
    filterProductions((production) => {
        const productionStatus = production.qc_status;
        return productionStatus === qcStatus;
    });
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
                    row.dataset.product_name = production.product_name;
                    row.dataset.qc_return_quantity = production.qc_return_quantity;
                    row.dataset.username = production.username;
                    row.dataset.production_status = production.production_status;
                    row.addEventListener("click", (event) => {
                        //alert(production.product_name);
                        activateRow(event.currentTarget);
                    });
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

// Функция для кнопки "НАЗАД"
document.getElementById('prev_button').addEventListener('click', function () {
    if (sessionOrderNum !== null) {
        window.location.href = '/productions';
    } else {
        window.location.href = '/select_product';
    }
    if (currentWorkplaceID === '6') {
        window.location.href = '/flying_test';
    }
    if (currentWorkplaceID === '7') {
        window.location.href = '/package_control';
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
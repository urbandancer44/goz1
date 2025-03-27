function qualityControlInfo() {
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

function getQualityProductions() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('productionsTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));

            // Фильтруем данные: оставляем только записи с пустым статусом и NG
            const filteredData = data.filter(production => {
                const qc_status = production.qc_status;
                return qc_status !== 'OK';
            });

            // Отображаем отфильтрованные данные
            filteredData.forEach((production, index) => {
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
    document.getElementById('product_img').src = "";
}

function activateRow(row) {
    document.querySelectorAll('#productionsTableBody .grid_production-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row')
    sessionProductUID = row.dataset.uid;
    sessionProductName = row.dataset.product_name;
    sessionQcReturnQuantity = Number(row.dataset.qc_return_quantity);
    sessionUsername = row.dataset.username;
    sessionProductionStatus = Number(row.dataset.production_status);
    getPictureName(sessionProductName);

    if (sessionQcReturnQuantity > 0) {
        getQualityControl(sessionProductUID);
    } else {
        const gridBody = document.getElementById('quality_controlTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу
    }
    //alert(sessionProductName);
}

function getQualityControl(productUID) {
    fetch('/get_quality_control')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('quality_controlTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));

            // // Фильтруем данные: оставляем только записи с выделенным UID
            const filteredData = data.filter(quality_control => {
                const product_uid = quality_control.product_uid;
                return product_uid === productUID;
            });
            // Отображаем отфильтрованные данные
            filteredData.forEach((quality_control, index) => {
                const row = document.createElement('div');
                row.classList.add('grid_quality_control-row');

                const numberCell = document.createElement('div');
                const datetimeCell = document.createElement('div');
                // const product_nameCell = document.createElement('div');
                // const product_uidCell = document.createElement('div');
                const usernameCell = document.createElement('div');
                const production_statusCell = document.createElement('div');
                const qc_usernameCell = document.createElement('div');
                const qc_statusCell = document.createElement('div');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = new Date(quality_control.datetime).toLocaleString(); // Преобразование времени
                // product_nameCell.innerText = quality_control.product_name;
                // product_uidCell.innerText = quality_control.product_uid;
                usernameCell.innerText = quality_control.username;
                production_statusCell.innerText = quality_control.production_status;
                qc_usernameCell.innerText = quality_control.qc_username;
                qc_statusCell.innerText = quality_control.qc_status;
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                // row.appendChild(product_nameCell);
                // row.appendChild(product_uidCell);
                row.appendChild(usernameCell);
                row.appendChild(production_statusCell);
                row.appendChild(qc_usernameCell);
                row.appendChild(qc_statusCell);
                gridBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function getPictureName(product_name) {
    // Получаем название изображения из имени продукта
    fetch('/get_picture_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_name: product_name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.picture_name) {
            const picture_name = data.picture_name;
            document.getElementById('product_img').src = "/static/img/products/" + picture_name;
        } else {
            console.log('Имя изображения не найдено');
        }
    })
    .catch(error => console.error('Error:', error));
}

// ---Сброс фильтра---
document.getElementById('clearFilterButton').addEventListener('click', clearFilter);
// Фильтр
function clearFilter() {
    getQualityProductions();  // Сбрасываем фильтр, загружая все данные
    const gridBody = document.getElementById('quality_controlTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу
}

// Функция изменения статуса качества
function updateQuality(new_qc_status) {
    let new_qc_return_quantity;
    if (new_qc_status === 'OK') {
        new_qc_return_quantity = sessionQcReturnQuantity;
    } else {
        new_qc_return_quantity = sessionQcReturnQuantity+1;
    }
    fetch('/update_quality', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productionUid: sessionProductUID,
            newQualityStatus: new_qc_status,
            newQcReturnQuantity: new_qc_return_quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        sessionProductUID = null;
        getQualityProductions();  // Перезагружаем таблицу после изменения
        // getQualityControl();
    })
    .catch(error => console.error('Error:', error));
}

// Нажатие кнопки OK. Открытие модального окна
document.getElementById('qualityOkButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        qualityOkModal = new bootstrap.Modal(document.getElementById('qualityOkModal'));
        qualityOkModal.show();
    } else {
        sessionProductUID = null;
        qualityOkModal = null;
        alert('Выберите строку с изделием!');
    }
});
// Нажатие кнопки подтверждения
document.getElementById('applyQualityOkButton').addEventListener('click', function () {
    updateQuality('OK');
    addQualityControl('OK');
    qualityOkModal.hide();
    qualityOkModal = null;
    sessionProductUID = null;
});

// Нажатие кнопки NG. Открытие модального окна
document.getElementById('qualityNgButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        qualityNgModal = new bootstrap.Modal(document.getElementById('qualityNgModal'));
        qualityNgModal.show();
    } else {
        sessionProductUID = null;
        qualityNgModal = null;
        alert('Выберите строку с изделием!');
    }
});
// Нажатие кнопки подтверждения
document.getElementById('applyQualityNgButton').addEventListener('click', function () {
    updateQuality('NG');
    addQualityControl('NG');
    qualityNgModal.hide();
    qualityNgModal = null;
    sessionProductUID = null;
});

//Функция добавления записи проверки качества
function addQualityControl(new_qc_status) {
    fetch('/add_quality_control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_name: sessionProductName,
            productionUid: sessionProductUID,
            username: sessionUsername,
            productionStatus: sessionProductionStatus,
            newQualityStatus: new_qc_status
        })
    })
    .then(response => response.json())
    .then(data => {
        // alert(data.message);
        sessionProductName = null;
        sessionProductUID = null;
        sessionUsername = null;
        sessionProductionStatus = 0;
        getQualityControl();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
}

// При нажатии кнопки выбора изделия
document.getElementById('filterUidForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const filterUid = document.getElementById('filterUid').value;
    if (filterUid) {
        filterByUid(filterUid);
        document.getElementById('filterUid').value = '';
        // uidFilterModal.hide();
        // uidFilterModal = null;
    } else {
        alert('Введите UID изделия!');
    }
});
// Фильтр
function filterByUid(productUid) {
    const transliterateUid = transliterate(productUid)
    filterQualityProductions((production) => production.product_uid.includes(transliterateUid));
     getQualityControl(transliterateUid);
}

// ---Общая функция для фильтрации---
function filterQualityProductions(filterFunction) {
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

document.addEventListener('click', function(event) {
    // Проверяем, что клик был не по таблице
    if (!event.target.closest('.grid_production-body')) {
        focusHiddenInput();
    }
});

function focusHiddenInput() {
    document.getElementById('filterUid').focus();
}

window.onload = function() {

    getTime();
    getWorkplaceName();
    focusHiddenInput();
    qualityControlInfo();  // Вызываем функцию при загрузке страницы
    getQualityProductions();  // Загружаем продукты при загрузке страницы
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};
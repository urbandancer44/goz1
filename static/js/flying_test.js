function flyingTestInfo() {
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

            const editProductionsButton = document.getElementById('editProductionsButton');
            if (sessionRole === 'manager') {
                editProductionsButton.classList.remove('disabled');
            } else {
                editProductionsButton.classList.add('disabled');
            }
        })
        .catch(error => console.error('Error:', error));
}

function getFlyingProductions() {
    fetch('/get_productions_status5')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('productionsTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            // data.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));
            data.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
            // console.log(data);

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

    // if (sessionQcReturnQuantity > 0) {
    //     getQualityControl(sessionProductUID);
    // } else {
    //     const gridBody = document.getElementById('quality_controlTableBody');
    //         gridBody.innerHTML = '';  // Очищаем таблицу
    // }
    //alert(sessionProductName);
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
    getFlyingProductions();  // Сбрасываем фильтр, загружая все данные
    // const gridBody = document.getElementById('quality_controlTableBody');
    //         gridBody.innerHTML = '';  // Очищаем таблицу
}

// Функция изменения статуса производства
function updateProductionStatus(new_production_status, new_qc_status) {
    let new_qc_return_quantity;
    if (new_qc_status === 'OK') {
        new_qc_return_quantity = sessionQcReturnQuantity;
    } else {
        new_qc_return_quantity = sessionQcReturnQuantity+1;
    }
    fetch('/update_production_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productionUid: sessionProductUID,
            newQualityStatus: new_qc_status,
            newProductionStatus: new_production_status,
            newQcReturnQuantity: new_qc_return_quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        sessionProductUID = null;
        getFlyingProductions();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
}

// Нажатие кнопки прохождения облёта. Открытие модального окна
document.getElementById('flyingTestOkButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        flyingTestOkModal = new bootstrap.Modal(document.getElementById('flyingTestOkModal'));
        flyingTestOkModal.show();
    } else {
        sessionProductUID = null;
        flyingTestOkModal = null;
        alert('Выберите строку с изделием!');
    }
});
// Нажатие кнопки подтверждения
document.getElementById('applyFlyingTestOkButton').addEventListener('click', function () {
    updateProductionStatus(6, '');
    addProductionControl(6);
    flyingTestOkModal.hide();
    flyingTestOkModal = null;
    sessionProductUID = null;
});

// Нажатие кнопки облёт не пройден. Открытие модального окна
document.getElementById('flyingTestNgButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productionsTableBody .grid_production-row.active-row');
    if (activeRow) {
        flyingTestNgModal = new bootstrap.Modal(document.getElementById('flyingTestNgModal'));
        flyingTestNgModal.show();
    } else {
        sessionProductUID = null;
        flyingTestNgModal = null;
        alert('Выберите строку с изделием!');
    }
});

// Обработчик изменения текста в комментарии
document.getElementById('qc_comment').addEventListener('input', function() {
    const comment = this.value;
    const charCount = comment.length;
    document.getElementById('qcCommentCharCount').textContent = charCount;

    // Подсветка при приближении к лимиту
    const counter = document.getElementById('qcCommentCharCount');
    if (charCount >= 150) {
        counter.classList.add('text-warning');
        if (charCount >= 180) {
            counter.classList.add('text-danger');
        } else {
            counter.classList.remove('text-danger');
        }
    } else {
        counter.classList.remove('text-warning', 'text-danger');
    }
});

// Сброс счётчика при открытии модального окна
document.getElementById('flyingTestNgModal').addEventListener('show.bs.modal', function() {
    document.getElementById('qcCommentCharCount').textContent = '0';
    document.getElementById('qc_comment').value = '';
});

// // Нажатие кнопки подтверждения
// document.getElementById('applyFlyingTestNgButton').addEventListener('click', function () {
//     updateProductionStatus(6, 'NG');
//     addProductionControl(6);
//     addQualityControl(6,'NG');
//     flyingTestNgModal.hide();
//     flyingTestNgModal = null;
//     sessionProductUID = null;
// });

// Нажатие кнопки подтверждения
document.getElementById('applyFlyingTestNgButton').addEventListener('click', function() {
    qualityComment = document.getElementById('qc_comment').value;
    if (qualityComment.length > 200) {
        alert('Комментарий не должен превышать 200 символов!');
        return false;
    } else {
        updateProductionStatus(6, 'NG');
        addProductionControl(6);
        addQualityControl('NG');
        flyingTestNgModal.hide();
        flyingTestNgModal = null;
        sessionProductUID = null;
    }
});

//Функция добавления записи проверки качества
function addQualityControl(new_qc_status) {
    fetch('/add_quality_control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productionUid: sessionProductUID,
            username: sessionUsername,
            productionStatus: sessionProductionStatus,
            newQualityStatus: new_qc_status,
            qualityComment: qualityComment
        })
    })
    .then(response => response.json())
    .then(data => {
        // alert(data.message);
        sessionProductUID = null;
        sessionUsername = null;
        sessionProductionStatus = 0;
        qualityComment = null;
        getQualityControl();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
}

//Функция добавления записи в таблицу контроля производства
function addProductionControl(status) {
    fetch('/add_production_control', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productionUid: sessionProductUID,
            username: sessionUsername,
            productionStatus: status,
        })
    })
    .then(response => response.json())
    .then(data => {
        // alert(data.message);
        sessionProductUID = null;
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
    filterFlyingProductions((production) => production.product_uid.includes(transliterateUid));
     // getQualityControl(transliterateUid);
}



// ---Общая функция для фильтрации---
function filterFlyingProductions(filterFunction) {
    fetch('/get_productions_status5')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('productionsTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            // data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            data.sort((a,b) => new Date(a.datetime) - new Date(b.datetime));

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
    // Проверяем, что клик был не по таблице и не по модальному окну
    if (!event.target.closest('.grid_production-body') && !event.target.closest('.modal')) {
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
    flyingTestInfo();  // Вызываем функцию при загрузке страницы
    getFlyingProductions();
    // getQualityProductions();  // Загружаем продукты при загрузке страницы
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};
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

function clearFilter() {
    getProductions();  // Сбрасываем фильтр, загружая все данные
}

function filterByTime() {
    const startTime = prompt('Введите дату и время начала интервала (например, 2023-10-01 12:00:00):');
    const endTime = prompt('Введите дату и время конца интервала (например, 2023-10-01 12:00:00):');
    if (startTime && endTime) {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        filterProductions((production) => {
            const productionDate = new Date(production[1]);
            return productionDate >= startDate && productionDate <= endDate
        });
    }
}

function filterByProduct() {
    const productName = prompt('Введите название изделия:');
    if (productName) {
        filterProductions((production) => production[2].includes(productName));
    }
}

function filterByOrder() {
    const orderNum = prompt('Введите номер ШПЗ:');
    if (orderNum) {
        filterProductions((production) => production[3].includes(orderNum));
    }
}

function filterByUid() {
    const productUid = prompt('Введите UID изделия:');
    const transliteratedUid = transliterate(productUid)
    if (productUid) {
        filterProductions((production) => production[4].includes(transliteratedUid));
    }
}

function filterByUser() {
    const username = prompt('Введите ФИО пользователя:');
    if (username) {
        filterProductions((production) => production[5].includes(username));
    }
}

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
                    const usernameCell = document.createElement('td');
                    const production_statusCell = document.createElement('td');

                    numberCell.innerText = index + 1;
                    datetimeCell.innerText = production[1];
                    product_nameCell.innerText = production[2];
                    order_numCell.innerText = production[3];
                    product_uidCell.innerText = production[4];
                    usernameCell.innerText = production[5];
                    production_statusCell.innerText = production[6];
                    row.appendChild(numberCell);
                    row.appendChild(datetimeCell);
                    row.appendChild(product_nameCell);
                    row.appendChild(order_numCell);
                    row.appendChild(product_uidCell);
                    row.appendChild(usernameCell);
                    row.appendChild(production_statusCell);
                    tableBody.appendChild(row);
                }
            });
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('clearFilterButton').addEventListener('click', clearFilter);
document.getElementById('timeFilterButton').addEventListener('click', filterByTime);
document.getElementById('productFilterButton').addEventListener('click', filterByProduct);
document.getElementById('orderFilterButton').addEventListener('click', filterByOrder);
document.getElementById('uidFilterButton').addEventListener('click', filterByUid);
document.getElementById('userFilterButton').addEventListener('click', filterByUser);

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
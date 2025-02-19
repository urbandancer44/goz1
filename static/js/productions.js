function productionsInfo() {
    fetch('/get_info')
        .then(response => response.json())
        .then(data => {
            sessionUsername = data.username;
            document.getElementById('username').innerText = sessionUsername;
            sessionRole = data.role;
            document.getElementById('role').innerText = sessionRole;

            if ((data.product_name) != null) {
                sessionProductName = data.product_name;
                document.getElementById('product_name').innerText = sessionProductName;
            }
            if ((data.order_num) != null) {
                sessionOrderNum = data.order_num;
                document.getElementById('order_num').innerText = sessionOrderNum;
            }
            if ((data.picture_name) != null) {
                const picture_name = data.picture_name;
                document.getElementById('product_img').src = "/static/img/products/" + picture_name;
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

function getProductions() {
    fetch('/get_productions')
        .then(response => response.json())
        .then(data => {
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
            });
        })
        .catch(error => console.error('Error:', error));
}
// --- Модальное окно ввода серийного номера ---
document.getElementById('setProductUidForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const product_uid = document.getElementById('hiddenInput').value;
    transliteratedUid = transliterate(product_uid);
    setSerialNumModal = new bootstrap. Modal(document.getElementById('setSerialNumModal'));
    setSerialNumModal.show();
    // addProduction(product_uid);
});
// При открытии модального окна
document.getElementById('setSerialNumModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('serialNum').focus();
})
// При закрытии модального окна
document.getElementById('setSerialNumModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('hiddenInput').value = '';
    document.getElementById('serialNum').value = '';
    focusHiddenInput();
})
// При нажатии на кнопку модального окна
document.getElementById('setSerialNumForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const serialNum = document.getElementById('serialNum').value;
    if (serialNum) {
        fetch('/add_production', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productUid: transliteratedUid,
                serialNum: serialNum
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при добавлении изделия!\n\nПроверьте данные UID и S/N (возможно уже есть в БД).\nПовторно сканируйте UID и введите S/N.')
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            setSerialNumModal.hide();
            setSerialNumModal = null;
            transliteratedUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
            setSerialNumModal.hide();
        })
        // .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

document.addEventListener('click', function(event) {
    // Проверяем, что клик был не по модальному окну
    if (!event.target.closest('.modal')) {
        focusHiddenInput();
    }
});

function focusHiddenInput() {
    document.getElementById('hiddenInput').focus();
}

window.onload = function() {

    getTime();
    getWorkplaceName();
    focusHiddenInput();
    productionsInfo();
    getProductions();
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};
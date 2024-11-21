function productionsInfo() {
    fetch('/get_productions_info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.username;
            document.getElementById('role').innerText = data.role;
            document.getElementById('product_name').innerText = data.product_name;
            document.getElementById('order_num').innerText = data.order_num;

            const picture_name = data.picture_name;
            document.getElementById('product_img').src = "/static/img/products/" + picture_name;

            const editProductionsButton = document.getElementById('editProductionsButton');
            if (data.role === 'manager') {
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

            });
        })
        .catch(error => console.error('Error:', error));
}

function addProduction(product_uid) {
    fetch('/add_production', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `product_uid=${encodeURIComponent(product_uid)}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        getProductions();
        document.getElementById("hiddenInput").value = '';
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addProductionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const product_uid = document.getElementById('hiddenInput').value;
    addProduction(product_uid);
});

function focusHiddenInput() {
    document.getElementById('hiddenInput').focus();
}

function getTime() {
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('datetime').innerText = data.datetime_value;
        })
        .catch(error => console.error('Error:', error));
}


window.onload = function() {
    focusHiddenInput();
    productionsInfo();  // Вызываем функцию при загрузке страницы
    getProductions();
    setInterval(getTime, 1000);  // Обновляем данные каждую секунду
    setInterval(focusHiddenInput, 1000);  // Обновляем данные каждую секунду
};
function updateSelectProduct() {
    fetch('/get_select_product_info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.username;
            document.getElementById('role').innerText = data.role;
            document.getElementById('datetime').innerText = data.datetime_value;

            const editProductionsButton = document.getElementById('editProductionsButton');
            if (data.role === 'manager') {
                editProductionsButton.classList.remove('disabled');
            } else {
                editProductionsButton.classList.add('disabled');
            }
        })
        .catch(error => console.error('Error:', error));
}

function getProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('buttons-container');
            //container.innerHTML = ''; // Очищаем контейнер перед добавлением новых кнопок

            data.forEach(product => {
                const product_button = document.createElement('button');
                product_button.textContent = product[1];
                product_button.dataset.id = product[1]; // Добавляем идентификатор к кнопке
                product_button.classList.add('btn', 'btn-success', 'btn-lg', 'btn-block', 'm-4'); // Добавляем классы Bootstrap
                product_button.onclick = function () {
                    selectOrder(product[1]);
                }
                container.appendChild(product_button);
            });
        })
        .catch(error => console.error('Error:', error));
}

function selectOrder(product_name) {
    fetch('/set_product_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `product_name=${encodeURIComponent(product_name)}`
    })
    .then(response => response.text())
    .then(data => {
        window.location.href = '/select_order';
    })
    .catch(error => console.error('Error:', error));
}

window.onload = function() {
    updateSelectProduct();  // Вызываем функцию при загрузке страницы
    setInterval(updateSelectProduct, 1000);  // Обновляем данные каждую секунду
    getProducts();  // Загружаем продукты при загрузке страницы
};
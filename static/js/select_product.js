function selectProductInfo() {
    fetch('/get_info')
        .then(response => response.json())
        .then(data => {
            sessionUsername = data.username;
            document.getElementById('username').innerText = sessionUsername;
            sessionRole = data.role;
            document.getElementById('role').innerText = sessionRole;

            if (sessionProductName != null) {
                document.getElementById('product_name').innerText = sessionProductName;
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

function getProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('buttons-container');
            container.innerHTML = ''; // Очищаем контейнер перед добавлением новых кнопок

            data.sort((a, b) => a.product_name.localeCompare(b.product_name));

            data.forEach(product => {
                const product_button = document.createElement('button');
                product_button.textContent = product.product_name;
                product_button.dataset.id = product.product_name; // Добавляем идентификатор к кнопке
                product_button.classList.add('btn', 'btn-success', 'btn-lg', 'btn-block', 'm-4'); // Добавляем классы Bootstrap
                product_button.onclick = function () {
                    selectOrder(product.product_name, product.picture_path);
                }
                container.appendChild(product_button);
            });
        })
        .catch(error => console.error('Error:', error));
}

function selectOrder(product_name, picture_name) {
    fetch('/set_product_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `product_name=${encodeURIComponent(product_name)}&picture_name=${encodeURIComponent(picture_name)}`
    })
    .then(response => response.text())
    .then(data => {
        window.location.href = '/select_order';
    })
    .catch(error => console.error('Error:', error));
}

window.onload = function() {

    getTime();
    getWorkplaceName();
    selectProductInfo();  // Вызываем функцию при загрузке страницы
    getProducts();  // Загружаем продукты при загрузке страницы
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};
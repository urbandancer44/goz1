function getProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('productsTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.forEach(product => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                const actionCell = document.createElement('td');
                //const enableCell = document.createElement('td');
                //const pictureCell = document.createElement('td');
                const deleteButton = document.createElement('button');

                nameCell.innerText = product[0];
                //enableCell.innerText = product[1];
                //pictureCell.innerText = product[2]
                deleteButton.innerText = 'Удалить';
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.onclick = function() {
                    deleteProduct(product[0]);
                };
                row.appendChild(nameCell);
                //row.appendChild(enableCell);
                //row.appendChild(pictureCell);
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addProduct() {
    //const product_name = document.getElementById('product_name').value;
    const formData = new FormData(document.getElementById('addProductForm'));
    fetch('/add_product', {
        method: 'POST',
        /*headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `product_name=${product_name}&picture=${picture}`*/
        body: formData

    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        getProducts();  // Перезагружаем таблицу после добавления
        document.getElementById('product_name').value = '';
        document.getElementById('picture').value = '';
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addProduct();
});


function deleteProduct(product_name) {
    fetch('/delete_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `product_name=${product_name}`
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            getProducts();  // Перезагружаем таблицу после удаления
        })
        .catch(error => console.error('Error:', error));
}

window.onload = function() {
    getProducts();  // Загружаем пользователей при загрузке страницы
    setInterval(getProducts, 5000);  // Обновляем данные каждые 5 секунд
};


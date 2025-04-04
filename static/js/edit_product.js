function getProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('productsTableBody');
            gridBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a, b) => a.product_name.localeCompare(b.product_name));

            data.forEach((product, index) => {
                const row = document.createElement('div');
                row.classList.add('grid-row');

                const numberCell = document.createElement('div');
                const product_nameCell = document.createElement('div');
                const pictureCell = document.createElement('div');

                numberCell.innerText = index + 1;
                product_nameCell.innerText = product.product_name;
                pictureCell.innerText = product.picture_path;
                row.appendChild(numberCell);
                row.appendChild(product_nameCell);
                row.appendChild(pictureCell);
                gridBody.appendChild(row);

                row.dataset.name = product.product_name;
                row.dataset.picture_name = product.picture_path;
                row.addEventListener("click", (event) => {
                    //alert(product.product_name);
                    activateRow(event.currentTarget);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function addProduct() {
    //const product_name = document.getElementById('product_name').value;
    const addFormData = new FormData(document.getElementById('addProductForm'));
    fetch('/add_product', {
        method: 'POST',
        body: addFormData
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

function activateRow(row) {
    document.querySelectorAll('#productsTableBody .grid-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row')
    product_name = row.dataset.name;
    picture_name = row.dataset.picture_name
    //alert(product_name);
}
//---изменение фото в таблице---
document.getElementById('editProductPictureButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productsTableBody .grid-row.active-row');
    if (activeRow) {
        document.getElementById('productName').value = product_name;
        editPictureModal = new bootstrap. Modal(document.getElementById('editPictureModal'));
        editPictureModal.show();
    } else {
        product_name = null;
        editPictureModal = null;
        document.getElementById('productName').value = '';
        alert('Выберите строку для редактирования!');
    }
});

document.getElementById('savePictureButton').addEventListener('click', function () {
    const newPicture = document.getElementById('newPicture').value;
    const updateFormData = new FormData(document.getElementById('editPictureForm'));
    if (newPicture) {
        fetch('/update_product_picture', {
            method: 'POST',
            body: updateFormData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            editPictureModal.hide();
            document.getElementById('newPicture').value = '';
            editPictureModal = null;
            product_name = null;
            document.getElementById('productName').value = '';
            getProducts();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Удаление записи в таблице---
document.getElementById('deleteProductButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productsTableBody .grid-row.active-row');
    if (activeRow) {
        deleteProductModal = new bootstrap. Modal(document.getElementById('deleteProductModal'));
        deleteProductModal.show();
    } else {
        product_name = null;
        deleteProductModal = null;
        alert('Выберите строку для удаления!');
    }
});
document.getElementById('applyDeleteProductButton').addEventListener('click', function () {
    fetch('/delete_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productName: product_name,
            deletePictureName: deletePictureName
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        deleteProductModal.hide();
        deleteProductModal = null;
        product_name = null;
        getProducts();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
});

window.onload = function() {

    getTime();
    getWorkplaceName();
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду

    getProducts();  // Загружаем пользователей при загрузке страницы
};



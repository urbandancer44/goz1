let product_name = null;
let editPictureModal = null;
let deleteProductModal = null;

function getProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('productsTableBody');
            tableBody.innerHTML = '';  // Очищаем таблицу

            data.sort((a, b) => a[1].localeCompare(b[1]));

            data.forEach((product, index) => {
                const row = document.createElement('tr');
                const numberCell = document.createElement('td');
                const product_nameCell = document.createElement('td');
                const pictureCell = document.createElement('td');

                numberCell.innerText = index + 1;
                product_nameCell.innerText = product[1];
                pictureCell.innerText = product[2];
                row.appendChild(numberCell);
                row.appendChild(product_nameCell);
                row.appendChild(pictureCell);
                tableBody.appendChild(row);

                row.dataset.name = product[1];
                row.addEventListener("click", (event) => {
                    //alert(product[1]);
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
    document.querySelectorAll('#productsTableBody tr').forEach(r => r.classList.remove('table-active'));
    row.classList.add('table-active')
    product_name = row.dataset.name;
    //alert(product_name);
}
//---изменение фото в таблице---
document.getElementById('editProductPictureButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#productsTableBody tr.table-active');
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
    const activeRow = document.querySelector('#productsTableBody tr.table-active');
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
            product_name: product_name,
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
    getProducts();  // Загружаем изделия при загрузке страницы
};



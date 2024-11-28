let transliteratedUid = null;
let setSerialNumModal = null;

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
                const serial_numCell = document.createElement('td');
                const usernameCell = document.createElement('td');
                const production_statusCell = document.createElement('td');

                numberCell.innerText = index + 1;
                datetimeCell.innerText = production[1];
                product_nameCell.innerText = production[2];
                order_numCell.innerText = production[3];
                product_uidCell.innerText = production[4];
                serial_numCell.innerText = production[7];
                usernameCell.innerText = production[5];
                production_statusCell.innerText = production[6]
                row.appendChild(numberCell);
                row.appendChild(datetimeCell);
                row.appendChild(product_nameCell);
                row.appendChild(order_numCell);
                row.appendChild(product_uidCell);
                row.appendChild(serial_numCell);
                row.appendChild(usernameCell);
                row.appendChild(production_statusCell);
                tableBody.appendChild(row);

            });
        })
        .catch(error => console.error('Error:', error));
}

// function addProduction(product_uid) {
//     const transliteratedUid = transliterate(product_uid);
//     fetch('/add_production', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: `product_uid=${encodeURIComponent(transliteratedUid)}`
//     })
//     .then(response => response.text())
//     .then(data => {
//         alert(data);
//         getProductions();
//         document.getElementById("hiddenInput").value = '';
//     })
//     .catch(error => console.error('Error:', error));
// }

document.getElementById('setProductUidForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const product_uid = document.getElementById('hiddenInput').value;
    transliteratedUid = transliterate(product_uid);
    setSerialNumModal = new bootstrap. Modal(document.getElementById('setSerialNumModal'));
    setSerialNumModal.show();
    // addProduction(product_uid);
});

document.getElementById('saveSerialNumButton').addEventListener('click', function () {
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
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            setSerialNumModal.hide();
            document.getElementById('hiddenInput').value = '';
            document.getElementById('serialNum').value = '';
            setSerialNumModal = null;
            transliteratedUid = null;
            getProductions();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
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

function getTime() {
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('datetime').innerText = data.datetime_value;
        })
        .catch(error => console.error('Error:', error));
}

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
    focusHiddenInput();
    productionsInfo();  // Вызываем функцию при загрузке страницы
    getProductions();
    setInterval(getTime, 1000);  // Обновляем данные каждую секунду
};
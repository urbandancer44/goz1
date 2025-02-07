function selectOrderInfo() {
    // fetch('/get_select_order_info')
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
            }
        })
        .catch(error => console.error('Error:', error));
}

function setOrder(order_num) {
    fetch('/set_order_num', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `order_num=${encodeURIComponent(order_num)}`
    })
    .then(response => response.text())
    .then(data => {
        window.location.href = '/productions';
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const orderNumInput = document.getElementById('order_num')
    const order_num = orderNumInput.value

    const cyrillicPattern = /^[А-Яа-я0-9\s-._]*$/;

    if (!cyrillicPattern.test(order_num)) {
        alert('Запрещено использовать латиницу!');
        document.getElementById('order_num').value = '';
    }
    else {
        setOrder(order_num);
    }
});

document.getElementById("order_num").focus();

// Функция для отображения времени
function updateTimeDisplay() {
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement && serverTime) {
        datetimeElement.innerText = serverTime.toLocaleString(); // Отображаем время в локальном формате
    }
}

window.onload = function() {
    if (currentWorkplaceID) {
    document.getElementById('current_workplace_id').innerText = currentWorkplaceID;
    } else {
        console.log('Куки ID рабочего места не найдено')
    }

    getTime()
    selectOrderInfo();  // Вызываем функцию при загрузке страницы
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};


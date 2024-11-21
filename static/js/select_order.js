function selectOrderInfo() {
    fetch('/get_select_order_info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.username;
            document.getElementById('role').innerText = data.role;
            document.getElementById('product_name').innerText = data.product_name;
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

function getTime() {
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('datetime').innerText = data.datetime_value;
        })
        .catch(error => console.error('Error:', error));
}

window.onload = function() {
    selectOrderInfo();  // Вызываем функцию при загрузке страницы
    setInterval(getTime, 1000);  // Обновляем данные каждую секунду
};

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
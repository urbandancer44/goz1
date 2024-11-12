function updateMainTable() {
    fetch('/get_main_table_info')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').innerText = data.username;
            document.getElementById('role').innerText = data.role;
            document.getElementById('current_date').innerText = data.current_date;
            document.getElementById('product_name').innerText = data.product_name
            document.getElementById('order_num').innerText = data.order_num
        })
        .catch(error => console.error('Error:', error));
}

window.onload = function() {
    updateMainTable();  // Вызываем функцию при загрузке страницы
    setInterval(updateMainTable, 1000);  // Обновляем данные каждую секунду
};
function getWorkplaces() {
    fetch('/get_workplaces')
        .then(response => response.json())
        .then(data => {
            const gridBody = document.getElementById('workplacesTableBody');
            gridBody.innerHTML = '';  // Очищаем grid

            data.sort((a, b) => {
                const idA = parseInt(a.workplace_id, 10); // Преобразуем значение второго столбца в число
                const idB = parseInt(b.workplace_id, 10); // Преобразуем значение второго столбца в число
                return idA - idB; // Сортировка по возрастанию
            });

            data.forEach((workplace, index) => {
                const row = document.createElement('div');
                row.classList.add('grid-row');

                const numberCell = document.createElement('div');
                const workplaceNameCell = document.createElement('div');
                const workplaceIDCell = document.createElement('div');

                numberCell.innerText = index + 1;
                workplaceNameCell.innerText = workplace.workplace_name;
                workplaceIDCell.innerText = workplace.workplace_id;

                row.appendChild(numberCell);
                row.appendChild(workplaceNameCell);
                row.appendChild(workplaceIDCell);
                gridBody.appendChild(row);

                row.dataset.workplace = workplace.workplace_id;
                row.addEventListener("click", (event) => {
                    activateRow(event.currentTarget);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function addWorkplace() {
    const workplaceName = document.getElementById('workplace_name').value;
    const workplaceID = document.getElementById('workplace_id').value;

    fetch('/add_workplace', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `workplaceName=${encodeURIComponent(workplaceName)}&workplaceID=${encodeURIComponent(workplaceID)}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('workplace_name').value = '';
        document.getElementById('workplace_id').value = '';
        getWorkplaces();  // Перезагружаем таблицу после добавления
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addWorkplaceForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addWorkplace();
});

document.getElementById('setWorkplaceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const setWorkplaceID = document.getElementById('workplaceSet').value;

    if (setWorkplaceID) {
        // Сохраняем выбранное значение в куки
        document.cookie = `workplace_id=${setWorkplaceID}; path=/; max-age=31536000`; // Куки действует 1 год (значение в секундах)
        alert(`Выбрано рабочее место c ID: ${setWorkplaceID}`);
        // Здесь можно добавить логику для подгрузки функционала рабочего места
    } else {
        alert('Введите ID рабочего места!');
    }
});

function activateRow(row) {
    document.querySelectorAll('#workplacesTableBody .grid-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row');
    workplaceID = row.dataset.workplace;
}

// --- Изменение имени рабочего места ---
document.getElementById('editWorkplaceNameButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#workplacesTableBody .grid-row.active-row');
    if (activeRow) {
        document.getElementById('newWorkplaceName').value = '';
        editWorkplaceNameModal = new bootstrap. Modal(document.getElementById('editWorkplaceNameModal'));
        editWorkplaceNameModal.show();
    } else {
        workplaceID = null;
        editWorkplaceNameModal = null;
        alert('Выберите строку для редактирования!');
    }
});
// При открытии модального окна
document.getElementById('editWorkplaceNameModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('newWorkplaceName').focus();
})
// При закрытии модального окна
// document.getElementById('editPasswordModal').addEventListener('hidden.bs.modal', function () {
//     document.getElementById('newPassword').value = '';
// })
// При нажатии кнопки модального окна
document.getElementById('editWorkplaceNameForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newWorkplaceName = document.getElementById('newWorkplaceName').value;
    if (newWorkplaceName) {
        fetch('/update_workplace_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workplaceID: workplaceID,
                newWorkplaceName: newWorkplaceName
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editWorkplaceNameModal.hide();
            editWorkplaceNameModal = null;
            workplaceID = null;
            getWorkplaces();  // Перезагружаем таблицу после изменения
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Пустое поле ввода!')
    }
});

// ---Удаление записи в таблице---
document.getElementById('deleteWorkplaceButton').addEventListener('click', function() {
    const activeRow = document.querySelector('#workplacesTableBody .grid-row.active-row');
    if (activeRow) {
        deleteWorkplaceModal = new bootstrap. Modal(document.getElementById('deleteWorkplaceModal'));
        deleteWorkplaceModal.show();
    } else {
        workplaceID = null;
        deleteWorkplaceModal = null;
        alert('Выберите строку для удаления!');
    }
});
// При нажатии кнопки модального окна
document.getElementById('applyDeleteWorkplaceButton').addEventListener('click', function () {
    fetch('/delete_workplace', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workplaceID: workplaceID,
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        deleteWorkplaceModal.hide();
        deleteWorkplaceModal = null;
        workplaceID = null;
        getWorkplaces();  // Перезагружаем таблицу после изменения
    })
    .catch(error => console.error('Error:', error));
});

window.onload = function() {

    getTime();
    getWorkplaceName();
    getWorkplaces();  // Загружаем список рабочих мест при загрузке страницы
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};




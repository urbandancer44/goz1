// --- edit_user.js ---
let username = null;
let editPasswordModal = null;
let editRoleModal = null;
let deleteUserModal = null;
// ---

// --- edit_product.js ---
let product_name = null;
let editPictureModal = null;
let deleteProductModal = null;
// ---

// --- productions.js ---
let serverTime = null; // Глобальная переменная для хранения времени с сервера
let transliteratedUid = null;
let setSerialNumModal = null;
// ---

// --- productions_history.js ---
let productFilterModal = null;
let timeFilterModal = null;
let orderFilterModal = null;
let uidFilterModal = null;
let userFilterModal = null;
let serialNumFilterModal = null;
// ---

// --- edit_productions.js ---
let productionUid = null;
let editTimeModal = null;
let editOrderModal = null;
let editUserModal = null;
let deleteProductionModal = null;
// ---

// --- edit_workplace.js ---
let workplaceID = null;
let editWorkplaceNameModal = null;
let deleteWorkplaceModal = null;
// ---

let sessionUsername = null;
let sessionRole = null;
let sessionProductName = null;
let sessionProductUID = null;
let sessionOrderNum = null;
let sessionQcReturnQuantity = 0;

// Функция для получения значения куки по имени
let currentWorkplaceID = getCookie('workplace_id');
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Функция для получения времени с сервера (один раз в час)
function getTime() {
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            serverTime = new Date(data.datetime_value); // Сохраняем время с сервера
            updateTimeDisplay(); // Обновляем отображение времени
        })
        .catch(error => console.error('Error:', error));
}

// Функция для увеличения времени локально каждую секунду
function incrementLocalTime() {
    if (serverTime) {
        serverTime.setSeconds(serverTime.getSeconds() + 1); // Увеличиваем время на 1 секунду
        updateTimeDisplay(); // Обновляем отображение времени
    }
}

// Функция для отображения времени
function updateTimeDisplay() {
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement && serverTime) {
        datetimeElement.innerText = serverTime.toLocaleString(); // Отображаем время в локальном формате
    }
}

// Функция для запроса и отображения имени рабочего места
function getWorkplaceName() {
    if (currentWorkplaceID) {
        // Получаем название рабочего места по его ID
        fetch('/get_workplace_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ workplaceID: currentWorkplaceID })
        })
        .then(response => response.json())
        .then(data => {
            if (data.workplaceName) {
                document.getElementById('current_workplace_name').innerText = data.workplaceName;
            } else {
                console.log('Название рабочего места не найдено');
                document.getElementById('current_workplace_name').innerText = currentWorkplaceID; // Отображаем ID, если название не найдено
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.log('Куки ID рабочего места не найдено');
    }
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



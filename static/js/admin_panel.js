window.onload = function() {

    getTime();
    getWorkplaceName();
    setInterval(getTime, 3600000);  // Запрашиваем время с сервера каждые 60 минут (3600000 миллисекунд)
    setInterval(incrementLocalTime, 1000);  // Обновляем время локально каждую секунду
};
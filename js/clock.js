function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const date = now.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long"
    });

    document.getElementById("lock-clock").textContent = time;
    document.getElementById("home-clock").textContent = time;
    document.getElementById("status-time").textContent = time;
    document.getElementById("lock-date").textContent = date;
    document.getElementById("home-date").textContent = date;

    updateClockIcons(now);
}

// 홈 화면과 앱 서랍의 시계 아이콘 바늘을 현재 시각에 맞춤
function updateClockIcons(now) {
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const hourDeg = hour * 30 + minute * 0.5;
    const minuteDeg = minute * 6 + second * 0.1;

    document.querySelectorAll(".hand-hour").forEach((el) => {
        el.setAttribute("transform", `rotate(${hourDeg} 12 12)`);
    });
    document.querySelectorAll(".hand-minute").forEach((el) => {
        el.setAttribute("transform", `rotate(${minuteDeg} 12 12)`);
    });
}

updateClock();
setInterval(updateClock, 1000);

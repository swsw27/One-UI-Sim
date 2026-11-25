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
}

updateClock();
setInterval(updateClock, 1000);

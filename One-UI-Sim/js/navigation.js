const lockScreen = document.getElementById("lock-screen");
const homeScreen = document.getElementById("home-screen");
const drawer = document.getElementById("app-drawer");

function unlockDevice() {
    lockScreen.classList.remove("active");
    homeScreen.classList.add("active");
}

function openDrawer() {
    drawer.classList.add("open");
}

function closeDrawer() {
    drawer.classList.remove("open");
}

document.getElementById("unlock-button")
    .addEventListener("click", unlockDevice);

document.getElementById("app-drawer-button")
    .addEventListener("click", openDrawer);

document.getElementById("close-drawer")
    .addEventListener("click", closeDrawer);

let startY = 0;

document.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (e) => {
    if (!e.changedTouches.length) return;

    const endY = e.changedTouches[0].clientY;
    const distance = startY - endY;

    if (distance < 70) return;

    if (lockScreen.classList.contains("active")) {
        unlockDevice();
    } else if (
        homeScreen.classList.contains("active") &&
        !drawer.classList.contains("open")
    ) {
        openDrawer();
    }
}, { passive: true });

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
});

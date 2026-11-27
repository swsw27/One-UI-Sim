const lockScreen = document.getElementById("lock-screen");
const homeScreen = document.getElementById("home-screen");
const drawer = document.getElementById("app-drawer");
const lockContent = lockScreen.querySelector(".lock-content");

// 잠금 해제에 필요한 드래그 거리(px). 방향과 상관없이 시작점에서 떨어진 거리로 판단합니다.
const UNLOCK_DISTANCE = 100;

/* ===== 화면 전환 ===== */

function unlockDevice() {
    resetLockContent();
    lockScreen.classList.remove("active");
    homeScreen.classList.add("active");
}

function openDrawer() {
    drawer.classList.add("open");
}

function closeDrawer() {
    drawer.classList.remove("open");
}

/* ===== 잠금 화면: 모든 방향으로 쓸어서 해제 ===== */

let lockStart = null;

function resetLockContent() {
    lockContent.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    lockContent.style.transform = "";
    lockContent.style.opacity = "";
}

lockScreen.addEventListener("pointerdown", (e) => {
    if (!lockScreen.classList.contains("active")) return;
    lockStart = { x: e.clientX, y: e.clientY };
    lockScreen.setPointerCapture(e.pointerId);
    lockContent.style.transition = "none";
});

lockScreen.addEventListener("pointermove", (e) => {
    if (!lockStart) return;

    const dx = e.clientX - lockStart.x;
    const dy = e.clientY - lockStart.y;
    const distance = Math.hypot(dx, dy);
    const progress = Math.min(1, distance / UNLOCK_DISTANCE);

    // 손가락 방향을 따라 콘텐츠가 함께 움직이고, 거리가 늘수록 살짝 흐려집니다.
    lockContent.style.transform = `translate(${dx}px, ${dy}px)`;
    lockContent.style.opacity = String(1 - progress * 0.6);
});

function endLockDrag(e) {
    if (!lockStart) return;

    const dx = e.clientX - lockStart.x;
    const dy = e.clientY - lockStart.y;
    const distance = Math.hypot(dx, dy);
    lockStart = null;

    if (distance >= UNLOCK_DISTANCE) {
        unlockDevice();
    } else {
        resetLockContent();
    }
}

lockScreen.addEventListener("pointerup", endLockDrag);
lockScreen.addEventListener("pointercancel", endLockDrag);

/* ===== 홈 화면: 위로 쓸어올려 앱 서랍 열기 ===== */

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
    if (!homeScreen.classList.contains("active")) return;
    if (drawer.classList.contains("open")) return;

    const distance = startY - e.changedTouches[0].clientY;
    if (distance >= 70) openDrawer();
}, { passive: true });

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
});

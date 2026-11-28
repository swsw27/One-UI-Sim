const device = document.getElementById("device");
const lockScreen = document.getElementById("lock-screen");
const homeScreen = document.getElementById("home-screen");
const drawer = document.getElementById("app-drawer");
const lockContent = lockScreen.querySelector(".lock-content");

// 잠금 해제에 필요한 드래그 거리(px)
const UNLOCK_DISTANCE = 100;

// 이 값보다 아래로 내려가면 아래 방향 제스처(알림창 영역)로 보고 해제하지 않음
const DOWN_TOLERANCE = 20;

/* ===== 공통 상태 ===== */

function isLocked() {
    return lockScreen.classList.contains("active");
}

function unlockDevice() {
    resetLockContent();
    lockScreen.classList.remove("active");
    homeScreen.classList.add("active");
    device.classList.remove("locked");
}

function openDrawer() {
    drawer.classList.add("open");
}

function closeDrawer() {
    drawer.classList.remove("open");
}

/* ===== 하단 내비게이션 버튼 ===== */

function onRecentsButton() {
    if (isLocked()) return;
    // 최근 앱 화면은 아직 구현 전입니다.
}

function onHomeButton() {
    if (isLocked()) return;
    closeDrawer();
}

function onBackButton() {
    if (isLocked()) return;
    if (drawer.classList.contains("open")) {
        closeDrawer();
        return;
    }
    // 앱 실행 기능이 생기면 앱 안에서의 뒤로가기 처리를 여기에 추가합니다.
}

document.getElementById("nav-recents").addEventListener("click", onRecentsButton);
document.getElementById("nav-home").addEventListener("click", onHomeButton);
document.getElementById("nav-back").addEventListener("click", onBackButton);

/* ===== 잠금 화면: 가로 또는 위 방향 드래그로 해제 ===== */

let lockStart = null;

function resetLockContent() {
    lockContent.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    lockContent.style.transform = "";
    lockContent.style.opacity = "";
}

function getLockDelta(e) {
    return {
        dx: e.clientX - lockStart.x,
        dy: e.clientY - lockStart.y
    };
}

function isDownGesture(dy) {
    return dy > DOWN_TOLERANCE;
}

lockScreen.addEventListener("pointerdown", (e) => {
    if (!isLocked()) return;
    lockStart = { x: e.clientX, y: e.clientY };
    lockScreen.setPointerCapture(e.pointerId);
    lockContent.style.transition = "none";
});

lockScreen.addEventListener("pointermove", (e) => {
    if (!lockStart) return;

    const { dx, dy } = getLockDelta(e);

    // 아래 방향 제스처는 콘텐츠를 움직이지 않음
    if (isDownGesture(dy)) {
        lockContent.style.transform = "";
        lockContent.style.opacity = "";
        return;
    }

    // 가로 또는 위 방향만 콘텐츠가 따라 움직임
    const moveY = Math.min(0, dy);
    const distance = Math.hypot(dx, moveY);
    const progress = Math.min(1, distance / UNLOCK_DISTANCE);

    lockContent.style.transform = `translate(${dx}px, ${moveY}px)`;
    lockContent.style.opacity = String(1 - progress * 0.6);
});

function endLockDrag(e) {
    if (!lockStart) return;

    const { dx, dy } = getLockDelta(e);
    lockStart = null;

    const moveY = Math.min(0, dy);
    const distance = Math.hypot(dx, moveY);

    if (!isDownGesture(dy) && distance >= UNLOCK_DISTANCE) {
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

/* ===== PC 테스트용: 마우스로 위로 드래그해 앱 서랍 열기 ===== */

let mouseStartY = null;

document.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (!homeScreen.classList.contains("active")) return;
    mouseStartY = e.clientY;
});

document.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "mouse" || mouseStartY === null) return;

    const distance = mouseStartY - e.clientY;
    mouseStartY = null;

    if (!homeScreen.classList.contains("active")) return;
    if (drawer.classList.contains("open")) return;

    if (distance >= 70) openDrawer();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
});

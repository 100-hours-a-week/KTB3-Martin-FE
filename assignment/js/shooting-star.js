document.addEventListener("DOMContentLoaded", () => {

  function createShootingStar() {
    const container = document.getElementById("shooting-star-container");
    if (!container) return; 

    const star = document.createElement("div");
    star.className = "shooting-star";

    // ⭐ ① 화면 가로 랜덤으로 시작
    const startX = Math.random() * window.innerWidth;
    star.style.left = startX + "px";

    // ⭐ ② 랜덤 속도 (2s ~ 4s)
    const durationnum = (3 + Math.random() * 3);
    const duration = durationnum + "s";
    star.style.animationDuration = duration;

    // ⭐ ③ 꼬리 애니메이션도 동일 속도로
    const tailDuration = durationnum ;
    star.style.setProperty("--tail-duration", tailDuration + "s");

    container.appendChild(star);

    // ⭐ ④ 애니메이션 끝나면 제거
    setTimeout(() => {
      star.remove();
    }, 5000);
  }

  // ⭐ 페이지 열자마자 1개 생성
  createShootingStar();

  // ⭐ 3~7초 간격으로 계속 생성
  setInterval(() => {
    createShootingStar();
  }, 3000 + Math.random() * 4000);

});

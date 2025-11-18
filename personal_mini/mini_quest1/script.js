//html에서 btn, title 찾기
const btn = document.getElementById("change");
const title = document.getElementById("title");

btn.addEventListener("click", () => {
    //화살표 함수
    
  title.textContent = "신기하네";
});

const body = document.getElementById("body");
body.style
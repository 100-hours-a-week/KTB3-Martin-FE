const loginBtn = document.querySelector(".btn-login");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

loginBtn.addEventListener("click", login);
password.addEventListener("keydown", (event) => {
  if (event.key == "Enter") login();
});



function validateEmail(email){
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(pw){
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
  return re.test(pw);

}

function checkform(){
  const isemailvalid = validateEmail(email)
}

async function login() {
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!email || !password) {
    alert("이메일과 비밀번호를 모두 입력해주세요");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/user/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ★ 세션 로그인 필수
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("로그인 성공!");
      console.log("로그인 성공:", data);

      // 다음 페이지로 이동
      window.location.href = "posts.html";
    } else {
      alert(data.message || "로그인 실패");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    alert("네트워크 오류가 발생했습니다.");
  }
}

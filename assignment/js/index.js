

const loginBtn = document.querySelector(".btn-login");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const helpertext = document.querySelector(".helper-text");

loginBtn.addEventListener("click", login);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") login();
});
emailInput.addEventListener("input", () =>{
  checkform();
  validateEmail(emailInput.value.trim());

});

passwordInput.addEventListener("input", () =>{
  checkform();
  validatePassword(passwordInput.value.trim());
});



function validateEmail(email){
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let result = re.test(email);
  if( !result){
    let text = "올바른 이메일 주소 형식을 입력해주세요\n";
    text += "(예: example@example.com";
    helpertext.textContent = text;
  }
  else{
    helpertext.textContent = "";
  }
  return result;
}

function validatePassword(pw){
  let result;
  if(pw == ""){
    helpertext.textContent = "*비밀번호를 입력해주세요";
    return false;
  }
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
  result = re.test(pw);
  if( !result){
    let text = "*비밀번호는 8자 이상, 20자 이하이며,\n"
    text += "대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    helpertext.textContent = text;
  }
  else{
    helpertext.textContent = "";
  }
  return result;

}

function checkform(){
  const isEmailValid = validateEmail(emailInput.value.trim());
  const isPasswdValid = validatePassword(passwordInput.value.trim());

  if(isEmailValid&&isPasswdValid){
    loginBtn.style.backgroundColor = "#7F6AEE";
    loginBtn.disabled = false;
  }else{
    loginBtn.style.backgroundColor= "#aca0eb";
    loginBtn.disabled = true;
  }
}

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

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
      window.location.href = "/html/posts.html";

    } else {
      alert(data.message || "로그인 실패");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    alert("네트워크 오류가 발생했습니다.");
  }
}

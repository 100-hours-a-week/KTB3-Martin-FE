import * as util from "./common/common.js"




let passwordInput;
let passwordCheckInput;
let helperPassword;
let helperPasswordCheck;
let submitBtn;

let navProfile;
let profileMenu;

// ===============================
// DOM 로드 후 초기화
// ===============================
document.addEventListener("DOMContentLoaded",async () => {
  // 비밀번호 입력 요소
  passwordInput = document.getElementById("password");
  passwordCheckInput = document.getElementById("password-check");

  helperPassword = passwordInput.closest(".input-group").querySelector(".helper-text");
  helperPasswordCheck = passwordCheckInput.closest(".input-group").querySelector(".helper-text");

  submitBtn = document.querySelector(".submit-btn");

  // 헤더 요소
  navProfile = document.getElementById("nav-profile");
  profileMenu = document.getElementById("profile-menu");

  document.querySelector(".appbar__title").addEventListener("click", () => {
        window.location.href = "/html/posts.html"
    });

  const user = await util.checkSession();
  util.loadCurrentUser(user);
  util.initDropdown();


  initPasswordEvents();
});



// ===============================
// 비밀번호 유효성 검사
// ===============================
function validatePassword(pw) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
  return regex.test(pw);
}

// ===============================
// 비밀번호 확인 검사
// ===============================
function checkPasswordConfirm() {
  const pw = passwordInput.value.trim();
  const pwCheck = passwordCheckInput.value.trim();

  if (!pwCheck) {
    helperPasswordCheck.textContent = "*비밀번호를 한번 더 입력해주세요";
    return false;
  }

  if (pw !== pwCheck) {
    helperPasswordCheck.textContent = "*비밀번호와 다릅니다.";
    return false;
  }

  helperPasswordCheck.textContent = "";
  return true;
}

// ===============================
// 버튼 활성화 업데이트
// ===============================
function updateButtonState() {
  const pw = passwordInput.value.trim();
  const pwCheck = passwordCheckInput.value.trim();

  const isValidPw = validatePassword(pw);
  const isMatch = pw && pwCheck && pw === pwCheck;

  if (isValidPw && isMatch) {
    submitBtn.classList.add("enabled");
    submitBtn.disabled = false;
  } else {
    submitBtn.classList.remove("enabled");
    submitBtn.disabled = true;
  }
}

// ===============================
// 입력 이벤트 초기화
// ===============================
function initPasswordEvents() {
  passwordInput.addEventListener("input", () => {
    const pw = passwordInput.value.trim();

    if (!pw) {
      helperPassword.textContent = "*비밀번호를 입력해주세요";
    } else if (!validatePassword(pw)) {
      helperPassword.textContent =
        "*비밀번호는 8~20자 / 대문자·소문자·숫자·특수문자를 최소 1개씩 포함해야 합니다.";
    } else {
      helperPassword.textContent = "";
    }

    checkPasswordConfirm();
    updateButtonState();
  });

  passwordCheckInput.addEventListener("input", () => {
    checkPasswordConfirm();
    updateButtonState();
  });

  document.querySelector(".password-form").addEventListener("submit", onSubmit);
}

// ===============================
// 제출 = 비밀번호 수정 API
// ===============================
async function onSubmit(e) {
  e.preventDefault();

  const pw = passwordInput.value.trim();
  const checkingpw = passwordCheckInput.value.trim();

  try {
    const res = await fetch("http://localhost:8080/api/user/password", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        password: pw,
        checkingpassword: checkingpw

     }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("비밀번호 수정 완료")

      passwordInput.value = "";
      passwordCheckInput.value = "";

      updateButtonState();
    } else {
      alert(data.error || "비밀번호 수정에 실패했습니다.");
    }
  } catch (err) {
    console.error("비밀번호 수정 오류:", err);
    alert("서버 오류가 발생했습니다.");
  }
}

// ===============================
// 로그아웃 API
// ===============================
async function logout() {
  try {
    const res = await fetch("http://localhost:8080/api/user/session", {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      window.location.href = "/html/index.html";
    } else {
      alert("로그아웃 실패");
    }
  } catch (err) {
    console.error("로그아웃 오류:", err);
  }
}

window.logout = logout;

// ===============================
// 토스트 메시지
// ===============================
function showToast(message) {
  const exists = document.querySelector(".toast-msg");
  if (exists) exists.remove();

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

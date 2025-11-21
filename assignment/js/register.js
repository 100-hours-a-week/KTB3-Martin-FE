/* ============================
   요소 선택
============================ */
const fileInput = document.getElementById("profile");
const profilePreview = document.getElementById("profilePreview");
const signupForm = document.querySelector("form");
const inputs = signupForm.querySelectorAll(".input");
const signupBtn = document.querySelector(".btn-primary");
const plusIcon = document.getElementById("profilePlus");

const emailInput = inputs[0];
const passwordInput = inputs[1];
const passwordCheckInput = inputs[2];
const nicknameInput = inputs[3];

const profileHelper = document.querySelector(".profile-helper");
const emailHelper = emailInput.nextElementSibling;
const passwordHelper = passwordInput.nextElementSibling;
const passwordCheckHelper = passwordCheckInput.nextElementSibling;
const nicknameHelper = nicknameInput.nextElementSibling;

const validatestate = {
  profile: false,
  email: false,
  password: false,
  checkingpassword: false,
  nickname: false,
};

let uploadedImageFile = null; // 실제 업로드된 파일

profilePreview.addEventListener("click", (e) => {
  if (!window.profileUploaded) {
    fileInput.click();
    return;
  } else {
    const ok = confirm("프로필 이미지를 삭제하시겠습니까?");
    if (ok) {
      e.preventDefault();
      e.stopPropagation();
      profilePreview.removeAttribute("src");
      profilePreview.style.display = "none";
      plusIcon.style.display = "block";
      profileHelper.textContent = "*프로필 사진을 추가해주세요";
      validatestate.profile = false;
      uploadedImageFile = null;
      fileInput.value = "";
    }
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  uploadedImageFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    profilePreview.src = e.target.result;
    profilePreview.style.display = "block";
    plusIcon.style.display = "none";
    validatestate.profile = true;
    profileHelper.textContent = "";
  };
  reader.readAsDataURL(file);
});

emailInput.addEventListener("blur", () => {
  validatestate.email = validateEmail();
  validateAll();
});

passwordInput.addEventListener("blur", () => {
  validatestate.password = validatePassword();
  validateAll();
});

passwordCheckInput.addEventListener("blur", () => {
  validatestate.checkingpassword = validatePasswordCheck();
  validateAll();
});
nicknameInput.addEventListener("blur", () => {
  validatestate.nickname = validateNickname();
  validateAll();
});

async function validateEmail() {
  const email = emailInput.value.trim();
  emailHelper.textContent = "";

  if (!email) {
    emailHelper.textContent = "*이메일을 입력해주세요.";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    emailHelper.textContent =
      "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    return false;
  }
  try {
    const res = await fetch(
      `http://localhost:8080/api/user/email-conflict?email=${email}`
    );
    const data = await res.json();
    if (data) {
      emailHelper.textContent = "*중복된 이메일 입니다.";
      return false;
    }
  } catch (error) {
    emailHelper.textContent = "네트워크 오류가 발생했습니다.";
    return false;
  }

  return true;
}

/* ============================
   3. 비밀번호 유효성 검사
============================ */
function validatePassword() {
  const pw = passwordInput.value.trim();
  passwordHelper.textContent = "";

  if (!pw) {
    passwordHelper.textContent = "*비밀번호를 입력해주세요";
    return false;
  }

  // 8~20자 + 대문자 + 소문자 + 숫자 + 특수문자
  const pwRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;

  if (!pwRegex.test(pw)) {
    passwordHelper.textContent =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자/소문자/숫자/특수문자를 각각 최소 1개 포함해야 합니다.";
    return false;
  }

  return true;
}

/* ============================
   4. 비밀번호 확인 검사
============================ */
function validatePasswordCheck() {
  const pw = passwordInput.value.trim();
  const pw2 = passwordCheckInput.value.trim();

  passwordCheckHelper.textContent = "";

  if (!pw2) {
    passwordCheckHelper.textContent = "*비밀번호를 한번 더 입력해주세요";
    return false;
  }

  if (pw !== pw2) {
    passwordCheckHelper.textContent = "*비밀번호가 다릅니다";
    return false;
  }

  return true;
}

/* ============================
   5. 닉네임 유효성 검사
============================ */
async function validateNickname() {
  const nickname = nicknameInput.value.trim();
  nicknameHelper.textContent = "";

  if (!nickname) {
    nicknameHelper.textContent = "*닉네임을 입력해주세요.";
    return false;
  }

  if (nickname.includes(" ")) {
    nicknameHelper.textContent = "*띄어쓰기를 없애주세요";
    return false;
  }

  if (nickname.length > 10) {
    nicknameHelper.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
    return false;
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/user/nickname-conflict?nickname=${nickname}`
    );
    console.log(`${nickname}`);
    const data = await res.json();
    console.log(data);

    if (data) {
      nicknameHelper.textContent = "*중복된 닉네임 입니다.";
      return false;
    }
  } catch {
    if (error) {
      nicknameHelper.textContent = "네트워크 오류가 발생했습니다.";
      return false;
    }
  }

  return true;
}

/* ============================
   6. 모든 유효성 검사 후 버튼 활성화
============================ */
function validateAll() {
  const ok =
    validatestate.email &&
    validatestate.password &&
    validatestate.checkingpassword &&
    validatestate.nickname &&
    validatestate.profile;

  if (ok) {
    signupBtn.disabled = false;
    signupBtn.style.backgroundColor = "#7F6AEE";
  } else {
    signupBtn.disabled = true;
    signupBtn.style.backgroundColor = "#ACA0EB";
  }
}

/* ============================
   7. 회원가입 제출
============================ */
signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let uploadedUrl = "/images/default-profile.png";

  // --- 프로필 이미지 서버 업로드 ---
  if (uploadedImageFile) {
    const fd = new FormData();
    fd.append("image", uploadedImageFile);

    const res = await fetch("http://localhost:8080/api/user/profile", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (res.ok) {
      uploadedUrl = data.url;
    } else {
      alert("프로필 이미지 업로드 실패");
      return;
    }
  }

  const signupRes = await fetch("http://localhost:8080/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      checkingpassword: passwordCheckInput.value.trim(),
      nickname: nicknameInput.value.trim(),
      image: uploadedUrl,
    }),
  });

  const signupData = await signupRes.json();

  if (signupRes.ok) {
    alert("회원가입 완료!");
    window.location.href = "index.html";
  } else {
    alert(signupData.message || "회원가입 실패");
  }
});

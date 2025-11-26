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



const State = {
  profilePreview: {
    valid: false,
    message: "*프로필 사진을 추가해주세요",
    previewUrl: "",
  },
  email: { valid: false, message: "" },
  password: { valid: false, message: "" },
  checkingpassword: { valid: false, message: "" },
  nickname: { valid: false, message: "" },
};

function setState(key, value) {
  State[key] = value;
  render();
}



let uploadedImageFile = null; // 실제 업로드된 파일






profilePreview.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("test");
  if (!State.profilePreview.valid){
    fileInput.click();
    return;
  }

  if (confirm("프로필 이미지를 삭제하시겠습니까?")) {
    uploadedImageFile = null;
    fileInput.value = "";
    setState("profilePreview", {
      valid: false,
      message: "*프로필 사진을 추가해주세요",
      previewUrl: "",
    });
    console.log("test");
  }
  

});


fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  uploadedImageFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    let src = e.target.result;
    let value = { valid: true, message: "", previewUrl: src };
    setState("profilePreview", value)
  };

  fileInput.value = "";
  reader.readAsDataURL(file);
  
});




async function bindValidate(input, key, validator) {
  input.addEventListener("blur", async () => {
    const value = await validator();
    setState(key, value);
  });
}
bindValidate(emailInput, "email", validateEmail);
bindValidate(passwordInput, "password", validatePassword);
bindValidate(passwordCheckInput, "checkingpassword", validatePasswordCheck);
bindValidate(nicknameInput, "nickname", validateNickname);

async function validateEmail() {
  const email = emailInput.value.trim();
  let text = "";

  if (!email) {
    return { valid: false, message: "*이메일을 입력해주세요." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    text = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    return { valid: false, message: text };
  }
  try {
    const res = await fetch(
      `http://localhost:8080/api/user/email-conflict?email=${email}`
    );
    const data = await res.json();
    if (data) {
      text = "*중복된 이메일 입니다.";
      return { valid: false, message: text };
    }
  } catch (error) {
    text = "네트워크 오류가 발생했습니다.";
    return { valid: false, message: text };
  }

  return { valid: true, message: "" };
}

function validatePassword() {
  const pw = passwordInput.value.trim();
  let text;

  if (!pw) {
    text = "*비밀번호를 입력해주세요";
    return { valid: false, message: text };
  }

  // 8~20자 + 대문자 + 소문자 + 숫자 + 특수문자
  const pwRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;

  if (!pwRegex.test(pw)) {
    text =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자/소문자/숫자/특수문자를 각각 최소 1개 포함해야 합니다.";
    return { valid: false, message: text };
  }

  return { valid: true, message: text };
}

function validatePasswordCheck() {
  const pw = passwordInput.value.trim();
  const pw2 = passwordCheckInput.value.trim();

  let text = "";

  if (!pw2) {
    text = "*비밀번호를 한번 더 입력해주세요";
    return { valid: false, message: text };
  }

  if (pw !== pw2) {
    text = "*비밀번호가 다릅니다";
    return { valid: false, message: text };
  }

  return { valid: true, message: text };
}

async function validateNickname() {
  const nickname = nicknameInput.value.trim();
  let text = "";

  if (!nickname) {
    text = "*닉네임을 입력해주세요.";
    return { valid: false, message: text };
  }

  if (nickname.includes(" ")) {
    text = "*띄어쓰기를 없애주세요";
    return { valid: false, message: text };
  }

  if (nickname.length > 10) {
    text = "*닉네임은 최대 10자까지 작성 가능합니다.";
    return { valid: false, message: text };
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/user/nickname-conflict?nickname=${nickname}`
    );

    const data = await res.json();

    if (data) {
      text = "*중복된 닉네임 입니다.";
      return { valid: false, message: text };
    }
  } catch {
    if (error) {
      text = "네트워크 오류가 발생했습니다.";
      return { valid: false, message: text };
    }
  }

  return { valid: true, message: text };
}

function render() {
  Object.keys(State).forEach((key) => {
    const { valid, message, previewUrl } = State[key];
    const fieldInput = document.getElementById(key);

    if (key === "profilePreview") {
      console.log("test");
      const helper = document.querySelector(".profile-helper");

      helper.textContent = message;
      profilePreview.style.display = valid ? "block" : "none";
      plusIcon.style.display = valid ? "none" : "block";
      profilePreview.src = previewUrl;
      return;
    } else {
      const helper = fieldInput.nextElementSibling;
      helper.textContent = message || "";
    }
  });

  const allValid = Object.values(State).every((s) => s.valid === true);
  signupBtn.disabled = !allValid;
  signupBtn.style.backgroundColor = allValid ? "#7F6AEE" : "#ACA0EB";
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

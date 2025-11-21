// 회원정보수정 페이지 JS
// - 세션 체크
// - 프로필 드롭다운
// - 프로필 이미지 변경(미리보기)
// - 닉네임 검증 + 중복검사 + 이미지 함께 수정
// - 회원 탈퇴
// - 토스트 메시지

let emailInput;
let nicknameInput;
let profileImg;
let avatarBtn;
let helper;
let btnUpdate;
let btnDelete;
let btnChangePhoto;
let photoInput;

document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 캐싱
  emailInput = document.getElementById("email");
  nicknameInput = document.getElementById("nickname");
  profileImg = document.getElementById("profileImage");
  avatarBtn = document.getElementById("avatar");
  helper = document.querySelector(".helper");
  btnUpdate = document.getElementById("btnUpdate");
  btnDelete = document.getElementById("btnDelete");
  btnChangePhoto = document.getElementById("btnChangePhoto");
  photoInput = document.getElementById("photoInput");
  
  document.querySelector(".appbar__title").addEventListener("click", () => {
        window.location.href = "/html/posts.html"
    });

  checkSession();
  initDropdown();
  initProfileImage();
  loadCurrentUser();
  initUpdate();
  initDelete();
});

// ===============================
// 세션 체크
// ===============================
async function checkSession() {
  try {
    const res = await fetch("http://localhost:8080/api/user", {
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      alert("로그인이 필요합니다.");
      window.location.href = "index.html";
      return;
    }

    // 필요하면 여기서 user data 사용 가능
    await res.json();
  } catch (err) {
    console.error("checkSession error:", err);
    window.location.href = "index.html";
  }
}

// ===============================
// 현재 로그인 유저 정보 불러오기
// ===============================
async function loadCurrentUser() {
  try {
    const res = await fetch("http://localhost:8080/api/user", {
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("유저 정보를 불러오지 못했습니다.");
      return;
    }

    const { data } = await res.json();

    if (emailInput && data.email) emailInput.value = data.email;
    if (nicknameInput && data.nickname) nicknameInput.value = data.nickname;

    // 프로필 이미지 (백엔드에서 내려주는 경로에 맞게 조정)
    if (data.imageurl) {
      const fullUrl = `http://localhost:8080${data.imageurl}`;
      if (profileImg) profileImg.src = fullUrl;
      if (avatarBtn) avatarBtn.style.backgroundImage = `url('${fullUrl}')`;
    }
  } catch (err) {
    console.error("유저 정보 로드 에러:", err);
  }
}

// ===============================
// 프로필 드롭다운 메뉴
// ===============================
function initDropdown() {
  const avatar = document.getElementById("avatar");
  const dropdown = document.getElementById("dropdownMenu");

  if (!avatar || !dropdown) return;

  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== avatar) {
      dropdown.classList.remove("active");
    }
  });
}

// HTML에서 직접 호출하는 용도 (onclick="logout()")
async function logout() {
  try {
    const res = await fetch("http://localhost:8080/api/user/session", {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "/html/login.html";
    } else {
      alert("로그아웃에 실패했습니다.");
    }
  } catch (err) {
    console.error("로그아웃 에러:", err);
    alert("로그아웃 중 오류가 발생했습니다.");
  }
}

window.logout = logout; // 전역 노출

// ===============================
// 프로필 이미지 변경 (미리보기)
// ===============================

let uploadedImageFile = null;
function initProfileImage() {
  if (!btnChangePhoto || !photoInput || !profileImg) return;

  btnChangePhoto.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    console.log("test");
    uploadedImageFile = file;

    // 미리보기
    const previewUrl = URL.createObjectURL(file);
    profileImg.src = previewUrl;
    if (avatarBtn) {
      avatarBtn.style.backgroundImage = `url('${previewUrl}')`;
    }
  });
}

// ===============================
// 닉네임 기본 유효성 검사
// ===============================
function validateNicknameBasic(nickname) {
  const value = nickname.trim();

  if (!value) {
    return "*닉네임을 입력해주세요.";
  }

  if (value.length > 10) {
    return "*닉네임은 최대 10자 까지 작성 가능합니다.";
  }

  return null; // 통과
}

// ===============================
// 수정하기 버튼 초기화
// ===============================
function initUpdate() {
  if (!btnUpdate || !nicknameInput || !helper) return;
  btnUpdate.addEventListener("click", onClickUpdate);
}

// ===============================
// 닉네임 + 이미지 함께 수정
// ===============================
async function onClickUpdate() {
  const nickname = nicknameInput.value.trim();
  helper.textContent = "";

  // 1) 기본 닉네임 유효성 검사
  const basicError = validateNicknameBasic(nickname);
  if (basicError) {
    helper.textContent = basicError;
    return;
  }

  // 2) 닉네임 중복 검사
  try {
    const dupRes = await fetch(
      `http://localhost:8080/api/user/nickname-conflict?nickname=${encodeURIComponent(
        nickname
      )}`,
      { credentials: "include" }
    );

    if (!dupRes.ok) {
      console.warn("닉네임 중복 체크 실패:", dupRes.status);
      helper.textContent = "닉네임 확인 중 오류가 발생했습니다.";
      return;
    }

    const dupData = await dupRes.json();
    const isDuplicate = dupData.data === true || dupData === true;

    if (isDuplicate) {
      helper.textContent = "*중복된 닉네임 입니다.";
      return;
    }
  } catch (err) {
    console.error("중복 검사 오류:", err);
    helper.textContent = "닉네임 확인 중 오류가 발생했습니다.";
    return;
  }

  // 3) FormData 준비 (닉네임 + 이미지)
  const file = uploadedImageFile;

  const formData = new FormData();
  formData.append("nickname", nickname);

  if (file) {
    formData.append("image", file); // 서버에서 받는 필드명과 일치해야 함
  }

  // 4) 업로드 요청 (/api/user/profile)
  try {
    const res = await fetch("http://localhost:8080/api/user/profile", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const responseBody = await res.json();

    // 서버에서 돌려준 이미지 URL UI 반영
    let url = responseBody.url;



    profileImg.src = `http://localhost:8080${url}`;
    avatarBtn.style.backgroundImage = `url('http://localhost:8080${url}')`;

    const response = await fetch("http://localhost:8080/api/user", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      
      nickname: nickname,
      image: url
    })
  });

    if(response.ok) showToast("수정완료");

  } catch (err) {
    console.error("프로필 업데이트 에러:", err);
    helper.textContent = "수정 중 오류가 발생했습니다.";
  }
}

// ===============================
// 회원 탈퇴
// ===============================
function initDelete() {
  if (!btnDelete) return;

  const modal = document.getElementById("deleteModal");
  const cancelBtn = document.getElementById("modalCancelDelete");
  const confirmBtn = document.getElementById("modalConfirmDelete");

  // 탈퇴 버튼 누르면 모달 열기
  btnDelete.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // 취소 → 모달 닫기
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 외부 배경 눌러도 닫히게
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-modal__backdrop")) {
      modal.classList.add("hidden");
    }
  });

  // 확인 → 실제 회원탈퇴 API 호출
  confirmBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "index.html";
      } else {
        alert("회원 탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원 탈퇴 에러:", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  });
}


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

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

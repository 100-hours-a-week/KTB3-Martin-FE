


 export async function initDropdown() {
  const profileImg = document.querySelector("#nav-profile");
  const menu = document.querySelector("#profile-menu");

  if (!profileImg || !menu) return;

  // 열기/닫기
  profileImg.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
  });

  // 바깥 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

  // 메뉴 이동 함수를 단순화
  const go = (selector, url) => {
    const item = document.querySelector(selector);
    if (item) item.addEventListener("click", () => (window.location.href = url));
  };

  go("#menu-edit", "edit-profile.html");
  go("#menu-password", "edit-passwd.html");
  go("#menu-home", "posts.html");

  const logout = document.querySelector("#menu-logout");
  if (logout) {
    logout.addEventListener("click", async () => {
      await fetch("http://localhost:8080/api/user/session", {
        method: "DELETE",
        credentials: "include",
      });
      window.location.href = "index.html";
    });
  }
}



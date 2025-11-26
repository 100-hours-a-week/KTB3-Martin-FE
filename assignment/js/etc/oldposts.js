document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  loadCurrentUser();
  loadPosts();
  const profileImg = document.querySelector("#nav-profile");
  const profileMenu = document.querySelector("#profile-menu");


  // 프로필 클릭 → 메뉴 toggle
  profileImg.addEventListener("click", () => {
    profileMenu.classList.toggle("hidden");
  });

  // 화면 아무데나 클릭하면 메뉴 닫힘
  document.addEventListener("click", (e) => {
    if (!profileImg.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.add("hidden");
    }
  });
});

document.querySelector("#menu-edit").addEventListener("click", () => {
  window.location.href = "edit-profile.html";
});

document.querySelector("#menu-password").addEventListener("click", () => {
  window.location.href = "edit-passwd.html";
});

document.querySelector("#menu-logout").addEventListener("click", async () => {
  await fetch("http://localhost:8080/api/user/session", {
    method: "delete",
    credentials: "include"
  });
  window.location.href = "index.html";
});

document.querySelector("#menu-home").addEventListener("click", () => {
  window.location.href = "posts.html";
});


document.querySelector("#btn-write").addEventListener("click", () => {
  window.location.href = "/html/form.html";
});






async function checkSession() {
  try {
    const res = await fetch("http://localhost:8080/api/user", {
      credentials: "include",
    });

    // 세션 없음 → 로그인 페이지로 이동
    if (res.status === 401 || res.status === 403) {
      alert("로그인이 필요합니다.");
      window.location.href = "index.html";
      
    }
  

    // 정상 유저면 avatar 표시 및 게시글 로딩
    const user = await res.json();
    

  } catch (err) {
    console.error("checkSession error:", err);
    alert("서버와 연결불가.");
    window.location.href = "index.html";
  }
}

async function loadPosts() {
  const res = await fetch("http://localhost:8080/api/posts", {
    credentials: "include",
  });

  const result = await res.json();
  const posts = result.data;

  const container = document.querySelector("#post-list");
  container.innerHTML = "";

  posts.forEach(post => {
    container.appendChild(createCard(post));
  });
}

function createCard(post) {
  const article = document.createElement("article");
  article.className = "card";

  // 카드 전체를 클릭 가능하게
  article.style.cursor = "pointer";

  // 상세페이지 이동
  article.addEventListener("click", () => {
    window.location.href = `/html/post-detail.html?postId=${post.id}`;
  });

  const imgUrl = post.userimage
    ? `http://localhost:8080${post.userimage}`
    : "../images/default-profile.jpg";

  article.innerHTML = `
    <h3 class="title">${post.title}</h3>

    <div class="meta">
      <span>좋아요 ${post.likes}</span><span class="sep"></span>
      <span>댓글 ${post.comments}</span><span class="sep"></span>
      <span>조회수 ${post.view}</span>
    </div>

    <div class="row">
      <div class="author">
        <img class="author-avatar" src="${imgUrl}">
        <span class="author-name">${post.author}</span>
      </div>
      <time class="time">${post.birthtime}</time>
    </div>
  `;

  return article;
}





async function loadCurrentUser() {
  const res = await fetch("http://localhost:8080/api/user", {
    credentials: "include",
  });

  const result = await res.json();
  const user = result.data;

  const profileImg = document.querySelector("#nav-profile");
  profileImg.src = `http://localhost:8080${user.imageurl}`|| "../images/default-profile.jpg";
}



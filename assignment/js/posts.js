document.addEventListener("DOMContentLoaded", () => {
    loadPosts();

});

document.querySelector("#btn-write").addEventListener("click", () => {
  window.location.href = "/html/form.html";
});

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
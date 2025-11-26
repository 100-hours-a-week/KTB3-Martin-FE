import * as util from "./common/common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await util.checkSession();
  util.loadCurrentUser(user);
  util.initDropdown();

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
  // container.innerHTML = "";

  posts.forEach((post) => {
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




  
  //article 짜맞추기
  //title
  const title = document.createElement("h3");
  title.className = "title";
  title.textContent = `${post.title}`;
  article.appendChild(title);

  //meta
  const meta = document.createElement("div");
  meta.className = "meta";

  const likes = document.createElement("span");
  likes.textContent = `좋아요 ${post.likes}`;
  const comments = document.createElement("span");
  comments.textContent = `댓글 ${post.comments}`;
  const view = document.createElement("span");
  view.textContent = `조회수 ${post.view}`;

  meta.append(likes, comments, view);
  article.appendChild(meta);

  //row
  const row = document.createElement("div");
  row.className = "row";

  //author
  const author = document.createElement("div");
  author.className = "author";

  const img = document.createElement("img");
  img.className = "author-avatar";
  img.src = `${imgUrl}`;

  const author_name = document.createElement("span");
  author_name.className = "author-name";
  author_name.textContent = `${post.author}`;

  author.append(img, author_name);

  //time
  const time = document.createElement("time");
  time.className = "time";
  time.textContent = `${post.birthtime}`;

  row.appendChild(author);
  row.appendChild(time);

  article.appendChild(row);

  return article;
}

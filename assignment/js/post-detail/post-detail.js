import * as util from "../common/common.js";

let currentUser = null;
let editMode = false; // 지금 수정 모드인지
let editCommentId = null; // 수정 중인 댓글 ID

const deleteBtn = document.querySelector("#btn-delete");

//모달
const modal = document.querySelector("#post-delete-modal");
const confirmBtn = document.querySelector("#post-modal-confirm");
const cancelBtn = document.querySelector("#post-modal-cancel");

document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await util.checkSession();
  util.loadCurrentUser(currentUser);
  util.initDropdown();

  loadPostDetail();

  // 댓글 등록/수정 버튼 이벤트
  document
    .querySelector(".comment-submit")
    .addEventListener("click", handleCommentSubmit);

  // Enter 키로도 등록/수정
  document.querySelector(".comment-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  });
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 확인 버튼 → 게시글 삭제 API 호출
confirmBtn.addEventListener("click", async () => {
  const params = new URLSearchParams(location.search);
  const postId = params.get("postId");

  const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
    method: "DELETE",
  });

  modal.classList.add("hidden");

  if (res.ok) {
    alert("게시글이 삭제되었습니다.");
    window.location.href = "./posts.html"; // 목록으로 이동
  } else {
    alert("게시글 삭제 실패");
  }
});

document.getElementById("btn-edit").addEventListener("click", () => {
  const params = new URLSearchParams(location.search);
  const postId = params.get("postId");
  window.location.href = `/html/form.html?postId=${postId}`;
});

async function loadPostDetail() {
  const params = new URLSearchParams(location.search);
  const postId = params.get("postId");

  if (!postId) {
    alert("잘못된 접근입니다.");
    return;
  }

  const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
    credentials: "include",
  });

  const result = await res.json();
  const post = result.data.post;
  const comments = result.data.comments;

  renderPost(post);
  renderComments(comments);
}

/* -----------------------------
  게시글 정보 렌더링
-------------------------------- */
function renderPost(post) {
  const baseURL = "http://localhost:8080";

  document.querySelector(".post-title").textContent = post.title;
  document.querySelector(".post-content").textContent = post.content;
  document.querySelector(".author-name").textContent = post.author;
  document.querySelector(".post-date").textContent = post.birthtime;

  // ⭐ 게시글 수정/삭제 버튼 표시
  const postActions = document.querySelector(".post-actions");
  if (currentUser && currentUser.nickname === post.author) {
    postActions.style.display = "flex";
  } else {
    postActions.style.display = "none";
  }

  // 작성자 이미지
  const authorImgEl = document.querySelector(".author-img");
  authorImgEl.src = post.userimage
    ? baseURL + post.userimage
    : "../images/default-profile.jpg";

  const postImageEl = document.querySelector(".post-image");

  if (post.image) {
    postImageEl.src = baseURL + post.image;
    postImageEl.style.display = "block";
  } else {
    postImageEl.style.display = "none";
  }

  // 좋아요/조회수/댓글수
  const statValues = document.querySelectorAll(".stat-value");
  statValues[0].textContent = formatNumber(post.likes);

  // loadLikeStatus(post.id);
  setupLikeBox(post.id);
}

/* -----------------------------
  댓글 목록 렌더링
-------------------------------- */
function renderComments(comments) {
  const baseURL = "http://localhost:8080";
  const commentListEl = document.querySelector(".comment-list");

  commentListEl.innerHTML = "";

  if (!comments || comments.length === 0) {
    commentListEl.innerHTML = `
      <div style="text-align:center; color:#777; padding:20px;">
        댓글이 없습니다.
      </div>
    `;
    return;
  }

  comments.forEach((c) => {
    const item = document.createElement("div");
    item.classList.add("comment-item");

    const profileImg = c.userimage
      ? baseURL + c.userimage
      : "../images/default-profile.jpg";

    item.innerHTML = `
      <div class="comment-author">
        <img class="comment-img" src="${profileImg}" />
        <span class="comment-name">${c.author}</span>
        <span class="comment-date">${c.birthTime}</span>
      </div>

      <div class="comment-body">${c.content}</div>

      <div class="comment-actions">
        <button class="edit-btn" data-id="${c.id}">수정</button>
        <button class="delete-btn" data-id="${c.id}">삭제</button>
      </div>
    `;

    const actionBox = item.querySelector(".comment-actions");

    // ⭐ 댓글 작성자만 수정/삭제 버튼 보이기
    if (currentUser && currentUser.nickname === c.author) {
      actionBox.style.display = "flex";
    } else {
      actionBox.style.display = "none";
    }

    // ⭐ 댓글 수정 이벤트
    item.querySelector(".edit-btn").addEventListener("click", () => {
      const textarea = document.querySelector(".comment-input");
      const submitBtn = document.querySelector(".comment-submit");

      textarea.value = c.content;
      submitBtn.textContent = "댓글 수정";

      editMode = true;
      editCommentId = c.id;
    });

    // ⭐ 삭제 버튼 클릭 이벤트
    item.querySelector(".delete-btn").addEventListener("click", () => {
      const modal = document.querySelector("#delete-modal");
      const confirmBtn = document.querySelector("#modal-confirm");
      const cancelBtn = document.querySelector("#modal-cancel");

      modal.classList.remove("hidden");

      // 확인 클릭 시 실제 삭제
      confirmBtn.onclick = async () => {
        const res = await fetch(
          `http://localhost:8080/api/comments/${c.postid}/${c.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        modal.classList.add("hidden");

        if (res.ok) {
          alert("댓글이 삭제되었습니다.");
          loadPostDetail();
        } else {
          alert("삭제 실패");
        }
      };

      // 취소 클릭 시 모달 닫기
      cancelBtn.onclick = () => {
        modal.classList.add("hidden");
      };
    });

    commentListEl.appendChild(item);
  });
}



/* -----------------------------
  댓글 등록/수정 API 처리
-------------------------------- */
async function handleCommentSubmit() {
  const textarea = document.querySelector(".comment-input");
  const content = textarea.value.trim();

  if (!content) {
    alert("내용을 입력하세요.");
    return;
  }

  const params = new URLSearchParams(location.search);
  const postId = params.get("postId");

  /* ======================
      ✏ 수정 모드
  ======================= */
  if (editMode) {
    console.log(editCommentId);
    console.log(content);
    const res = await fetch(
      `http://localhost:8080/api/comments/${postId}/${editCommentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      }
    );

    if (!res.ok) {
      alert("댓글 수정 실패");
      return;
    }

    alert("댓글이 수정되었습니다.");
    editMode = false;
    editCommentId = null;
    textarea.value = "";
    document.querySelector(".comment-submit").textContent = "댓글 등록";

    loadPostDetail();
    return;
  }

  /* ======================
      ➕ 등록 모드
  ======================= */
  const res = await fetch(`http://localhost:8080/api/comments/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    alert("댓글 등록 실패");
    return;
  }

  alert("댓글이 등록되었습니다.");
  textarea.value = "";
  loadPostDetail();
}

// 숫자 축약 (1k, 10k, 100k)
function formatNumber(num) {
  if (num >= 100000) return Math.floor(num / 1000) + "k";
  if (num >= 10000) return Math.floor(num / 1000) + "k";
  if (num >= 1000) return Math.floor(num / 1000) + "k";
  return num;
}

async function loadLikeStatus(postId) {
  const res = await fetch(
    `http://localhost:8080/api/likes/mylike/${postId}`,
    {}
  );

  const liked = await res.json(); // true/false
  const likeBox = document.querySelector(".post-stats .stat-box:nth-child(1)");

  if (liked) {
    likeBox.classList.add("liked");
  } else {
    likeBox.classList.remove("liked");
  }
}

// async function islike(postId){
//   const res = await fetch(
//     `http://localhost:8080/api/likes/mylike/${postId}`,
//     {}
//   );
//   const liked = await renderComments.json();
//   return liked

// }

function setupLikeBox(postId) {
  const likeBox = document.querySelector(".post-stats .stat-box:nth-child(1)");
  const likeValue = likeBox.querySelector(".stat-value");


  likeBox.addEventListener("click", async () => {
    const isLiked = likeBox.classList.contains("liked");
    let res;

    // 좋아요 취소
    if (isLiked) {
      res = await fetch(`http://localhost:8080/api/likes/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        likeBox.classList.remove("liked");
        likeValue.textContent = formatNumber(
          Number(likeValue.textContent.replace("k", "")) - 1
        );
      }
    }
    // 좋아요 추가
    else {
      res = await fetch(`http://localhost:8080/api/likes/${postId}`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        likeBox.classList.add("liked");
        likeValue.textContent = formatNumber(
          Number(likeValue.textContent.replace("k", "")) + 1
        );
      }
    }
  });
}

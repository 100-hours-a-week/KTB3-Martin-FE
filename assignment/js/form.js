import * as util from "./common/common.js";

let postId = null; // 수정 모드 여부 판단용
let Post = null;
let currentUser = null;


// =====================================================
//                🔵 DOM 요소
// =====================================================
const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("btn-write");

// =====================================================
//                🔵 초기 설정
// =====================================================
document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".appbar__title").addEventListener("click", () => {
    window.location.href = "/html/posts.html";
  });

  // URL 파라미터에서 postId 확인 → 수정 모드인지 판단
  const urlParams = new URLSearchParams(window.location.search);
  postId = urlParams.get("postId");

  // 세션 체크 및 현재 사용자 정보 불러오기
  let currentUser = await util.checkSession();
  util.loadCurrentUser(currentUser);
  util.initDropdown();

  // 수정 모드일 경우 기존 내용 불러오기
  if (postId) loadPostData(postId);

  

  
  

  
});

titleInput.addEventListener("input", updateSubmitButton);
contentInput.addEventListener("input", updateSubmitButton);

// =====================================================
//        🔵 게시글 기존 데이터 불러오기 (수정 모드)
// =====================================================
async function loadPostData(id) {
  try {
    const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
      credentials: "include",
    });

    const json = await res.json();
    const post = json.data.post;
    Post = json.data.post;

    titleInput.value = post.title;
    contentInput.value = post.content;

  

    // 기존 이미지가 있다면 안내 문구 출력
    updateSubmitButton();


  } catch (e) {
    console.error("게시글 로딩 실패:", e);
  }
}

// =====================================================
//        🔵 게시글 작성 또는 수정 요청 처리
// =====================================================
submitBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  console.log(title);
  const content = contentInput.value.trim();
  console.log(content);
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (!title || !content) {
    const helpertext = document.querySelector(".helper-text");
    helpertext.textContent = "제목과 내용을 입력하세요";
    return;
  }
  let imageurl = "";

  if (imageFile) {
    const fd = new FormData();
    fd.append("image", imageFile);

    const res = await fetch("http://localhost:8080/api/images/posts", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const data = await res.json();

    if (!res.ok) {
      alert("이미지 업로드 실패");
      return;
    }

    imageurl = data.url;
  }
  else{
    if(Post){
      imageurl = Post.image;

    }
    else{
      imageurl = "";
    }
    
  }

  const payload = {
    title,
    content,
    image: imageurl,
  };

  try {
    let url = "http://localhost:8080/api/posts";
    let method = "POST";

    // ✦ 수정 모드일 경우 PUT 호출
    if (postId) {
      url = `http://localhost:8080/api/posts/${postId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.ok) {
      alert(postId ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다.");
      window.location.href = `/html/post-detail.html?postId=${json.data.id}`;
    } else {
      alert(json.message || "오류가 발생했습니다.");
    }
  } catch (e) {
    console.error(e);
    alert("네트워크 오류가 발생했습니다.");
  }
});

function updateSubmitButton() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (title && content) {
    submitBtn.classList.remove("disabled");
    submitBtn.classList.add("active");
  } else {
    submitBtn.classList.add("disabled");
    submitBtn.classList.remove("active");
  }
}

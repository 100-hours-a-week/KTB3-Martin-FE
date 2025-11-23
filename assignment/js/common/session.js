
export async function checkSession() {
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
    window.location.href = "index.html";
  }
}


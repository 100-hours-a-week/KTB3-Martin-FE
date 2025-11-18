const ul = document.getElementById("posts");
const btn = document.getElementById("load");

btn.addEventListener("click", () => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(posts => {
      ul.innerHTML = ""; // 기존 내용 지우기
      posts.slice(0, 10).forEach(post => { // 앞의 10개만 표시
        const li = document.createElement("li");
        li.textContent = post.title;
        ul.appendChild(li);
      });
    })
    .catch(err => console.error("에러:", err));
});
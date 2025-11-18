const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const btn = document.getElementById("post-btn");
const ul = document.getElementById("posts");

btn.addEventListener("click", () => {
  const postData = {
    title: titleInput.value,
    body: bodyInput.value,
    userId: 1
  };

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(newPost => {
      console.log("서버 응답:", newPost);

      // 새 게시글을 화면에 추가
      const li = document.createElement("li");
      li.textContent = `${newPost.id}. ${newPost.title}`;
      ul.prepend(li); // 위쪽에 추가
    })
    .catch(err => console.error(err));
});

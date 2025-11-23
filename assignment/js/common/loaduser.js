document.addEventListener("DOMContentLoaded", ()=>{
    loadCurrentUser();
})



async function loadCurrentUser() {
  const res = await fetch("http://localhost:8080/api/user", {
    credentials: "include",
  });
  const result = await res.json();
  const user = result.data;
  const profileImg = document.querySelector("#nav-profile");
  profileImg.src = `http://localhost:8080${user.imageurl}`|| "../images/default-profile.jpg";
}
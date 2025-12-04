
export async function loadCurrentUser(user) {
  

  // const res = await fetch("http://localhost:8080/api/user", {
  //   credentials: "include",
  // });
  // const result = await res.json();
  // const user = result.data;
  const profileImg = document.querySelector("#nav-profile");
  profileImg.src = `http://localhost:8080${user.image}`|| "../images/default-profile.jpg";
}
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const li = document.createElement("li");
const ul = document.getElementById("ul");


function add() {
    let li = document.createElement("li");
    li.textContent = input.value;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => li.remove());

    ul.appendChild(li);
    input.value = "";
}

input.addEventListener("keydown", (event) =>{
    if(event.key === "Enter") add();
})
btn.addEventListener("click", add);

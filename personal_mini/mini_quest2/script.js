const title = document.getElementById("title");
const content = document.getElementById("content");
const input = document.getElementById("input");
const message = document.getElementById("message");
const btn1 = document.getElementById("btn1");


document.body.style.backgroundColor = "rgb(255,255,255)";


function greet() {
    let name = content.value;
    if(name == "") message.textContent = "아무거나 입력하기";
        else {
            message.textContent = "";
            content.value = "";
            title.textContent = name + "님, 안녕하세요 👋";
        }

}

function change(){
    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);
    const color = `rgb(${r}, ${g}, ${b})`;
    document.body.style.backgroundColor = color;
    message.textContent = color;
}



input.addEventListener("click", greet);
content.addEventListener("keydown" ,(event) =>{
    if(event.key === "Enter") greet();
} )
btn1.addEventListener("click", change);

window.addEventListener("DOMContentLoaded", () =>{
    message.textContent = document.body.style.backgroundColor;
});
const button = document.querySelectorAll(".test");
const picture = document.querySelectorAll(".imgContainer");
const xButton = document.querySelector(".xButton");

const ximgContainer = document.querySelectorAll(".imgContainer");

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", () => {
    let nextSibling = button[i].nextElementSibling;
    nextSibling.classList.toggle("hide");
  })
}

for (let i = 0; i < ximgContainer.length; i++) {
ximgContainer[i].addEventListener("click", () => {
ximgContainer[i].classList.toggle("hide");
})
}


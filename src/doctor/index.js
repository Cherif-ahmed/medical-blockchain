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


let fileInput = document.getElementById("file-input");
let imageContainer = document.getElementById("images");
let numOfFiles = document.getElementById("num-of-files");

function preview(){
    imageContainer.innerHTML = "";
    numOfFiles.textContent = `${fileInput.files.length} Files Selected`;

    for(i of fileInput.files){
        let reader = new FileReader();
        let figure = document.createElement("figure");
        let figCap = document.createElement("figcaption");
        figCap.innerText = i.name;
        figure.appendChild(figCap);
        reader.onload=()=>{
            let img = document.createElement("img");
            img.setAttribute("src",reader.result);
            figure.insertBefore(img,figCap);
        }
        imageContainer.appendChild(figure);
        reader.readAsDataURL(i);
        
    }
}


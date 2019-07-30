// ----------- Modal Functions -----------
var slideIndex = 1;
function closeModal(){
    var modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

function processImageClick(){
    processModal(this);
}

function processModal(currentImage){
    console.log(currentImage);
    slideIndex = parseInt(currentImage.getAttribute("data-image-identifier"));
    console.log(slideIndex);
    var modalMainWrapper = document.getElementById("modal-main-wrapper");
    var check = currentImage.getAttribute("data-image-identifier");
    var title = document.getElementById("title");
    var category = document.getElementById("category");

    // First clear all elements inside the wrapper
    if (modalMainWrapper.firstChild){
        while (modalMainWrapper.firstChild){
            modalMainWrapper.removeChild(modalMainWrapper.firstChild);
        }
    }

    for (elem in currentImageArray){
        var modalImageContainer = document.createElement("div");
        modalImageContainer.setAttribute("id","modal-image-container");
        modalImageContainer.setAttribute("class","sample");
        
        var imgTag = document.createElement("img");
        imgTag.setAttribute("id","modal-image");
        imgTag.setAttribute("src",currentImageArray[elem]["location"]);
        imgTag.setAttribute("data-image-title",currentImageArray[elem]["title"]);
        imgTag.setAttribute("data-image-category",currentImageArray[elem]["category"]);

        if (check == elem)
            modalImageContainer.style.display = "block";
        else
        modalImageContainer.style.display = "none";

        modalImageContainer.appendChild(imgTag);
        modalMainWrapper.appendChild(modalImageContainer);
    }
        
    var modal = document.getElementById("imageModal");
    
    modal.style.display = "block";
    title.innerHTML = currentImage.getAttribute("data-image-title");
    category.innerHTML = currentImage.getAttribute("data-image-category");
}

function changeImage(n){
    showImage(slideIndex += n);
}

function showImage(n) {
    console.log("n:"+n);
    var i;

    var slides = document.getElementsByClassName("sample");
    var title = document.getElementById("title");
    var category = document.getElementById("category");

    if (n > slides.length) {
        slideIndex = 1
    }
    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";
    title.innerHTML = slides[slideIndex-1].firstChild.getAttribute("data-image-title");
    category.innerHTML = slides[slideIndex-1].firstChild.getAttribute("data-image-category");

}

document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == 37) {
         document.querySelector('.prev').click();
         }
    else if (e.keyCode == 39) {
         document.querySelector('.next').click();
         }
     };
// --------------------------------------------
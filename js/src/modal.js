// ----------- Modal Functions -----------
var modal = (function (){
    var slideIndex = 1;

    return {
        generator: init,
        process: processImageClick,
        change: changeImage,
        close: closeModal
    }

    function init(){
        attachKeyboardInteraction();
    }

    function attachKeyboardInteraction(){
        document.onkeydown = function (e) {
            e = e || window.event;
            if (e.keyCode == 37) {
                document.querySelector('.prev').click();
            }
            else if (e.keyCode == 39) {
                document.querySelector('.next').click();
            }
        };
    }

    function closeModal(){
        var modal = document.getElementById("imageModal");
        modal.style.display = "none";

        var imageModalWrapper = document.getElementById("imageModalWrapper");
        imageModalWrapper.style.display = 'none';

        var imageModalWrapperOverlay = document.getElementById("imageModalWrapperOverlay");
        imageModalWrapperOverlay.style.display = 'none';
    }

    function processImageClick(){
        processModal(this.firstChild);
    }

    function processModal(currentImage){
        var imageModalWrapper = document.getElementById("imageModalWrapper");
        imageModalWrapper.style.display = 'block';

        var imageModalWrapperOverlay = document.getElementById("imageModalWrapperOverlay");
        imageModalWrapperOverlay.style.display = 'block';

        slideIndex = parseInt(currentImage.getAttribute("data-image-identifier"));

        var modalMainWrapper = document.getElementById("modal-main-wrapper");

        var check = currentImage.getAttribute("data-image-identifier");
        var title = document.getElementById("title");
        var category = document.getElementById("category");
        var date = document.getElementById("date");

        // First clear all elements inside the wrapper
        if (modalMainWrapper.firstChild){
            while (modalMainWrapper.firstChild){
                modalMainWrapper.removeChild(modalMainWrapper.firstChild);
            }
        }

        for (elem in gallery.currentImageArray){
            var modalImageContainer = document.createElement("div");
            modalImageContainer.setAttribute("id","modal-image-container");
            modalImageContainer.setAttribute("class","sample");

            var imgTag = document.createElement("img");
            imgTag.setAttribute("id","modal-image");
            imgTag.setAttribute("src",gallery.currentImageArray[elem]["location"]);
            imgTag.setAttribute("data-image-title",gallery.currentImageArray[elem]["title"]);
            imgTag.setAttribute("data-image-category",gallery.currentImageArray[elem]["category"]);
            imgTag.setAttribute("data-image-date",new Date(parseInt(gallery.currentImageArray[elem]["date"])).toLocaleDateString());

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
        date.innerHTML = new Date(parseInt(currentImage.getAttribute("data-image-date"))).toLocaleDateString();
    }

    function changeImage(n){
        showImage(slideIndex += n);
    }

    function showImage(n) {
        var i;

        var slides = document.getElementsByClassName("sample");
        var title = document.getElementById("title");
        var category = document.getElementById("category");
        var date = document.getElementById("date");

        if (n >= slides.length) {
            slideIndex = 0
        }

        if (n < 0) {slideIndex = slides.length-1}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        slides[slideIndex].style.display = "block";
        title.innerHTML = slides[slideIndex].firstChild.getAttribute("data-image-title");
        category.innerHTML = slides[slideIndex].firstChild.getAttribute("data-image-category");
        date.innerHTML = slides[slideIndex].firstChild.getAttribute("data-image-date");
    }
        // --------------------------------------------
}());
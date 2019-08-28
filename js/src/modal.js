// ----------- Modal Functions -----------
var modal = (function (){
  var slideIndex = 1;
  var imageModalContainer = document.getElementsByClassName('imageModalContainer');
  let prevModalButton = document.getElementsByClassName('prev');
  let nextModalButton = document.getElementsByClassName('next');
  
  return {
    generator: init,
    process: processImageClick,
    change: changeImage,
    close: closeModal
  };
  
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
    imageModalContainer[0].classList.add('hide');
  }
  
  function processImageClick(){
    processModal(this.firstChild);
  }
  
  function processModal(currentImage){
    let imageSrc = currentImage.getAttribute('src');
    
    imageModalContainer[0].classList.remove('hide');
    
    slideIndex = parseInt(currentImage.getAttribute('data-image-identifier'));
    
    var modalMainWrapper = document.getElementById('modal-main-wrapper');
    
    var check = currentImage.getAttribute('data-image-identifier');
    var title = document.getElementById('image-detail-container').getElementsByClassName('title')[0];
    var category = document.getElementById('image-detail-container').getElementsByClassName('category')[0];
    var date = document.getElementById('image-detail-container').getElementsByClassName('date')[0];
    
    // First clear all elements inside the wrapper
    if (modalMainWrapper.firstChild){
      while (modalMainWrapper.firstChild){
        modalMainWrapper.removeChild(modalMainWrapper.firstChild);
      }
    }
    
    var modalImageContainer = document.createElement('div');
    modalImageContainer.setAttribute('id','modal-image-container');
    modalImageContainer.setAttribute('class','sample');
    
    var imgTag = document.createElement('img');
    imgTag.setAttribute('id','modal-image');
    imgTag.setAttribute('src',imageSrc);
    
    modalImageContainer.style.display = 'block';
    
    modalImageContainer.appendChild(imgTag);
    modalMainWrapper.appendChild(modalImageContainer);
    
    var modal = document.getElementsByClassName('imageModal')[0];
    
    modal.style.display = 'block';
    title.innerHTML = currentImage.getAttribute('data-image-title');
    category.innerHTML = currentImage.getAttribute('data-image-category');
    date.innerHTML = new Date(parseInt(currentImage.getAttribute('data-image-date'))).toLocaleDateString();
  }
  
  function changeImage(n){
    setModalImage(slideIndex += n);
  }
  
  function setModalImage(n) {
    var slides = document.getElementsByClassName('image-thumbnail');
    prevModalButton[0].classList.remove('hide');
    nextModalButton[0].classList.remove('hide');
    
    if (n >= slides.length) {
      prevModalButton[0].classList.remove('hide');
      nextModalButton[0].classList.add('hide');
      return;
    }
    
    if (n < 0) {
      prevModalButton[0].classList.add('hide');
      nextModalButton[0].classList.remove('hide');
      return;
    }

    let modalImgTag = document.getElementById('modal-image');
    let modalImageDetailTitle = document.getElementById('image-detail-container').getElementsByClassName('title')[0];
    let modalImageDetailCategory = document.getElementById('image-detail-container').getElementsByClassName('category')[0];
    let modalImageDetailDate = document.getElementById('image-detail-container').getElementsByClassName('date')[0];
        
    let imageSrc = slides[n].getAttribute('src');
    let title = slides[n].getAttribute('data-image-title');
    let category = slides[n].getAttribute('data-image-category');
    let date = new Date(parseInt(slides[n].getAttribute('data-image-date'))).toLocaleDateString();
 
    modalImgTag.setAttribute('src', imageSrc);
    modalImageDetailTitle.innerHTML = title;
    modalImageDetailCategory.innerHTML = category;
    modalImageDetailDate.innerHTML = date;
  }
  // --------------------------------------------
}());
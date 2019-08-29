(function(){
  var imagesInput =  {};
  var galleryConfiguration = {};
  
  const DEFAULT_GRID_SIZE = 3;
  
  var currentGridSize = DEFAULT_GRID_SIZE;
  
  var imageModalContainer = document.getElementsByClassName('imageModalContainer');
  let prevModalButton = document.getElementsByClassName('prev');
  let nextModalButton = document.getElementsByClassName('next');
  
  var Gallery = function (configFile, imagesFile, element){
    this.userDefinedElement = document.getElementById(element);
    this.config = configFile;
    this.imagesJSON = imagesFile;
    this.imagesInput = [];
    this.galleryConfiguration = [];
    
    this.currentImageArray;
    this.noOfImages = 0;
    this.currentGridSize;
    
    this.allAvailableTitles = [];
    this.allAvailableCategories = ['All'];
    this.allAvailableDates = [];
    
    this.helper_generateCategories;
    this.helper_generateTitles;
    this.helper_generateDates;
    
    this.filteringByCategoryIsActive;
    this.filteringByCategoryValue;
    this.sortByTypeIsActive;
    this.sortByTypeIsValue;
    
    this.valuesForSort = ['Title','Category','Date'];
    this.valuesForGrid = ['3 X 3','4 X 4','5 X 5'];
    
    // var gallery = this;
    // gallery.loadConfiguration(configFile);
    // gallery.loadJSON(imagesFile);
    this.init(this.configFile, this.imagesJSON);
  }
  
  Gallery.prototype.generateFilterByCategory = function (){
    let gallery = this;
    let filterCategory = document.getElementById('filter-category');
    
    for (let elem = 0 ; elem < gallery.allAvailableCategories.length; elem++){
      let value = gallery.allAvailableCategories[elem];
      let option = document.createElement('option');
      option.innerHTML = value;
      
      filterCategory.appendChild(option);
    }
  }

  // This function generates the images in the Gallery:
  Gallery.prototype.generateGalleryGrid = function (gridSize){
    let gallery = this;
    
    let noOfImages = gallery.noOfImages;
    let objectCounter = 0;
    let imagesInput = gallery.imagesInput;
    
    gallery.currentImageArray = [];
    gallery.currentGridSize = gallery.whatIsTheGridSize(noOfImages);
    
    for (let elem = 0; elem < noOfImages; elem++){
      if(objectCounter < (noOfImages)){
        let currentObjectProp = imagesInput[elem];
        gallery.helper_createImgTag(gridSize, objectCounter ,currentObjectProp.location, imagesInput[objectCounter]);
        gallery.currentImageArray.push(imagesInput[elem]);
        objectCounter++;
      }
    }
  }

  //This function generates the Basic sketch for the Modal:
  Gallery.prototype.generateSketchForModal = function (){
    var gallery = this;
    let imageModalOverlay = document.getElementsByClassName('imageModalWrapperOverlay')[0];
    let imageModalWrapper = document.getElementsByClassName('imageModalWrapper')[0];
    
    let customImageModal = document.createElement('div');
    customImageModal.setAttribute('class','imageModal');
    
    let customCrossIcon = document.createElement('div');
    customCrossIcon.setAttribute('class','cross-icon');
    customCrossIcon.innerHTML = '&times;';
    customCrossIcon.addEventListener('click',gallery.closeModal);
    
    let customPrev = document.createElement('a');
    customPrev.setAttribute('class','prev');
    customPrev.innerHTML = '&#10094;';
    customPrev.addEventListener('click',function(){gallery.modal_changeImage(-1);});
    
    let customNext = document.createElement('a');
    customNext.setAttribute('class','next');
    customNext.innerHTML = '&#10095;';
    customNext.addEventListener('click',function(){gallery.modal_changeImage(1);});
    
    let customModalMainWrapper = document.createElement('div');
    customModalMainWrapper.setAttribute('id','modal-main-wrapper');
    
    let customModalImageContainer = document.createElement('div');
    customModalImageContainer.setAttribute('id','modal-image-container');
    customModalImageContainer.setAttribute('class','sample');
    
    let customImageDetailContainer = document.createElement('div');
    customImageDetailContainer.setAttribute('id','image-detail-container');
    
    let valuesForSort = gallery.valuesForSort;
    for (let temp = 0 ; temp < valuesForSort.length; temp++){
      let p = document.createElement('p');
      p.setAttribute('class',valuesForSort[temp].toLowerCase());
      p.innerHTML = valuesForSort[temp];
      customImageDetailContainer.appendChild(p);
    }
    
    customModalMainWrapper.appendChild(customModalImageContainer);
    
    imageModalOverlay.appendChild(customCrossIcon);
    imageModalOverlay.appendChild(customPrev);
    imageModalOverlay.appendChild(customNext);
    customImageModal.appendChild(customModalMainWrapper);
    
    imageModalWrapper.appendChild(customImageModal);
    imageModalWrapper.appendChild(customImageDetailContainer);
  }
  
  // This function generates the Basic sketch of the Gallery:
  Gallery.prototype.generateSketchForGalleryContainer = function (){
    let gallery = this;
    
    let galleryContainer = document.getElementById('gallery-container');
    
    let custonGalleryWrapper = document.createElement('div');
    custonGalleryWrapper.setAttribute('class','gallery-wrapper');
    
    let customInfoOverlay = document.createElement('div');
    customInfoOverlay.setAttribute('class','infoOverlay');
    
    let customGalleryFilterContainer = document.createElement('div');
    customGalleryFilterContainer.setAttribute('class','gallery-filter-container');
    
    let customFilters = document.createElement('div');
    customFilters.setAttribute('class','filters');
    
    let customSortCategory = document.createElement('div');
    customSortCategory.setAttribute('class','filters-cat'); //Change the ID to sort-cat later
    
    let customGridFilter = document.createElement('div');
    customGridFilter.setAttribute('class','filters-grid');
    
    let customSelectFilters = document.createElement('select');
    customSelectFilters.setAttribute('id','filters-select');
    
    let valuesForSort = gallery.valuesForSort;
    for (let temp = 0 ; temp < valuesForSort.length; temp++){
      let option = document.createElement('option');
      option.setAttribute('value',valuesForSort[temp].toLowerCase());
      option.innerHTML = valuesForSort[temp];
      customSelectFilters.appendChild(option);
    }
    
    let customSelectGrids = document.createElement('select');
    customSelectGrids.setAttribute('id','filters-grid');
    
    let valuesForGrid = gallery.valuesForGrid;
    for (let temp = 0 ; temp < valuesForGrid.length; temp++){
      let option = document.createElement('option');
      option.setAttribute('value',temp+3);
      option.innerHTML = valuesForGrid[temp];
      customSelectGrids.appendChild(option);
    }
    
    let customSelectCategory = document.createElement('select');
    customSelectCategory.setAttribute('id','filter-category');
    
    customFilters.appendChild(customSelectFilters);
    customGridFilter.appendChild(customSelectGrids);
    customSortCategory.appendChild(customSelectCategory);
    
    customGalleryFilterContainer.appendChild(customFilters);
    customGalleryFilterContainer.appendChild(customGridFilter);
    customGalleryFilterContainer.appendChild(customSortCategory);
    
    galleryContainer.appendChild(customGalleryFilterContainer);
    galleryContainer.appendChild(custonGalleryWrapper);
  }
  
  Gallery.prototype.generateTypeArrays = function (){
    var gallery = this;
    for (var key in gallery.imagesInput){
      var currTitle = gallery.imagesInput[key].hasOwnProperty('title');
      var tempPropertyTitle = gallery.imagesInput[key]['title'].trim();
      if (currTitle && (!gallery.allAvailableTitles.includes(tempPropertyTitle))){
        gallery.allAvailableTitles.push(tempPropertyTitle.trim());
      }
      
      var currCategory = gallery.imagesInput[key].hasOwnProperty('category');
      var tempPropertyCategory = gallery.imagesInput[key]['category'].trim();
      if (currCategory && (!gallery.allAvailableCategories.includes(tempPropertyCategory))){
        gallery.allAvailableCategories.push(tempPropertyCategory.trim());
      }
      
      var currDate = gallery.imagesInput[key].hasOwnProperty('date');
      var tempPropertyDate = gallery.imagesInput[key]['date'].trim();
      if (currDate && (!gallery.allAvailableDates.includes(tempPropertyDate))){
        gallery.allAvailableDates.push(tempPropertyDate.trim());
      }
    }
  }

  Gallery.prototype.whatIsTheGridSize = function (noOfImages){
    let maxImagesForGrid = DEFAULT_GRID_SIZE * DEFAULT_GRID_SIZE;
    
    if (noOfImages <= DEFAULT_GRID_SIZE){
      return DEFAULT_GRID_SIZE;
    }else{
      let newGridSize = DEFAULT_GRID_SIZE;
      while (noOfImages > maxImagesForGrid){
        newGridSize += 1;
        maxImagesForGrid = newGridSize * newGridSize;
      }
      return newGridSize;
    }
  }
  
  Gallery.prototype.buildGallery = function (){
    var gallery = this;
    
    gallery.noOfImages = Object.keys(gallery.imagesInput).length;
    gallery.currentGridSize = gallery.whatIsTheGridSize(gallery.noOfImages);
    gallery.generateTypeArrays();
    
    gallery.generateSketchForGalleryContainer();
    gallery.generateSketchForModal();
    gallery.generateGalleryGrid(gallery.currentGridSize);
    gallery.generateFilterByCategory();
    
    document.addEventListener('input',gallery.updateCategory);
    document.addEventListener('input',gallery.sortByType);
    document.addEventListener('input',gallery.updateGrid);
    
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

  Gallery.prototype.fetchLocalFile = function(filename, callback){
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET',filename,true);
    xmlRequest.onreadystatechange = function(){
      if ((xmlRequest.readyState == 4) && (xmlRequest.status == 200)){
        callback(this.responseText);
      }
    };
    xmlRequest.send();
  }

  Gallery.prototype.loadImageJSON = function (jsonFile){
    var gallery = this;
    gallery.fetchLocalFile(jsonFile, function(value){
      gallery.imagesInput = (JSON.parse(value)).images;
      gallery.buildGallery();
    });
  }
  
  Gallery.prototype.fetchLocalConfigFile = function (filename, callback){
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET',filename,true);
    xmlRequest.onreadystatechange = function(){
      if ((xmlRequest.readyState == 4) && (xmlRequest.status == 200)){
        callback(this, JSON.parse(this.responseText));
      }
    };
    xmlRequest.send();
  }
  
  Gallery.prototype.init = function (){
    var gallery = this;
    gallery.fetchLocalConfigFile(this.config, function(currentElement, value){
      gallery.galleryConfiguration = value;
      console.log(gallery.galleryConfiguration);
      gallery.loadImageJSON(gallery.imagesJSON);
    })
  }
  // --------------------X----------------------X----------------------------X-------------------------|
  
  
  
  
  
  
  // Filter & Sort functions:
  // Filtering:
  
  
  // Sorting:
  Gallery.prototype.processSortedArray = function (type){
    let gallery = this;
    
    let sortedArray;
    let noOfImages = gallery.noOfImages;
    let imagesInput = gallery.imagesInput;
    let objectCounter = 0;
    
    switch (type){
      case 'title':{
        sortedArray = allAvailableTitles.sort();
        break;
      }
      case 'category':{
        sortedArray = allAvailableCategories.sort();
        break;
      }
      case 'date':{
        sortedArray = allAvailableDates.sort();
        break;
      }
    }

    gallery.currentImageArray = [];
    gallery.sortByTypeIsActive = true;
    gallery.sortByTypeIsValue = type;
    
    gallery.removeAllImages();
    
    for (let elem2 in sortedArray){
      let currTypeValue = sortedArray[elem2];
      
      for (let elem = 0 ; elem < noOfImages; elem++){
        let tempObject = imagesInput[elem];
        
        if (gallery.filteringByCategoryIsActive){
          if (tempObject['category'].trim() == gallery.filteringByCategoryValue.trim()){
            if (tempObject[type].trim() == currTypeValue.trim()){
              gallery.regenerateImageTag(objectCounter, tempObject);
            }
          }
        }else if (tempObject[type].trim() == currTypeValue.trim()){
          gallery.regenerateImageTag(objectCounter, tempObject);
        }
      }
    }
  }
  
  Gallery.prototype.sortByType = function (event){
    if (event.target.id !== 'filters-select') return;
    
    var toSortByType = event.target.selectedOptions;
    this.processSortedArray(toSortByType[0].innerHTML.toLowerCase());
  }
  
  Gallery.prototype.regenerateImageTag = function (objectCounter, tempObject){
    helper.generateImageTag(gallery.currentGridSize, objectCounter ,tempObject.location, tempObject);
    gallery.currentImageArray.push(tempObject);
    objectCounter++;
  }
  
  Gallery.prototype.updateCategory = function (event){
    let objectCounter = 0;
    
    if (event.target.id !== 'filter-category') return;
    
    let categoriesArray = [];
    let selectedOption = event.target.selectedOptions[0];
    let selectedOptionText = selectedOption.text;
    let selectedOptionValue = selectedOption.innerHTML.trim();
    
    gallery.filteringByCategoryIsActive = selectedOptionText == 'All' ? false : true;
    gallery.filteringByCategoryValue = selectedOptionValue;
    
    gallery.removeAllImages();
    
    for (let elem = 0; elem<gallery.noOfImages ; elem++){
      let currImage = igallery.magesInput[elem];
      let currCategory = currImage['category'];
      currCategory = currCategory.trim();
      
      categoriesArray.push();
      let eventSelectedOptions = event.target.selectedOptions[0].innerHTML.trim();
      
      if ((currCategory == (eventSelectedOptions)) || (eventSelectedOptions == 'All')){
        gallery.regenerateImageTag(objectCounter, currImage);
      }
    }
    
    if (sortByTypeIsActive){
      var selectFilter = document.getElementById('filters-select');
      var selectFilterValue = selectFilter.options[selectFilter.selectedIndex].value;
      
      processSortedArray(selectFilterValue);
    }
  }
  
  Gallery.prototype.updateGrid = function (event){
    if (event.target.id !== 'filters-grid') return;
    
    var gallery = this;
    let selectedGridValue = event.target.selectedOptions[0].value;
    gallery.removeAllImages();
    gallery.generateGalleryGrid(selectedGridValue);
  }
  
  Gallery.prototype.removeAllImages = function (){
    let galleryWrapper = document.getElementsByClassName('gallery-wrapper')[0];
    while (galleryWrapper.firstChild){
      galleryWrapper.removeChild(galleryWrapper.firstChild);
    }
  }
  
  // ----------------------------------
  // HELPER CODE
  // -----------------------------------
  
  
  
  Gallery.prototype.helper_createImgTag = function (gridSize, objectCounter, src, data){
    let gallery = this;
    
    let galleryWrapper = document.getElementsByClassName('gallery-wrapper')[0];
    
    let customGalleryImage = document.createElement('div');
    customGalleryImage.setAttribute('id','image-'+objectCounter);
    customGalleryImage.setAttribute('class','gallery-image');
    
    let customImgTag = document.createElement('img');
    customImgTag.setAttribute('src',src);
    customImgTag.setAttribute('class','image-thumbnail');
    customImgTag.setAttribute('data-image-title',data.title);
    customImgTag.setAttribute('data-image-category',data.category);
    customImgTag.setAttribute('data-image-identifier',objectCounter);
    customImgTag.setAttribute('data-image-date',data.date);
    
    let imgTagWidth = 100 / gridSize;
    customGalleryImage.style.width = imgTagWidth + '%';
    
    customGalleryImage.addEventListener('click',gallery.modal_processImageClick);
    
    let customInfoOverlay = document.createElement('div');
    customInfoOverlay.setAttribute('class','infoOverlay');
    
    let infoOverlayValues = [data.title,data.category,new Date(parseInt(data.date)).toLocaleDateString()];
    let valuesInImageOverlay = ['Title','Category','Date'];
    for (let temp = 0; temp < 3; temp++){
      let p = document.createElement('p');
      p.setAttribute('class','overlay'+valuesInImageOverlay[temp]);
      p.innerHTML = infoOverlayValues[temp];
      customInfoOverlay.appendChild(p);
    }
    
    customGalleryImage.appendChild(customImgTag);
    customGalleryImage.appendChild(customInfoOverlay);
    galleryWrapper.appendChild(customGalleryImage);
  }
  
  
  
  
  // --------X--------------X------------
  
  // ----------------------------------
  // Modal CODE
  // -----------------------------------
  
  Gallery.prototype.closeModal = function (){
    imageModalContainer[0].classList.add('hide');
  }
  
  Gallery.prototype.modal_processImageClick = function (){
    let currentImage = this.firstChild;
    console.log(currentImage);
    
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
  
  Gallery.prototype.modal_changeImage = function (n){
    this.setModalImage(slideIndex += n);
  }
  
  Gallery.prototype.setModalImage = function (n) {
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
  
  var app1 = new Gallery('configuration.json', 'images.json', 'gallery-container');
  // app1.init();
})()
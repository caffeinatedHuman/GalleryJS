(function(){

  const DEFAULT_GRID_SIZE = 3;

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

    this.filteringByCategoryIsActive;
    this.filteringByCategoryValue;
    this.sortByTypeIsActive = true;
    this.sortByTypeIsValue = 'title';

    this.valuesForSort = ['Title','Category','Date'];
    this.valuesForGrid = ['3 X 3','4 X 4','5 X 5'];

    this.init(this.configFile, this.imagesJSON);
  };

  Gallery.prototype.generateFilterByCategory = function (){
    let gallery = this;
    let filterCategory = document.getElementById('filter-category');

    for (let elem = 0 ; elem < gallery.allAvailableCategories.length; elem++){
      let value = gallery.allAvailableCategories[elem];
      let option = document.createElement('option');
      option.innerHTML = value;

      filterCategory.appendChild(option);
    }
  };

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
    customCrossIcon.addEventListener('click', function (){
      imageModalContainer[0].classList.add('hide');
    });

    let customPrev = document.createElement('a');
    customPrev.setAttribute('class','prev');
    customPrev.innerHTML = '&#10094;';
    customPrev.addEventListener('click',function(){gallery.navigateImageInModal(-1);});

    let customNext = document.createElement('a');
    customNext.setAttribute('class','next');
    customNext.innerHTML = '&#10095;';
    customNext.addEventListener('click',function(){gallery.navigateImageInModal(1);});

    let customModalMainWrapper = document.createElement('div');
    customModalMainWrapper.setAttribute('id','modal-main-wrapper');

    let customModalImageContainer = document.createElement('div');
    customModalImageContainer.setAttribute('id','modal-image-container');
    customModalImageContainer.setAttribute('class','sample');

    let customImageDetailContainer = document.createElement('div');
    customImageDetailContainer.setAttribute('id','image-detail-container');

    gallery.valuesForSort.forEach(function (value){
      let p = document.createElement('p');
      p.setAttribute('class',value.toLowerCase());
      p.innerHTML = value.toLowerCase();
      customImageDetailContainer.appendChild(p);
    });

    let customModalImage = document.createElement('img');
    customModalImage.setAttribute('id', 'modal-image');
    customModalImage.setAttribute('src','');
    customModalImageContainer.appendChild(customModalImage);
    customModalMainWrapper.appendChild(customModalImageContainer);

    imageModalOverlay.appendChild(customCrossIcon);
    imageModalOverlay.appendChild(customPrev);
    imageModalOverlay.appendChild(customNext);
    customImageModal.appendChild(customModalMainWrapper);

    imageModalWrapper.appendChild(customImageModal);
    imageModalWrapper.appendChild(customImageDetailContainer);
  };

  // This function generates the Basic sketch of the Gallery:
  Gallery.prototype.generateSketchForGalleryContainer = function (){
    let gallery = this;

    let galleryContainer = document.getElementById('gallery-container');

    let customGalleryWrapper = document.createElement('div');
    customGalleryWrapper.setAttribute('class','gallery-wrapper');

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

    gallery.valuesForSort.forEach(function(value) {
        let option = document.createElement('option');
        option.setAttribute('value',value.toLowerCase());
        option.innerHTML = value;
        customSelectFilters.appendChild(option);
    });

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
    galleryContainer.appendChild(customGalleryWrapper);

    let galleryWrapper = document.getElementsByClassName('gallery-wrapper');
    galleryWrapper[0].addEventListener('click', function(event){
      gallery.processImageClick(event);
    });
  };

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
  };

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
  };

  Gallery.prototype.buildGallery = function (){
    var gallery = this;

    gallery.noOfImages = Object.keys(gallery.imagesInput).length;
    gallery.currentGridSize = gallery.whatIsTheGridSize(gallery.noOfImages);
    gallery.generateTypeArrays();

    gallery.generateSketchForGalleryContainer();
    gallery.generateSketchForModal();
    gallery.processSortedArray(gallery.sortByTypeIsValue);
    gallery.generateFilterByCategory();

    document.addEventListener('input',function(event){
      let objectCounter = 0;

      if (event.target.id !== 'filter-category') return;

      let categoriesArray = [];
      let selectedOption = event.target.selectedOptions[0];
      let selectedOptionValue = selectedOption.innerHTML.trim();

      gallery.filteringByCategoryIsActive = selectedOptionValue == 'All' ? false : true;
      gallery.filteringByCategoryValue = selectedOptionValue;

      gallery.removeAllImages();

      for (let elem = 0; elem<gallery.noOfImages ; elem++){
        let currImage = gallery.imagesInput[elem];
        let currCategory = currImage['category'];
        currCategory = currCategory.trim();

        categoriesArray.push();
        let eventSelectedOptions = event.target.selectedOptions[0].innerHTML.trim();

        if ((currCategory == (eventSelectedOptions)) || (eventSelectedOptions == 'All')){
          gallery.regenerateImageTag(objectCounter, currImage);
        }
      }

      if (gallery.sortByTypeIsActive){
        let selectFilter = document.getElementById('filters-select');
        let selectFilterValue = selectFilter.options[selectFilter.selectedIndex].value;

        gallery.processSortedArray(selectFilterValue);
      }
    });

    document.addEventListener('input',function(){
      if (event.target.id !== 'filters-select') return;

      var toSortByType = event.target.selectedOptions;
      gallery.processSortedArray(toSortByType[0].innerHTML.toLowerCase());
    });

    document.addEventListener('input',function (){
      if (event.target.id !== 'filters-grid') return;

      let selectedGridValue = event.target.selectedOptions[0].value;
      gallery.removeAllImages();
      gallery.currentGridSize = selectedGridValue;
      gallery.processSortedArray(gallery.sortByTypeIsValue);
    });

    document.onkeydown = function (e) {
      e = e || window.event;
      if (e.keyCode == 37) {
        document.querySelector('.prev').click();
      }
      else if (e.keyCode == 39) {
        document.querySelector('.next').click();
      }
    };
  };

  Gallery.prototype.fetchLocalFile = function(filename, callback){
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET',filename,true);
    xmlRequest.onreadystatechange = function(){
      if ((xmlRequest.readyState == 4) && (xmlRequest.status == 200)){
        callback(this.responseText);
      }
    };
    xmlRequest.send();
  };

  Gallery.prototype.loadImageJSON = function (jsonFile){
    var gallery = this;
    gallery.fetchLocalFile(jsonFile, function(value){
      gallery.imagesInput = (JSON.parse(value)).images;
      gallery.buildGallery();
    });
  };

  Gallery.prototype.fetchLocalConfigFile = function (filename, callback){
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET',filename,true);
    xmlRequest.onreadystatechange = function(){
      if ((xmlRequest.readyState == 4) && (xmlRequest.status == 200)){
        callback(this, JSON.parse(this.responseText));
      }
    };
    xmlRequest.send();
  };

  Gallery.prototype.init = function (){
    var gallery = this;
    gallery.fetchLocalConfigFile(this.config, function(currentElement, value){
      gallery.galleryConfiguration = value;
      console.log(gallery.galleryConfiguration);
      gallery.loadImageJSON(gallery.imagesJSON);
    });
  };

  Gallery.prototype.processSortedArray = function (type){
    let gallery = this;

    let sortedArray;
    let noOfImages = gallery.noOfImages;
    let imagesInput = gallery.imagesInput;
    let objectCounter = 0;

    switch (type){
      case 'title':{
        sortedArray = gallery.allAvailableTitles.sort();
        break;
      }
      case 'category':{
        sortedArray = gallery.allAvailableCategories.sort();
        break;
      }
      case 'date':{
        sortedArray = gallery.allAvailableDates.sort();
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
      objectCounter++;
    }
  };

  Gallery.prototype.regenerateImageTag = function (objectCounter, tempObject){
    var gallery = this;
    gallery.createImageTag(gallery.currentGridSize, objectCounter ,tempObject.location, tempObject);
    gallery.currentImageArray.push(tempObject);
  };

  Gallery.prototype.removeAllImages = function (){
    let galleryWrapper = document.getElementsByClassName('gallery-wrapper')[0];
    while (galleryWrapper.firstChild){
      galleryWrapper.removeChild(galleryWrapper.firstChild);
    }
  };

  Gallery.prototype.createImageTag = function (gridSize, objectCounter, src, data){
    let gallery = this;

    let galleryWrapper = document.getElementsByClassName('gallery-wrapper')[0];

    let customGalleryImage = document.createElement('div');
    customGalleryImage.setAttribute('id','image-'+objectCounter);
    customGalleryImage.setAttribute('class','gallery-image');

    let customImgTag = `<img src='${src}' class='image-thumbnail' data-image-title='${data.title}' data-image-category='${data.category}' data-image-identifier='${objectCounter}' data-image-date='${data.date}'>`;

    let imgTagWidth = 100 / gridSize;
    customGalleryImage.style.width = imgTagWidth + '%';

    let customInfoOverlay = document.createElement('div');
    customInfoOverlay.setAttribute('class','infoOverlay');

    let infoOverlayValues = [data.title,data.category,new Date(parseInt(data.date)).toLocaleDateString()];
    let valuesInImageOverlay = ['Title','Category','Date'];

    let allPTags = '';
    for (let temp = 0; temp < 3; temp++){
      let tempPTag = `<p class='${'overlay'+valuesInImageOverlay[temp]}'>${infoOverlayValues[temp]}</p>`
      allPTags += tempPTag;
    }
    customInfoOverlay.innerHTML = allPTags;
    customGalleryImage.innerHTML = customImgTag;
    customGalleryImage.appendChild(customInfoOverlay);
    galleryWrapper.appendChild(customGalleryImage);
  };

  Gallery.prototype.processImageClick = function (event){
    let closestElement = event.target.closest('div');
    let imageContainer = closestElement.parentNode;

    if (imageContainer.getAttribute('class') != 'gallery-image')
      return;

    let currentImage = imageContainer.firstChild;

    let imageSrc = currentImage.getAttribute('src');

    imageModalContainer[0].classList.remove('hide');

    slideIndex = parseInt(currentImage.getAttribute('data-image-identifier'));

    let title = document.getElementById('image-detail-container').getElementsByClassName('title')[0];
    let category = document.getElementById('image-detail-container').getElementsByClassName('category')[0];
    let date = document.getElementById('image-detail-container').getElementsByClassName('date')[0];

    let imgTag = document.getElementById('modal-image');
    imgTag.setAttribute('src',imageSrc);

    let modal = document.getElementsByClassName('imageModal')[0];

    modal.style.display = 'block';
    title.innerHTML = currentImage.getAttribute('data-image-title');
    category.innerHTML = currentImage.getAttribute('data-image-category');
    date.innerHTML = new Date(parseInt(currentImage.getAttribute('data-image-date'))).toLocaleDateString();
  };

  Gallery.prototype.navigateImageInModal = function (n){
    this.setModalImage(slideIndex += n);
  };

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
  };

  var app1 = new Gallery('configuration.json', 'images.json', 'gallery-container');
  // app1.init();
})();
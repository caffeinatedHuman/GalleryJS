var imagesInput =  {};
var galleryConfiguration = {};

var gallery = (function (){
  const DEFAULT_GRID_SIZE = 3;
  
  var noOfImages;
  var currentGridSize = DEFAULT_GRID_SIZE;
  
  // var allAvailableTitles = helper.generateTitles('title');
  // var allAvailableCategories = helper.generateCategories('category');
  // var allAvailableDates = helper.generateDates('date');
  var allAvailableTitles = helper.generateTitles;
  var allAvailableCategories = helper.generateCategories;
  var allAvailableDates = helper.generateDates;
  
  var filteringByCategoryIsActive = false; //To store whether the filter by category section was toggled.
  var filteringByCategoryValue = null;
  var sortByTypeIsActive = true; //To store whether the Sort by any type (i.e. Title, Category, Date) section was toggled.
  var sortByTypeIsValue = null;
  
  var currentImageArray = []; //This variable will store the images currently present on the UI, and will be visible in the Lightbox
  
  var valuesForSort = ['Title','Category','Date'];
  
  return {
    defaultGridSize: DEFAULT_GRID_SIZE,
    currentGridSize: currentGridSize,
    noOfImages: noOfImages,
    currentImageArray: currentImageArray,
    availableCategories: allAvailableCategories,
    availableTitles: allAvailableTitles,
    generator: init,
    updateCategory: updateCategory,
    // sortImage: sortImages
    sortImage: sortByType
  };
  
  function init(){
    noOfImages = Object.keys(imagesInput).length;
    helper.populateAllTypes();
    gallery.currentGridSize = helper.whatIsTheGridSize(noOfImages);
    gallery.availableCategories;
    generateSketchForGalleryContainer();
    generateSketchForModal();
    generateGalleryGrid(gallery.currentGridSize);
    generateFilterByCategory();
    
    document.addEventListener('input',updateCategory);
    // document.addEventListener('input',sortImages);
    document.addEventListener('input',sortByType);
    document.addEventListener('input',updateGrid);
    
    modal.generator();
  }
  
  // This function generates the Basic sketch of the Gallery:
  function generateSketchForGalleryContainer(){
    var galleryContainer = document.getElementById('gallery-container');
    
    var custonGalleryWrapper = document.createElement('div');
    custonGalleryWrapper.setAttribute('class','gallery-wrapper');
    
    var customInfoOverlay = document.createElement('div');
    customInfoOverlay.setAttribute('class','infoOverlay');
    
    var customGalleryFilterContainer = document.createElement('div');
    customGalleryFilterContainer.setAttribute('class','gallery-filter-container');
    
    var customFilters = document.createElement('div');
    customFilters.setAttribute('class','filters');
    
    var customSortCategory = document.createElement('div');
    customSortCategory.setAttribute('class','filters-cat'); //Change the ID to sort-cat later
    
    var customGridFilter = document.createElement('div');
    customGridFilter.setAttribute('class','filters-grid');
    
    var customSelectFilters = document.createElement('select');
    customSelectFilters.setAttribute('id','filters-select');
    
    for (let temp = 0 ; temp < valuesForSort.length; temp++){
      var option = document.createElement('option');
      option.setAttribute('value',valuesForSort[temp].toLowerCase());
      option.innerHTML = valuesForSort[temp];
      customSelectFilters.appendChild(option);
    }
    
    var customSelectGrids = document.createElement('select');
    customSelectGrids.setAttribute('id','filters-grid');
    
    var valuesForGrid = ['3 X 3','4 X 4','5 X 5'];
    for (var temp = 0 ; temp < valuesForGrid.length; temp++){
      let option = document.createElement('option');
      option.setAttribute('value',temp+3);
      option.innerHTML = valuesForGrid[temp];
      customSelectGrids.appendChild(option);
    }
    
    var customSelectCategory = document.createElement('select');
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
  
  //This function generates the Basic sketch for the Modal:
  function generateSketchForModal(){
    var imageModalOverlay = document.getElementsByClassName('imageModalWrapperOverlay')[0];
    var imageModalWrapper = document.getElementsByClassName('imageModalWrapper')[0];
    var imageDetail;
    
    var customImageModal = document.createElement('div');
    customImageModal.setAttribute('class','imageModal');
    // customImageModal.setAttribute('class','modal');
    
    var customCrossIcon = document.createElement('div');
    customCrossIcon.setAttribute('class','cross-icon');
    customCrossIcon.innerHTML = '&times;';
    customCrossIcon.addEventListener('click',modal.close);
    
    var customPrev = document.createElement('a');
    customPrev.setAttribute('class','prev');
    customPrev.innerHTML = '&#10094;';
    customPrev.addEventListener('click',function(){modal.change(-1);});
    
    var customNext = document.createElement('a');
    customNext.setAttribute('class','next');
    customNext.innerHTML = '&#10095;';
    customNext.addEventListener('click',function(){modal.change(1);});
    
    var customModalMainWrapper = document.createElement('div');
    customModalMainWrapper.setAttribute('id','modal-main-wrapper');
    
    var customModalImageContainer = document.createElement('div');
    customModalImageContainer.setAttribute('id','modal-image-container');
    customModalImageContainer.setAttribute('class','sample');
    
    var customImageDetailContainer = document.createElement('div');
    customImageDetailContainer.setAttribute('id','image-detail-container');
    
    for (var temp = 0 ; temp < valuesForSort.length; temp++){
      imageDetail = document.createElement('div');
      imageDetail.setAttribute('class','image-detail');
      var p = document.createElement('p');
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
  
  // This function generates the images in the Gallery:
  function generateGalleryGrid(gridSize){
    var objectCounter = 0;
    
    gallery.currentImageArray = [];
    gallery.currentGridSize = helper.whatIsTheGridSize(gallery.noOfImages);
    for (var elem = 0; elem < noOfImages; elem++){
      if(objectCounter < (noOfImages)){
        var currentObjectProp = imagesInput[elem];
        helper.generateImageTag(gridSize, objectCounter ,currentObjectProp.location, imagesInput[objectCounter]);
        gallery.currentImageArray.push(imagesInput[elem]);
        objectCounter++;
      }
    }
  }
  
  // Filter & Sort functions:
  // Filtering:
  function generateFilterByCategory(){
    var filterCategory = document.getElementById('filter-category');
    
    for (var elem = 0 ; elem < gallery.availableCategories.length; elem++){
      var value = gallery.availableCategories[elem];
      var option = document.createElement('option');
      option.innerHTML = value;
      
      filterCategory.appendChild(option);
    }
  }
  
  // Sorting:

  function processSortedArray(type){
    let sortedArray;
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
    let objectCounter = 0;
    gallery.currentImageArray = [];
    
    sortByTypeIsActive = true;
    sortByTypeIsValue = type;
    
    removeAllImages();
    
    for (var elem2 in sortedArray){
      var currTypeValue = sortedArray[elem2];
      
      for (var elem = 0 ; elem < noOfImages; elem++){
        var tempObject = imagesInput[elem];
        
        if (filteringByCategoryIsActive){
          if (tempObject['category'].trim() == filteringByCategoryValue.trim()){
            if (tempObject[type].trim() == currTypeValue.trim()){
              regenerateImageTag(objectCounter, tempObject);
            }
          }
        }else if (tempObject[type].trim() == currTypeValue.trim()){
          regenerateImageTag(objectCounter, tempObject);
        }
      }
    }
  }
  
  function sortByType(event){
    if (event.target.id !== 'filters-select') return;
    
    var toSortByType = event.target.selectedOptions;
    processSortedArray(toSortByType[0].innerHTML.toLowerCase());
  }
  
  // function sort_by_helper_function(objectCounter, tempObject){
  function regenerateImageTag(objectCounter, tempObject){
    // Rename the function to something appropriate
    helper.generateImageTag(gallery.currentGridSize, objectCounter ,tempObject.location, tempObject);
    gallery.currentImageArray.push(tempObject);
    objectCounter++;
  }
  
  function updateCategory(event){
    var objectCounter = 0;
    
    if (event.target.id !== 'filter-category') return;
    
    var categoriesArray = [];
    var selectedOption = event.target.selectedOptions[0];
    var selectedOptionText = selectedOption.text;
    var selectedOptionValue = selectedOption.innerHTML.trim();
    
    filteringByCategoryIsActive = selectedOptionText == 'All' ? false : true;
    filteringByCategoryValue = selectedOptionValue;
    
    removeAllImages();
    
    for (var elem = 0; elem<noOfImages ; elem++){
      var currImage = imagesInput[elem];
      var currCategory = currImage['category'];
      currCategory = currCategory.trim();
      
      categoriesArray.push();
      var eventSelectedOptions = event.target.selectedOptions[0].innerHTML.trim();
      
      if ((currCategory == (eventSelectedOptions)) || (eventSelectedOptions == 'All')){
        regenerateImageTag(objectCounter, currImage);
      }
    }
    
    if (sortByTypeIsActive){
      var selectFilter = document.getElementById('filters-select');
      var selectFilterValue = selectFilter.options[selectFilter.selectedIndex].value;
      
      // updateCategory_helper(selectFilterValue);
      processSortedArray(selectFilterValue);
    }
  }
  
  
  
  function updateGrid(event){
    if (event.target.id !== 'filters-grid') return;
    
    var selectedGridValue = event.target.selectedOptions[0].value;
    removeAllImages();
    generateGalleryGrid(selectedGridValue);
  }
  
  function removeAllImages(){
    var galleryWrapper = document.getElementsByClassName('gallery-wrapper')[0];
    while (galleryWrapper.firstChild){
      galleryWrapper.removeChild(galleryWrapper.firstChild);
    }
  }
}());

function fetchLocalFile(filename, callback){
  let xmlRequest = new XMLHttpRequest();
  xmlRequest.open('GET',filename,true);
  xmlRequest.onreadystatechange = function(){
    if ((xmlRequest.readyState == 4) && (xmlRequest.status == 200)){
      callback(this.responseText);
    }
  };
  xmlRequest.send();
}

function fetchLocalConfigFile(filename, callback){
  let xmlRequest = new XMLHttpRequest();
  xmlRequest.open('GET',filename,true);
  xmlRequest.onreadystatechange = function(){
    if ((xmlRequest.readyState == 4) && (xmlRequest.status == 200)){
      callback(JSON.parse(this.responseText));
    }
  };
  xmlRequest.send();
}

function loadJSON(jsonFile){
  fetchLocalFile(jsonFile, function(value){
    imagesInput = (JSON.parse(value)).images;
    // console.log(value);
    gallery.generator();
  });
}

function loadConfiguration(configJSONFile){
  fetchLocalConfigFile(configJSONFile, function(value){
    // console.log(JSON.parse(value));
    galleryConfiguration = value;
  })
}


loadConfiguration('configuration.json');
loadJSON('images.json');
var imagesInput =  {
  "0":{
    "title":"Title 9",
    "category":"Category 0",
    "date":"1565541066292",
    "location": "images/1.jpg"
  },
  "1":{
    "title":"Title 8",
    "category":"Category 1",
    "date":"1564911066292",
    "location": "images/6.jpg"
  },
  "2":{
    "title":"Title 7",
    "category":"Category 2",
    "date":"1568911266292",
    "location": "images/8.jpg"
  },
  "3":{
    "title":"Title 6",
    "category":" Category 0",
    "date":"1564741066292",
    "location": "images/2.jpg"
  },
  "4":{
    "title":"Title 5",
    "category":" Category 3",
    "date":"1564941066192",
    "location": "images/5.jpg"
  },
  "5":{
    "title":"Title 4",
    "category":" Category 2",
    "date":"1564842866292",
    "location": "images/3.jpg"
  },
  "6":{
    "title":"Title 3",
    "category":" Category 1",
    "date":"1574942866292",
    "location": "images/7.jpg"
  },
  "7":{
    "title":"Title 2",
    "category":" Category 3",
    "date":"1364941066292",
    "location": "images/9.jpg"
  },
  "8":{
    "title":"Title 1",
    "category":" Category 1",
    "date":"1364941066290",
    "location": "images/6.jpg"
  }
};

var gallery = (function (){
  const DEFAULT_GRID_SIZE = 3;

  var noOfImages = Object.keys(imagesInput).length;
  var currentGridSize = DEFAULT_GRID_SIZE;

  var allAvailableTitles = helper.generateTitles("title");
  var allAvailableCategories = helper.generateCategories("category");
  var allAvailableDates = helper.generateDates("date");

  var filteringByCategoryIsActive = false; //To store whether the filter by category section was toggled.
  var filteringByCategoryValue = null;
  var sortByTypeIsActive = true; //To store whether the Sort by any type (i.e. Title, Category, Date) section was toggled.
  var sortByTypeIsValue = null;

  var currentImageArray = []; //This variable will store the images currently present on the UI, and will be visible in the Lightbox

  var valuesForSort = ["Title","Category","Date"];

  return {
    defaultGridSize: DEFAULT_GRID_SIZE,
    currentGridSize: currentGridSize,
    noOfImages: noOfImages,
    currentImageArray: currentImageArray,
    availableCategories: allAvailableCategories,
    availableTitles: allAvailableTitles,
    generator: init,
    updateCategory: updateCategory,
    sortImage: sortImages
  }

  function init(){
    gallery.currentGridSize = helper.whatIsTheGridSize(noOfImages);

    generateSketchForGalleryContainer();
    generateSketchForModal();
    generateGalleryGrid(gallery.currentGridSize);
    generateFilterByCategory();

    document.addEventListener('input',updateCategory);
    document.addEventListener('input',sortImages);
    document.addEventListener('input',updateGrid);

    modal.generator();
  }

  // This function generates the Basic sketch of the Gallery:
  function generateSketchForGalleryContainer(){
    var galleryContainer = document.getElementById("gallery-container");

    var custonGalleryWrapper = document.createElement("div");
    custonGalleryWrapper.setAttribute("id","gallery-wrapper");

    var customInfoOverlay = document.createElement("div");
    customInfoOverlay.setAttribute("class","infoOverlay");

    var customGalleryFilterContainer = document.createElement("div");
    customGalleryFilterContainer.setAttribute("class","gallery-filter-container");

    var customFilters = document.createElement("div");
    customFilters.setAttribute("class","filters");

    var customSortCategory = document.createElement("div");
    customSortCategory.setAttribute("class","filters-cat"); //Change the ID to sort-cat later

    var customGridFilter = document.createElement("div");
    customGridFilter.setAttribute("class","filters-grid");

    var customSelectFilters = document.createElement("select");
    customSelectFilters.setAttribute("id","filters-select");

    for (var temp = 0 ; temp < valuesForSort.length; temp++){
      var option = document.createElement("option");
      option.setAttribute("value",valuesForSort[temp].toLowerCase());
      option.innerHTML = valuesForSort[temp];
      customSelectFilters.appendChild(option);
    }

    var customSelectGrids = document.createElement("select");
    customSelectGrids.setAttribute("id","filters-grid");

    var valuesForGrid = ["3 X 3","4 X 4","5 X 5"];
    for (var temp = 0 ; temp < valuesForGrid.length; temp++){
      var option = document.createElement("option");
      option.setAttribute("value",temp+3);
      option.innerHTML = valuesForGrid[temp];
      customSelectGrids.appendChild(option);
    }

    var customSelectCategory = document.createElement("select");
    customSelectCategory.setAttribute("id","filter-category");

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
    var imageModalOverlay = document.getElementById("imageModalWrapperOverlay");
    var imageModalWrapper = document.getElementById("imageModalWrapper");
    var imageDetail;

    var customImageModal = document.createElement("div");
    customImageModal.setAttribute("id","imageModal");
    customImageModal.setAttribute("class","modal");

    var customCrossIcon = document.createElement("div");
    customCrossIcon.setAttribute("id","cross-icon");
    customCrossIcon.innerHTML = "&times;";
    customCrossIcon.addEventListener('click',modal.close);

    var customPrev = document.createElement("a");
    customPrev.setAttribute("class","prev");
    customPrev.innerHTML = "&#10094;";
    customPrev.addEventListener('click',function(){modal.change(-1);});

    var customNext = document.createElement("a");
    customNext.setAttribute("class","next");
    customNext.innerHTML = "&#10095;";
    customNext.addEventListener('click',function(){modal.change(1);});

    var customModalMainWrapper = document.createElement("div");
    customModalMainWrapper.setAttribute("id","modal-main-wrapper");

    var customModalImageContainer = document.createElement("div");
    customModalImageContainer.setAttribute("id","modal-image-container");
    customModalImageContainer.setAttribute("class","sample");

    var customImageDetailContainer = document.createElement("div");
    customImageDetailContainer.setAttribute("id","image-detail-container");

    for (var temp = 0 ; temp < valuesForSort.length; temp++){
      imageDetail = document.createElement("div");
      imageDetail.setAttribute("class","image-detail");
      var p = document.createElement("p");
      p.setAttribute("id",valuesForSort[temp].toLowerCase());
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
    var filterCategory = document.getElementById("filter-category");

    for (var elem = 0 ; elem < gallery.availableCategories.length; elem++){
      var value = gallery.availableCategories[elem];
      var option = document.createElement("option");
      option.innerHTML = value

      filterCategory.appendChild(option);
    }
  }

  // Sorting:
  function sortImages(event){
    if (event.target.id !== 'filters-select') return;

    var toSortBy = event.target.selectedOptions;

    switch (toSortBy[0].innerHTML) {
      case 'Title':{
        var sortedTitles = allAvailableTitles.sort();
        sortBy("title",sortedTitles);
        break;
      }
      case 'Date':{
        var sortedDates = allAvailableDates.sort();
        sortBy("date",sortedDates);
        break;
      }
      case 'Category':{
        var sortedCategories = allAvailableCategories.sort();
        sortBy("category",sortedCategories);
        break;
      }
      default:{
        removeAllImages();
        generateGalleryGrid(noOfImages);
      }
    }
  }

  function sortBy(type, sortedArray){
    var objectCounter = 0;
    gallery.currentImageArray = [];

    sortByTypeIsActive = true;
    sortByTypeIsValue = type;

    removeAllImages();

    for (var elem2 in sortedArray){
      var currTypeValue = sortedArray[elem2];

      for (var elem = 0 ; elem < noOfImages; elem++){
        tempObject = imagesInput[elem];

        if (filteringByCategoryIsActive){
          if (tempObject["category"].trim() == filteringByCategoryValue.trim()){
            if (tempObject[type].trim() == currTypeValue.trim()){
              sort_by_helper_function(objectCounter, tempObject);
            }
          }
        }else if (tempObject[type].trim() == currTypeValue.trim()){
          sort_by_helper_function(objectCounter, tempObject);
        }
      }
    }
  }

  function sort_by_helper_function(objectCounter, tempObject){
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
      var currCategory = currImage["category"];
      currCategory = currCategory.trim();

      if (currCategory==(event.target.selectedOptions[0].innerHTML).trim()){
        categoriesArray.push();
        helper.generateImageTag(gallery.currentGridSize, objectCounter, currImage.location, currImage);
        currentImageArray.push(currImage);
        objectCounter++;
      }else if (event.target.selectedOptions[0].innerHTML == "All"){
        categoriesArray.push();
        helper.generateImageTag(gallery.currentImageArray, objectCounter, currImage.location, currImage);
        currentImageArray.push(currImage);
        objectCounter++;
      }
    }

    if (sortByTypeIsActive){
      var selectFilter = document.getElementById("filters-select");
      var selectFilterValue = selectFilter.options[selectFilter.selectedIndex].value;

      switch (selectFilterValue){
        case 'title':{
          sortedArray = allAvailableTitles.sort();
          sortBy('title',sortedArray);
          break
        }
        case 'category':{
          sortedArray = allAvailableCategories.sort();
          sortBy('category',sortedArray);
          break;
        }
        case 'date':{
          sortedArray = allAvailableDates.sort();
          sortBy('date',sortedArray);
          break;
        }
      }
    }
  }

  function updateGrid(event){
    if (event.target.id !== 'filters-grid') return;

    var selectedGridValue = event.target.selectedOptions[0].value;
    removeAllImages();
    generateGalleryGrid(selectedGridValue);
  }

  function removeAllImages(){
    var galleryWrapper = document.getElementById("gallery-wrapper");
    while (galleryWrapper.firstChild){
      galleryWrapper.removeChild(galleryWrapper.firstChild);
    }
  }
}());

gallery.generator();
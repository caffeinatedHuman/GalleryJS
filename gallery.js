var imagesInput =  {
    "0":{
        "title":"Title 9",
        "category":"Category 0",
        "date":"Date 1",
        "location": "images/1.jpg"
        // "location": "images/6.jpg"
    },
    "1":{
        "title":"Title 8",
        "category":"Category 1",
        "date":"Date 2",
        "location": "images/6.jpg"
    },
    "2":{
        "title":"Title 7",
        "category":"Category 2",
        "date":"Date 3",
        "location": "images/8.jpg"
        // "location": "images/6.jpg"
    },
    "3":{
        "title":"Title 6",
        "category":" Category3",
        "date":"Date 4",
        // "location": "images/4.jpg"
        "location": "images/6.jpg"
    },
    "4":{
        "title":"Title 5",
        "category":" Category 4",
        "date":"Date 5",
        "location": "images/5.jpg"
        // "location": "images/6.jpg"
    },
    "5":{
        "title":"Title 4",
        "category":" Category 5",
        "date":"Date 6",
        "location": "images/2.jpg"
        // "location": "images/6.jpg"
    },
    "6":{
        "title":"Title 3",
        "category":" Category 6",
        "date":"Date 8",
        "location": "images/7.jpg"
        // "location": "images/6.jpg"
    },
    "7":{
        "title":"Title 2",
        "category":" Category 7",
        "date":"Date 5",
        "location": "images/8.jpg"
        // "location": "images/6.jpg"
    },
    "8":{
        "title":"Title 1",
        "category":" Category 7",
        "date":"Date 5",
        // "location": "images/9.jpg"
        "location": "images/6.jpg"
    }
};

const minImages = 0;
const maxImages = 36;
const defaultGridSize = 3;

var noOfImages = Object.keys(imagesInput).length;


var currentGridSize = defaultGridSize;
var maxImagesForGrid = defaultGridSize*defaultGridSize;

var allAvailableTitles = _populateArray("title");
var allAvailableCategories = _populateArray("category");
var currentImageArray = []; //This variable will store the images currently present on the UI, and will be visible in the Lightbox

var filteringByCategoryIsActive = false; //To store whether the filter by category section was toggled.
var filteringByCategoryValue = undefined;
var sortByTypeIsActive = false; //To store whether the Sort by any type (i.e. Title, Category, Date) section was toggled.
var sortByTypeIsValue = undefined;

var galleryWrapper = document.getElementById("gallery-wrapper");
var galleryContainer = document.getElementById('gallery-container');
var imageHolder = document.createElement("div");

function init(){
    currentGridSize = _whatIsTheGridSize(noOfImages);
    generateSketchForGalleryContainer();
    generateSketchForModal();
    generateGalleryGrid(defaultGridSize);
}

// This function generates the Basic sketc of the Gallery:
function generateSketchForGalleryContainer(){
    var galleryContainer = document.getElementById("gallery-container");

    //Make sure you adopt class names for the given IDs
    var galleryWrapper = document.createElement("div");
    galleryWrapper.setAttribute("id","gallery-wrapper");

    var infoOverlay = document.createElement("div");
    infoOverlay.setAttribute("class","infoOverlay");

    var galleryFilterContainer = document.createElement("div");
    galleryFilterContainer.setAttribute("id","gallery-filter-container");

    var filters = document.createElement("div");
    filters.setAttribute("id","filters");

    var sortCategory = document.createElement("div");
    sortCategory.setAttribute("id","filters-cat"); //Change the ID to sort-cat later

    var selectFilters = document.createElement("select");
    selectFilters.setAttribute("id","filters-select");

    var valuesForSort = ["none","Title","Category","Date"];
    for (var temp = 0 ; temp < valuesForSort.length; temp++){
        var option = document.createElement("option");
        option.setAttribute("value",valuesForSort[temp].toLowerCase());
        option.innerHTML = valuesForSort[temp];
        selectFilters.appendChild(option);
    }

    var selectCategory = document.createElement("select");
    selectCategory.setAttribute("id","filter-category");

    filters.appendChild(selectFilters);
    sortCategory.appendChild(selectCategory);

    galleryFilterContainer.appendChild(filters);
    galleryFilterContainer.appendChild(sortCategory);

    galleryContainer.appendChild(galleryFilterContainer);
    galleryContainer.appendChild(galleryWrapper);
}

function generateSketchForModal(){
    var imageModalWrapper = document.getElementById("imageModalWrapper");
    var imageDetail;

    //Make sure you adopt class names for the given IDs
    var imageModal = document.createElement("div");
    imageModal.setAttribute("id","imageModal");
    imageModal.setAttribute("class","modal");

    var crossIcon = document.createElement("div");
    crossIcon.setAttribute("id","cross-icon");

    var prev = document.createElement("a");
    prev.setAttribute("class","prev");

    var next = document.createElement("a");
    next.setAttribute("class","next");

    var modalMainWrapper = document.createElement("div");
    modalMainWrapper.setAttribute("id","modal-main-wrapper");

    var modalImageContainer = document.createElement("div");
    modalImageContainer.setAttribute("id","modal-image-container");
    modalImageContainer.setAttribute("class","sample");

    var imageDetailContainer = document.createElement("div");
    imageDetailContainer.setAttribute("id","image-detail-container");

    // imageDetail = document.createElement("div");
    // imageDetail.setAttribute("class","image-detail");

    modalMainWrapper.appendChild(modalImageContainer);

    imageModal.appendChild(crossIcon);
    imageModal.appendChild(prev);
    imageModal.appendChild(next);
    imageModal.appendChild(modalMainWrapper);
    imageModal.appendChild(imageDetailContainer);

    imageModalWrapper.appendChild(imageModal);
}

// This function generates the images in the DOM:
function generateGalleryGrid(imageCount){
    var objectCounter = 0;

    currentGridSize = _whatIsTheGridSize(imageCount);
    currentImageArray = [];

    for (var elem = 0; elem < noOfImages; elem++){
        if(objectCounter < (noOfImages)){
            var currentObjectProp = imagesInput[elem];
            _createImgTag(objectCounter ,currentObjectProp.location, imagesInput[objectCounter].title, imagesInput[objectCounter].category);
            currentImageArray.push(imagesInput[elem]);
            objectCounter++;
        }
    }

}


// ----X----X----


// Filter & Sort functions
// Filtering:
function filterByCategory(){
    var filterCategory = document.getElementById("filter-category");

    for (var elem = 0 ; elem < allAvailableCategories.length; elem++){
        var value = allAvailableCategories[elem];
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
            sortedTitles = allAvailableTitles.sort();
            sortBy("title",sortedTitles);
            break;
        }
        case 'Date':{
            break;
        }
        case 'Category':{
            sortedCategories = allAvailableCategories.sort();
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
    currentImageArray = [];

    sortByTypeIsActive = true;
    sortByTypeIsValue = type;

    removeAllImages();

    for (var elem2 in sortedArray){
        var currTypeValue = sortedArray[elem2];

        for (var elem = 0 ;elem < noOfImages;elem++){
            tempObject = imagesInput[elem];

            if (filteringByCategoryIsActive){
                if (tempObject["category"].trim()==filteringByCategoryValue.trim()){
                    if (tempObject[type].trim() == currTypeValue.trim()){
                        _createImgTag(objectCounter, tempObject.location, imagesInput[elem].title, imagesInput[elem].category);
                        currentImageArray.push(imagesInput[elem]);
                        objectCounter++;
                    }
                }
            }else{
                if (tempObject[type].trim() == currTypeValue.trim()){
                    _createImgTag(objectCounter, tempObject.location, imagesInput[elem].title, imagesInput[elem].category);
                    currentImageArray.push(imagesInput[elem]);
                    objectCounter++;
                }
            }
        }
    }
}

function updateCategory(event){
    var objectCounter = 0;

    if (event.target.id !== 'filter-category') return;

    if (event.target.selectedOptions[0].text == 'none'){
        filteringByCategoryIsActive = false;
    }
    else{
        filteringByCategoryIsActive = true;
    }

    filteringByCategoryValue = event.target.selectedOptions[0].innerHTML.trim();

    var allImagesInTable = document.getElementsByClassName("image-thumbnail");

    var len = allImagesInTable.length;

    var categoriesArray = [];

    removeAllImages();

    for (elem = 0; elem<noOfImages ; elem++){
        var currImage = imagesInput[elem];
        var currCategory = currImage["category"];
        currCategory = currCategory.trim();

        if (currCategory==(event.target.selectedOptions[0].innerHTML).trim()){
            categoriesArray.push()
            _createImgTag(objectCounter, currImage.location, currImage["title"], currImage["category"]);
            currentImageArray.push(imagesInput[elem]);
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
                break;
            }
        }
    }

    console.log(allImagesInTable);
}
// ----X----X----



imageHolder.setAttribute("id","image-holder");




function removeAllImages(){
    var galleryWrapper = document.getElementById("gallery-wrapper");
    while (galleryWrapper.firstChild){
        galleryWrapper.removeChild(galleryWrapper.firstChild);
    }
}

function reset(){
    init();
}

init();
filterByCategory();
document.addEventListener('input',updateCategory);
document.addEventListener('input',sortImages);
// document.getElementById("clear").addEventListener('click',reset);
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
    generateGalleryGrid(defaultGridSize);
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
                        var imgTag = _createImgTag(objectCounter, tempObject.location, imagesInput[elem].title, imagesInput[elem].category);
                        currentImageArray.push(imagesInput[elem]);
                        objectCounter++;
                    }
                }
            }else{
                if (tempObject[type].trim() == currTypeValue.trim()){ 
                    var imgTag = _createImgTag(objectCounter, tempObject.location, imagesInput[elem].title, imagesInput[elem].category);
                    currentImageArray.push(imagesInput[elem]);
                    objectCounter++;
                }
            }
        }
    }    
}

function updateCategory(event){
    
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
    
    for (elem = 0; elem<len ; elem++){
        var currImage = allImagesInTable[elem];
        var currCategory = currImage.getAttribute("data-image-category");
        currCategory = currCategory.trim(); 
        
        if (currCategory!=(event.target.selectedOptions[0].innerHTML).trim()){
            allImagesInTable[elem].style.display="none";
        }
        else{
            categoriesArray.push()
            allImagesInTable[elem].style.display="block";
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
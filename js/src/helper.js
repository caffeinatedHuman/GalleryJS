// ----------- Helper Functions -----------
var helper = (function(){
  
  const DEFAULT_GRID_SIZE = 3;
  var generateCategories = ['All'];
  var generateTitles = [];
  var generateDates = [];
  
  return{
    generateCategories: generateCategories,
    generateTitles: generateTitles,
    generateDates: generateDates,
    whatIsTheGridSize: _whatIsTheGridSize,
    generateImageTag: _createImgTag,
    // generateGrid: regenerateGrid
    populateAllTypes: _populateArrays
  };
  
  // This function will return the size of the Grid based on the no onf images supplied
  function _whatIsTheGridSize(noOfImages){
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
  
  function _createImgTag(gridSize, objectCounter, src, data){
    var galleryWrapper = document.getElementsByClassName('gallery-wrapper')[0];
    
    var customGalleryImage = document.createElement('div');
    customGalleryImage.setAttribute('id','image-'+objectCounter);
    customGalleryImage.setAttribute('class','gallery-image');
    
    var customImgTag = document.createElement('img');
    customImgTag.setAttribute('src',src);
    customImgTag.setAttribute('class','image-thumbnail');
    customImgTag.setAttribute('data-image-title',data.title);
    customImgTag.setAttribute('data-image-category',data.category);
    customImgTag.setAttribute('data-image-identifier',objectCounter);
    customImgTag.setAttribute('data-image-date',data.date);
    
    var imgTagWidth = 100 / gridSize;
    customGalleryImage.style.width = imgTagWidth + '%';
    
    customGalleryImage.addEventListener('click',modal.process);
    
    var customInfoOverlay = document.createElement('div');
    customInfoOverlay.setAttribute('class','infoOverlay');
    
    var infoOverlayValues = [data.title,data.category,new Date(parseInt(data.date)).toLocaleDateString()];
    var valuesInImageOverlay = ['Title','Category','Date'];
    for (var temp = 0; temp < 3; temp++){
      var p = document.createElement('p');
      p.setAttribute('class','overlay'+valuesInImageOverlay[temp]);
      p.innerHTML = infoOverlayValues[temp];
      customInfoOverlay.appendChild(p);
    }
    
    customGalleryImage.appendChild(customImgTag);
    customGalleryImage.appendChild(customInfoOverlay);
    galleryWrapper.appendChild(customGalleryImage);
  }
  
  function _populateArrays(){    
    for (var key in imagesInput){
      var currTitle = imagesInput[key].hasOwnProperty('title');
      var tempPropertyTitle = imagesInput[key]['title'].trim();
      if (currTitle && (!generateTitles.includes(tempPropertyTitle))){
        generateTitles.push(tempPropertyTitle.trim());
      }
      
      var currCategory = imagesInput[key].hasOwnProperty('category');
      var tempPropertyCategory = imagesInput[key]['category'].trim();
      if (currCategory && (!generateCategories.includes(tempPropertyCategory))){
        generateCategories.push(tempPropertyCategory.trim());
      }
      
      var currDate = imagesInput[key].hasOwnProperty('date');
      var tempPropertyDate = imagesInput[key]['date'].trim();
      if (currDate && (!generateDates.includes(tempPropertyDate))){
        generateDates.push(tempPropertyDate.trim());
      }
    }
  }
}());

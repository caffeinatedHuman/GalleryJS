// ----------- Helper Functions -----------
var helper = (function(){

  const DEFAULT_GRID_SIZE = 3;

  return{
    generateCategories: _populateArray,
    generateTitles: _populateArray,
    generateDates: _populateArray,
    whatIsTheGridSize: _whatIsTheGridSize,
    generateImageTag: _createImgTag,
    // generateGrid: regenerateGrid
  }

  // This function will return the size of the Grid based on the no onf images supplied
  function _whatIsTheGridSize(noOfImages){
    maxImagesForGrid = DEFAULT_GRID_SIZE * DEFAULT_GRID_SIZE;

    if (noOfImages <= DEFAULT_GRID_SIZE){
      return DEFAULT_GRID_SIZE;
    }else{
      newGridSize = DEFAULT_GRID_SIZE;
      while (noOfImages > maxImagesForGrid){
        newGridSize += 1;
        maxImagesForGrid = newGridSize * newGridSize;
      }
      return newGridSize;
    }
  }

  function _createImgTag(gridSize, objectCounter, src, data){
    var galleryWrapper = document.getElementById("gallery-wrapper");

    var customGalleryImage = document.createElement("div");
    customGalleryImage.setAttribute("id","image-"+objectCounter);
    customGalleryImage.setAttribute("class","gallery-image");

    var customImgTag = document.createElement("img");
    customImgTag.setAttribute("src",src);
    customImgTag.setAttribute("class","image-thumbnail");
    customImgTag.setAttribute("data-image-title",data.title);
    customImgTag.setAttribute("data-image-category",data.category);
    customImgTag.setAttribute("data-image-identifier",objectCounter);
    customImgTag.setAttribute("data-image-date",data.date);

    var imgTagWidth = 100 / gridSize;
    customGalleryImage.style.width = imgTagWidth + '%';

    customGalleryImage.addEventListener("click",modal.process);

    var customInfoOverlay = document.createElement("div");
    customInfoOverlay.setAttribute("class","infoOverlay");

    var infoOverlayValues = [data.title,data.category,new Date(parseInt(data.date)).toLocaleDateString()];
    var valuesInImageOverlay = ["Title","Category","Date"];
    for (var temp = 0; temp < 3; temp++){
      var p = document.createElement("p");
      p.setAttribute("id","overlay"+valuesInImageOverlay[temp]);
      p.innerHTML = infoOverlayValues[temp];
      customInfoOverlay.appendChild(p);
    }

    customGalleryImage.appendChild(customImgTag);
    customGalleryImage.appendChild(customInfoOverlay);
    galleryWrapper.appendChild(customGalleryImage);
  }

  function _populateArray(type){
    var temp = [];
    switch (type){
      case "title":{
        temp = _populateArrayHelper('title');
        break;
      }

      case "category":{
        temp = _populateArrayHelper('category');
        break;
      }

      case "date":{
        // BROKEN!!!!!!!!!!!!!!!!!!!!!!
        // for (key in imagesInput){
        //   var currDate = imagesInput[key].hasOwnProperty('date');

        //   var tempDate = imagesInput[key].date.trim();
        //   if (currDate && (!temp.includes(tempCategory))){
        //       temp.push(tempDate.trim());
        //   }
        // }
        // _populateArrayHelper('date');
        break;
      }
    }

    return temp;
  }

  function _populateArrayHelper(property){
    var temp2 = [];
    if (property == 'category')
    temp2.push('All');

    for (key in imagesInput){
      var currDate = imagesInput[key].hasOwnProperty(property);

      var tempProperty = imagesInput[key][property].trim();
      if (currDate && (!temp2.includes(tempProperty))){
        temp2.push(tempProperty.trim());
      }
    }
    return temp2;
  }
  function _populateArrayHelper2(){
    var titleArray = [];
    var categoriesArray = [];
    var dateArray = [];
    
    for (key in imagesInput){
      var currTitle = imagesInput[key].hasOwnProperty('title');
      var tempPropertyTitle = imagesInput[key]['title'].trim();
      if (currTitle && (!titleArray.includes('title'))){
        titleArray.push(tempPropertyTitle.trim());
      }
      
      var currCategory = imagesInput[key].hasOwnProperty('category');
      var tempPropertyCategory = imagesInput[key]['category'].trim();
      if (currCategory && (!categoriesArray.includes('category'))){
        categoriesArray.push(tempPropertyCategory.trim());
      }
      
      var currDate = imagesInput[key].hasOwnProperty('date');
      var tempPropertyDate = imagesInput[key]['date'].trim();
      if (currDate && (!dateArray.includes('date'))){
        dateArray.push(tempPropertyDate.trim());
      }
    }
    console.log(titleArray);
    console.log(categoriesArray);
    console.log(dateArray);
    
  }
}());

// ----------- Helper Functions -----------
var helper = (function(){

  const DEFAULT_GRID_SIZE = 3;

  return{
    generateCategories: _populateArray,
    generateTitles: _populateArray,
    generateDates: _populateArray,
    whatIsTheGridSize: _whatIsTheGridSize,
    generateImageTag: _createImgTag
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

  function _createImgTag(objectCounter, src, dataTitle, dataCategory, dataDate){
    var galleryWrapper = document.getElementById("gallery-wrapper");

    var customGalleryImage = document.createElement("div");
    customGalleryImage.setAttribute("id","image-"+objectCounter);
    customGalleryImage.setAttribute("class","gallery-image");

    var customImgTag = document.createElement("img");
    customImgTag.setAttribute("src",src);
    customImgTag.setAttribute("class","image-thumbnail");
    customImgTag.setAttribute("data-image-title",dataTitle);
    customImgTag.setAttribute("data-image-category",dataCategory);
    customImgTag.setAttribute("data-image-identifier",objectCounter);

    var imgTagWidth = 100 / _whatIsTheGridSize(gallery.currentGridSize);
    customGalleryImage.style.width = imgTagWidth + '%';

    customImgTag.addEventListener("click",modal.process);

    var customInfoOverlay = document.createElement("div");
    customInfoOverlay.setAttribute("class","infoOverlay");

    var infoOverlayValues = [dataTitle,dataCategory,new Date(parseInt(dataDate)).toLocaleDateString()];
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

    // return imgTag;
  }

  function _populateArray(type){
    var temp = [];
    switch (type){
      case "title":{
        for (key in imagesInput){
          var currTitle = imagesInput[key].hasOwnProperty("title");

          if (currTitle){
            var tempTitle = imagesInput[key].title.trim();

            if (!temp.includes(tempTitle)){
              temp.push(tempTitle.trim());
            }
          }
        }
        break;
      }
      case "category":{
        temp.push("All");
        for (key in imagesInput){
          var currCategory = imagesInput[key].hasOwnProperty("category");

          if (currCategory){
            var tempCategory = imagesInput[key].category.trim();

            if (!temp.includes(tempCategory)){
              temp.push(tempCategory.trim());
            }
          }
        }
        break;
      }
      case "date":{
        for (key in imagesInput){
          var currDate = imagesInput[key].hasOwnProperty('date');

          if (currDate){
            var tempDate = imagesInput[key].date.trim();

            if (!temp.includes(tempCategory)){
              temp.push(tempDate.trim());
            }
          }
        }
      }
    }
    return temp;
  }

}());
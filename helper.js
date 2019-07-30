// ----------- Helper Functions -----------
// This function will return the size of the Grid based on the no onf images supplied
function _whatIsTheGridSize(noOfImages){
  maxImagesForGrid = defaultGridSize * defaultGridSize;
  
  if (noOfImages <= defaultGridSize){
    return defaultGridSize;
  }else{
    newGridSize = defaultGridSize;
    while (noOfImages > maxImagesForGrid){
      newGridSize += 1;
      maxImagesForGrid = newGridSize * newGridSize;
    }
    return newGridSize;
  }
}



function _createImgTag(objectCounter, src, dataTitle, dataCategory){
  var galleryWrapper = document.getElementById("gallery-wrapper");
  
  var galleryImage = document.createElement("div");
  galleryImage.setAttribute("id","image-"+objectCounter);
  galleryImage.setAttribute("class","gallery-image");
  
  var imgTag = document.createElement("img");
  imgTag.setAttribute("src",src);
  imgTag.setAttribute("class","image-thumbnail");
  imgTag.setAttribute("data-image-title",dataTitle);
  imgTag.setAttribute("data-image-category",dataCategory);
  imgTag.setAttribute("data-image-identifier",objectCounter);

  var imgTagWidth = 100 / _whatIsTheGridSize(currentGridSize);
  galleryImage.style.width = imgTagWidth + '%';
  
  imgTag.addEventListener("click",processImageClick);
  
  var infoOverlay = document.createElement("div");
  infoOverlay.setAttribute("class","infoOverlay");
  
  var infoOverlayValues = [dataTitle,dataCategory,"Date"];
  for (var temp = 0; temp < 3; temp++){
    var p = document.createElement("p");
    p.innerHTML = infoOverlayValues[temp];
    infoOverlay.appendChild(p);
  }

  galleryImage.appendChild(imgTag);
  galleryImage.appendChild(infoOverlay);
  galleryWrapper.appendChild(galleryImage);
  
  return imgTag;
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
  }
  return temp;
}

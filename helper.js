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
  var newImageDiv = document.createElement("div");
  newImageDiv.setAttribute("id","image-"+objectCounter);
  newImageDiv.setAttribute("class","gallery-image");
  
  var imgTag = document.createElement("img");
  imgTag.setAttribute("src",src);
  imgTag.setAttribute("class","image-thumbnail");
  imgTag.setAttribute("data-image-title",dataTitle);
  imgTag.setAttribute("data-image-category",dataCategory);
  imgTag.setAttribute("data-image-identifier",objectCounter);

  newImageDiv.style.width = `calc(100%/ ${_whatIsTheGridSize(currentGridSize)})`;
  
  imgTag.addEventListener("click",processImageClick);
  
  newImageDiv.appendChild(imgTag);
  galleryWrapper.appendChild(newImageDiv);
  
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

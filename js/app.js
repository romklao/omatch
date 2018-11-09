(function() {
  'use strict';

  let numCols = 10;
  let numRolls = 6;
  let imageWidth = 70;
  let imageHeight = 75;

  let imagesData = createImagesGrid(numRolls, numCols);
  console.log(imagesData);

  let imagesContainer = document.querySelector('.images-container');
  imagesContainer.style.width = (imageWidth * numCols) + 10 + 'px';
  imagesContainer.style.height = (imageHeight * numRolls) + 10 + 'px';

  let imagesWrap = document.querySelector('.images-wrap');
  imagesWrap.style.width = (imageWidth * numCols) + 'px';
  imagesWrap.style.height = (imageHeight * numRolls) + 'px';


  drawImages();

  function createImagesGrid(numRolls, numCols) {

    let images = [];
    for (let i = 1; i < 31; i++) {
      let randomNum = Math.floor(Math.random() * Math.floor(15));
      images.push(randomNum);
      images.push(randomNum);
    }
    let index = 0;
    let imagesGrid = [];
    for (let row = 0; row < numRolls; row++) {
      let rowsArr = [];
      for (let col = 0; col < numCols; col++) {
        rowsArr.push(images[index]);
        index++;
      }
      imagesGrid.push(rowsArr);
    }
    return imagesGrid;
  }

  function drawImages() {
    for (let i = 0; i < numRolls; i++) {
      for (let j = 0; j < numCols; j++) {
        let n = imagesData[i][j];

        let image = document.createElement('li');
        image.id = `image-${n}`;
        image.className = 'image';
        image.dataset.row = i;
        image.dataset.col = j;
        image.style.top = i * imageHeight + 'px';
        image.style.left = j * imageWidth + 'px';
        image.style.width = imageWidth + 'px';
        image.style.height = imageHeight + 'px';
        image.innerHTML = n;

        imagesWrap.append(image);
      }
    }
  }





})();
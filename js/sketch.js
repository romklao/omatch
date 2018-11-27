(function() {
  'use strict';

  let numCols = 6;
  let numRolls = 4;
  let imageWidth = 70;
  let imageHeight = 75;

  let imagesData = createImagesGrid(numRolls, numCols);
  //console.log('imagesData', imagesData);

  fetchPokemon();

  //createCanvasAsBackground();

  function createImagesGrid(numRolls, numCols) {

    let randomNumArr = [];
    for (let i = 0; i < ((numCols - 2) * (numRolls - 2))/2; i++) {
      let randomNum = Math.floor(Math.random() * Math.floor(50)) + 1;
      randomNumArr.push(randomNum);
      randomNumArr.push(randomNum);
    }
    shuffleArray(randomNumArr)
    console.log('num', randomNumArr);

    let index = 0;
    let imagesGrid = [];
    for (let row = 0; row < numRolls; row++) {
      let rowsArr = [];
      for (let col = 0; col < numCols; col++) {
        if (row === 0 || row === numRolls - 1) {
          rowsArr.push(null);
        }
        else if (col === 0 || col === numCols - 1) {
          rowsArr.push(null);
        }
        else {
          rowsArr.push(randomNumArr[index]);
          index++;
        }
      }
      imagesGrid.push(rowsArr);
    }
    return imagesGrid;
  }

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffleArray(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function fetchPokemon() {
    for (let i = 0; i < numRolls - 1; i++) {
      for (let j = 0; j < numCols - 1; j++) {
        let n = imagesData[i][j];
        if (n !== null) {
          // TODO: do not fetch duplicated images make sure images are not fetch twice
          fetch(`https://pokeapi.co/api/v2/pokemon-form/${n}/`)
            .then(response => response.json())
            .then(data => {
              let urlImage = data.sprites.front_default;
              drawImage(urlImage, n, i, j);
            })
            .catch(err => {
              console.error(err);
            })
        }
      }
    }
  }

  function drawImage(url, numImage, rol, col) {
    let imageList = document.createElement('li');
    imageList.className = 'image-list';
    imageList.style.top = rol * imageHeight + 'px';
    imageList.style.left = col * imageWidth + 'px';
    imageList.style.width = imageWidth + 'px';
    imageList.style.height = imageHeight + 'px';

    let image = document.createElement('img');
    image.src = url;
    image.id = `image-${rol}-${col}`;
    image.className = 'image';
    image.dataset.row = rol;
    image.dataset.col = col;
    image.dataset.imageId = numImage;
    image.style.width = 70 + 'px';
    image.style.height = 75 + 'px';

    imageList.append(image);
    imagesWrap.append(imageList);
  }

})();
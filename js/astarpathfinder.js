(function() {
  'use strict';

  let numCols = 8;
  let numRolls = 6;
  let imageWidth = 70;
  let imageHeight = 75;

  let imagesData = createImagesGrid(numRolls, numCols);
  console.log('imagesData', imagesData);

  fetchPokemon();

  let imagesWrap = document.querySelector('.images-wrap');
  imagesWrap.style.width = (imageWidth * numCols) + 'px';
  imagesWrap.style.height = (imageHeight * numRolls) + 'px';

  imagesWrap.addEventListener('click', onClickImage);

  let lastClickedImage = null;

  function onClickImage(event) {
    event.preventDefault();
    let image = event.target;

    if (lastClickedImage !== null && lastClickedImage !== image) {
      if (lastClickedImage.dataset.imageId === image.dataset.imageId) {
        // TODO: AStar search
        let start = getRowCol(lastClickedImage);
        let end = getRowCol(image);
        let path = aStarpathFinder(start, end);

        if (path) {
          clearImage(image, imagesData);
          clearImage(lastClickedImage, imagesData);
          drawPathAsBackground(path);
        }
        console.log('Found path', path);
        if (!findPathOfAllMatchingImages()) {
          console.log('hi');
          let imagesNumArr = [];
          for (let i = 1; i < numRolls - 1; i++) {
            for (let j = 1; j < numCols - 1; j++) {
              let imageNum = imagesData[i][j];
              imagesNumArr.push(imageNum);
            }
          }
          setTimeout(function() {
            shuffleArray(imagesNumArr);
            imagesData = createGrid(numRolls, numCols, imagesNumArr);
            fetchPokemon();
          }, 500);
        }
      }
      lastClickedImage = null;
    } else {
      lastClickedImage = image;
      //console.log(lastClickedImage.src);
    }
    console.log(lastClickedImage);
  }

  function createGrid(numRolls, numCols, randomArray) {
    let arrayGrid = [];
    let index = 0;
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
          rowsArr.push(randomArray[index]);
          index++;
        }
      }
      arrayGrid.push(rowsArr);
    }
    return arrayGrid;
  }

  function createImagesGrid(numRolls, numCols) {

    let randomNumArr = [];
    for (let i = 0; i < ((numCols - 2) * (numRolls - 2))/2; i++) {
      let randomNum = Math.floor(Math.random() * Math.floor(50)) + 1;
      randomNumArr.push(randomNum);
      randomNumArr.push(randomNum);
    }
    shuffleArray(randomNumArr)
    console.log('num', randomNumArr);

    let imagesGrid = createGrid(numRolls, numCols, randomNumArr);
    return imagesGrid;
  }

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  function fetchPokemon() {
    let imagesWrap = document.querySelector('.images-wrap');
    imagesWrap.innerHTML = '';
    for (let i = 0; i < numRolls; i++) {
      for (let j = 0; j < numCols; j++) {
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

  function clearImage(image, imagesData) {
    let row = parseInt(image.dataset.row);
    let col = parseInt(image.dataset.col);
    imagesData[row][col] = null;

    let imageId = document.querySelector(`#${image.id}`);
    let parentEle = imageId.closest('li');
    parentEle.innerHTML = '';
    parentEle.style.border = 'none';
  }

  function drawPathAsBackground(aStarPath) {
    let canvas = document.createElement('canvas');
    let width = imageWidth * numCols;
    let height = imageHeight * numRolls;
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");

    let row = aStarPath[0][0];
    let col = aStarPath[0][1];
    let x = (imageWidth * col);
    let y = (imageHeight * row);
    let offsetX = imageWidth/2;
    let offsetY = imageHeight/2;
    ctx.beginPath();
    ctx.moveTo(x + offsetX, y + offsetY);

    for (let i = 1; i < aStarPath.length; i++) {
      row = aStarPath[i][0];
      col = aStarPath[i][1];
      x = imageWidth * col;
      y = imageHeight * row;

      ctx.lineTo(x + offsetX, y + offsetY);
    }

    ctx.stroke();

    let imagesContainer = document.querySelector('.images-container');
    imagesContainer.style.backgroundImage = 'url(' + canvas.toDataURL('image/png')+ ')';
    imagesContainer.style.backgroundRepeat = 'no-repeat';

    setTimeout(function() {
      imagesContainer.style.backgroundImage = null;
    }, 200);
  }

  function reconstructPath(cameFrom, current) {
    let totalPath = [current];
    while (cameFrom.has(current.toString())) {
      current = cameFrom.get(current.toString());
      totalPath.push(current);
    }
    return totalPath;
  }

  function aStarpathFinder(start, end) {
    const vertMove = 1;
    const horizMove = 2;

    let closedSet = new Set();

    let openSet = new Map();
    openSet.set(start.toString(), start);

    let cameFrom = new Map();

    let gScore = new Map();
    gScore.set(start.toString(), 0);

    let fScore = new Map();
    fScore.set(start.toString(), distance(start, end));

    let bendCount = new Map();
    bendCount.set(start.toString(), 0);

    let cameFromDir = new Map();
    cameFromDir.set(start.toString(), null);

    while (openSet.size > 0) {
      let winner = null;
      for (let item of openSet.values()) {
        if (winner === null) {
          winner = item;
        }
        else if (getFromMapOrInf(fScore, item) < getFromMapOrInf(fScore, winner)) {
          winner = item;
        }
      }
      let current = winner;
      if (current.toString() === end.toString()) {
        console.log('Great');
        return reconstructPath(cameFrom, current);
      }
      openSet.delete(current.toString());
      closedSet.add(current.toString());

      let neighbors = getNeighbors(current);
      for (let neighbor of neighbors) {
        let row = neighbor[0];
        let col = neighbor[1];

        if (imagesData[row][col] !== null && neighbor.toString() !== end.toString()) {
          continue;
        }

        if (closedSet.has(neighbor.toString())) {
          continue;
        }

        let neighborDir = null;

        if (neighbor[0] === current[0]) {
          neighborDir = horizMove;
        } else {
          neighborDir = vertMove;
        }

        let numBends = bendCount.get(current.toString());
        let currentDir = cameFromDir.get(current.toString());

        if (currentDir !== null && currentDir !== neighborDir) {
          numBends++;
        }

        if (numBends > 2) {
          continue;
        }

        let tempG = getFromMapOrInf(gScore, current) + 1;

        if (!openSet.has(neighbor.toString())) {
          openSet.set(neighbor.toString(), neighbor);
        }
         else if (tempG >= getFromMapOrInf(gScore, neighbor)) {
          continue;
        }
        cameFromDir.set(neighbor.toString(), neighborDir);
        bendCount.set(neighbor.toString(), numBends);
        cameFrom.set(neighbor.toString(), current);
        gScore.set(neighbor.toString(), tempG);
        fScore.set(neighbor.toString(), getFromMapOrInf(gScore, neighbor) + distance(neighbor, end));
      }
      //console.log('cameFrom', cameFrom)
    }
    console.log('No solution');
  }

  function findPathOfAllMatchingImages() {
    let imagesNumMap = new Map();
    for (let r = 0; r < numRolls; r++) {
      for (let c = 0; c < numCols; c++) {
        let imageNum = imagesData[r][c];
        if (imageNum !== null) {
          if (imagesNumMap.has(imageNum)) {
            imagesNumMap.get(imageNum).push([r, c]);
          } else {
            imagesNumMap.set(imageNum, [[r, c]])
          }
        }
      }
    }
    for (let value of imagesNumMap.values()) {
      for (let i = 0; i < value.length - 1; i++) {
        for (let j = i + 1; j < value.length; j++) {
          let allPath = aStarpathFinder(value[i], value[j]);
          if(allPath) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function distance(a, b) {
    let rowA = a[0];
    let colA = a[1];
    let rowB = b[0];
    let colB = b[1];
    let dist = Math.abs(rowA - rowB) + Math.abs(colA - colB);
    return dist;
  }

  function getRowCol(image) {
    let row = parseInt(image.dataset.row);
    let col = parseInt(image.dataset.col);
    return [row, col];
  }

  function getFromMapOrInf(map, key) {
    if (map.has(key.toString())) {
      return map.get(key.toString());
    } else {
      return Infinity;
    }
  }

  function getNeighbors(node) {
    let row = node[0];
    let col = node[1];
    let neighbors = [];

    if (col > 0) {
      neighbors.push([row, col - 1]);
    }
    if (col < numCols - 1) {
      neighbors.push([row, col + 1]);
    }
    if (row > 0) {
      neighbors.push([row - 1, col]);
    }
    if (row < numRolls - 1) {
      neighbors.push([row + 1, col]);
    }

    return neighbors;
  }

})();


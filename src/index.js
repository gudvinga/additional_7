
module.exports = function solveSudoku(matrix) {
  let changeMarker; //if marker == true, it means that happened changed
  let bugMarker;
  let workMatrix = copyArray(matrix); //for successful tests

  //fill matrix with arrays
  if (!checkPossibleValuesArr()) return 'Error: there\'s no solution';

  //play guessing game
  if (!guessingGame()) return 'Error: there\'s no solution';

  return workMatrix;

  function guessingGame() {
    let linkedList = {
      length: 0,
      tail: null,
      add: function (data) {
        data.prev = this.tail;
        this.tail = data;
        this.length++;
      },
      del: function () {
        this.tail = this.tail.prev;
        this.length--;
      }
    };
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (Array.isArray(workMatrix[x][y])) {
          let data = {
            x: x,
            y: y,
            currentState: copyArray(workMatrix),
            possibleValues: copyArray(workMatrix[x][y])
          };
          linkedList.add(data);

          if (!guessingRecursion()) return false;

          function guessingRecursion() {
            bugMarker = false;
            if (linkedList.tail.possibleValues.length !== 0) {
              x = linkedList.tail.x;
              y = linkedList.tail.y;

              workMatrix = copyArray(linkedList.tail.currentState);
              workMatrix[x][y] = linkedList.tail.possibleValues.pop();

              if (!checkPossibleValuesArr()) {
                if (linkedList.tail.possibleValues.length !== 0) {
                  guessingRecursion();
                } else {
                  linkedList.del();
                  if (linkedList.length === 0) bugMarker = true;
                  else guessingRecursion();
                }
              }
            } else {
              linkedList.del();
              if (linkedList.length === 0) bugMarker = true;
              else guessingRecursion();
            }
            return !bugMarker;
          }
        }
      }
    }
    return true;
  }

  //Theese functions just reduce the count of guesswork :)
  function checkPossibleValuesArr() {
    changeMarker = false;
    bugMarker = false;
    for (let i = 0; i < 9; i++) {
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          const [r, c] = [Math.floor(i / 3) * 3, (i % 3) * 3];
          let possibly;

          if (workMatrix[x + r][y + c] !== 0 && !Array.isArray(workMatrix[x + r][y + c])) continue;
          if (Array.isArray(workMatrix[x + r][y + c])) possibly = workMatrix[x + r][y + c];
          else possibly = [1, 2, 3, 4, 5, 6, 7, 8, 9];

          possibly = checkSmallSquare(r, c, possibly);
          possibly = checkRowAndColumn(x + r, y + c, possibly);
          workMatrix[x + r][y + c] = possibly;

          if (possibly.length === 0) bugMarker = true;
        }
      }
    }
    if (changeMarker) checkPossibleValuesArr();
    return !bugMarker;
  }

  function checkSmallSquare(r, c, possibleValuesArr) {
    for (let x = r; x < r + 3; x++) {
      for (let y = c; y < c + 3; y++) {
        const item = possibleValuesArr.indexOf(workMatrix[x][y]);
        if (item !== -1) {
          changeMarker = true;
          possibleValuesArr.splice(item, 1);
        }
      }
    }
    return possibleValuesArr;
  }

  function checkRowAndColumn(x, y, possibleValuesArr) {
    for (let i = 0; i < 9; i++) {
      const itemX = possibleValuesArr.indexOf(workMatrix[i][y]);
      if (itemX !== -1) {
        changeMarker = true;
        possibleValuesArr.splice(itemX, 1);
      }
      const itemY = possibleValuesArr.indexOf(workMatrix[x][i]);
      if (itemY !== -1) {
        marker = true;
        possibleValuesArr.splice(itemY, 1);
      }
    }
    return possibleValuesArr;
  }

  function copyArray(array) {
    let newArray = [];
    for (let i = 0, l = array.length; i < l; i++) {
      if (Array.isArray(array[i])) newArray[i] = copyArray(array[i]);
      else newArray[i] = array[i];
    }
    return newArray;
  }
}
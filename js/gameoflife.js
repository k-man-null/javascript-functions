function seed() {
  let args = [];
  for(let i=0; i<arguments.length; i++) {
    args.push(arguments[i])
  }
  return args;
}

function same([x, y], [j, k]) {
  return x === j && y === k
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let counter = 0
  for(let i=0; i<this.length;i++) {
    if(same(this[i], cell)) {
      counter+=1
    }
  }
  return counter>0
}

const printCell = (cell, state) => {
  let alive;
  if(contains.call(state,cell)) {
    alive = unescape('\u25A3')
  }else {
    alive = unescape('\u25A2')
  } 
  return alive
};

const corners = (state = []) => {
  let maxY,maxX,minY,minX;
  let x = []
  let y = []
  
  if(state.length > 0){
    for(let i=0; i<state.length;i++) {
      x.push(state[i][0]);
      y.push(state[i][1]);
    }
      maxX = Math.max(...x);
      maxY = Math.max(...y);
      minX = Math.min(...x);
      minY = Math.min(...y);
    return {
      topRight:[maxX,maxY],
      bottomLeft:[minX,minY]
    }
  } else {
  }return {
      topRight:[0,0],
      bottomLeft:[0,0]
    }  
};

const printCells = (state) => {
  
  let cellMatrix
  
  if(state.length === 1){
    cellMatrix = unescape('\u25A3')//`${printCell(state,state)}\x20\n`
  }else {
      let cells = []
      const x = corners(state).topRight[0]
      const y = corners(state).topRight[1]
      const a = corners(state).bottomLeft[0];
      const b = corners(state).bottomLeft[1];
      for(let i=y;i>b-1;i--){
        for(let ii=a;ii<x+1;ii++){
          cells.push([ii,i])
        }
      }
      let Cells;
      Cells = cells
      let cellsString = ''
      for(let cell of Cells){
        cellsString += printCell(cell,state)
      }
      let spacedString
      spacedString = cellsString.split('').join(' ')
      let splitArray
      splitArray = spacedString.match(/.{1,5}/g);
      
      let finalString = ''
      for(let myString of splitArray){
      finalString+=`${myString}\n`
      }
      cellMatrix = finalString
    }
    return cellMatrix        
}

const getNeighborsOf = ([x, y]) => {
  return [[x,y-1],[x,y+1],[x-1,y+1],[x-1,y-1],[x-1,y],[x+1,y+1],[x+1,y],[x+1,y-1]]
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell)
  let myFilter = contains.bind(state)
  return neighbors.filter(m => myFilter(m))
};

const willBeAlive = (cell, state) => {
  let resurrected
  if((getLivingNeighbors(cell,state).length === 3) || (contains.call(state,cell) && getLivingNeighbors(cell,state).length === 2)) {
    resurrected = true
  }else {
    resurrected = false
  }
  return resurrected
};

const calculateNext = (state) => {
  let cells = []
  const x = corners(state).topRight[0] + 1;
  const y = corners(state).topRight[1] + 1;
  const a = corners(state).bottomLeft[0] - 1;
  const b = corners(state).bottomLeft[1] - 1;
  for(let i=y;i>b-1;i--){
    for(let ii=a;ii<x+1;ii++){
      cells.push([ii,i])
    }
  }

  return cells.filter(cell => willBeAlive(cell,state))
};

const iterate = (state, iterations) => {
    let states = [state]
    let counter = 0
    while(counter<iterations){
       let newState = calculateNext(states[counter])
       states.push(newState)
       counter+=1
    }
    return states
};

const main = (pattern, iterations) => { 
  let grids = iterate(startPatterns[pattern], iterations)
  for(let i=0;i<grids.length;i++){
    console.log(printCells(grids[i]))
  }
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;
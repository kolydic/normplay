// Modified script_clean.js to use Laura as the player

function rand(max) {
    return Math.floor(Math.random() * max);
  }
  
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function displayVictoryMess(moves) {
  console.log("Laura completed the maze in " + moves + " steps!");
  // You can add your own victory message here
  }
  
  function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
      document.getElementById(id).style.visibility = "hidden";
    } else {
      document.getElementById(id).style.visibility = "visible";
    }
  }
  
  function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
      n: {
        y: -1,
        x: 0,
        o: "s"
      },
      s: {
        y: 1,
        x: 0,
        o: "n"
      },
      e: {
        y: 0,
        x: 1,
        o: "w"
      },
      w: {
        y: 0,
        x: -1,
        o: "e"
      }
    };
  
    this.map = function() {
      return mazeMap;
    };
    this.startCoord = function() {
      return startCoord;
    };
    this.endCoord = function() {
      return endCoord;
    };
  
    function genMap() {
      mazeMap = new Array(height);
      for (y = 0; y < height; y++) {
        mazeMap[y] = new Array(width);
        for (x = 0; x < width; ++x) {
          mazeMap[y][x] = {
            n: false,
            s: false,
            e: false,
            w: false,
            visited: false,
            priorPos: null
          };
        }
      }
    }
  
    function defineMaze() {
      var isComp = false;
      var move = false;
      var cellsVisited = 1;
      var numLoops = 0;
      var maxLoops = 0;
      var pos = {
        x: 0,
        y: 0
      };
      var numCells = width * height;
      while (!isComp) {
        move = false;
        mazeMap[pos.x][pos.y].visited = true;
  
        if (numLoops >= maxLoops) {
          shuffle(dirs);
          maxLoops = Math.round(rand(height / 8));
          numLoops = 0;
        }
        numLoops++;
        for (index = 0; index < dirs.length; index++) {
          var direction = dirs[index];
          var nx = pos.x + modDir[direction].x;
          var ny = pos.y + modDir[direction].y;
  
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            //Check if the tile is already visited
            if (!mazeMap[nx][ny].visited) {
              //Carve through walls from this tile to next
              mazeMap[pos.x][pos.y][direction] = true;
              mazeMap[nx][ny][modDir[direction].o] = true;
  
              //Set Currentcell as next cells Prior visited
              mazeMap[nx][ny].priorPos = pos;
              //Update Cell position to newly visited location
              pos = {
                x: nx,
                y: ny
              };
              cellsVisited++;
              //Recursively call this method on the next tile
              move = true;
              break;
            }
          }
        }
  
        if (!move) {
          //  If it failed to find a direction,
          //  move the current position back to the prior cell and Recall the method.
          pos = mazeMap[pos.x][pos.y].priorPos;
        }
        if (numCells == cellsVisited) {
          isComp = true;
        }
      }
    }
  
    function defineStartEnd() {
      switch (rand(4)) {
        case 0:
          startCoord = {
            x: 0,
            y: 0
          };
          endCoord = {
            x: height - 1,
            y: width - 1
          };
          break;
        case 1:
          startCoord = {
            x: 0,
            y: width - 1
          };
          endCoord = {
            x: height - 1,
            y: 0
          };
          break;
        case 2:
          startCoord = {
            x: height - 1,
            y: 0
          };
          endCoord = {
            x: 0,
            y: width - 1
          };
          break;
        case 3:
          startCoord = {
            x: height - 1,
            y: width - 1
          };
          endCoord = {
            x: 0,
            y: 0
          };
          break;
      }
    }
  
    genMap();
    defineStartEnd();
    defineMaze();
  }
  
  function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;
  
    this.redrawMaze = function(size) {
      cellSize = size;
      ctx.lineWidth = cellSize / 50;
      drawMap();
      drawEndMethod();
    };
  
    function drawCell(xCord, yCord, cell) {
      var x = xCord * cellSize;
      var y = yCord * cellSize;

    // Draw walls in bright white
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
  
      if (cell.n == false) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (cell.s === false) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.e === false) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.w === false) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
    }
  
    function drawMap() {
      for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
          drawCell(x, y, map[x][y]);
        }
      }
    }
  
    function drawEndFlag() {
      var coord = Maze.endCoord();
    var gridSize = 11; // 11x11 grid for the spiral
    var fraction = cellSize / gridSize;
    
    // Golden spiral pattern (1 = filled, 0 = empty)
    const spiralPattern = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
        if (spiralPattern[y][x] === 1) {
          ctx.beginPath();
          ctx.rect(
            coord.x * cellSize + x * fraction,
            coord.y * cellSize + y * fraction,
            fraction,
            fraction
          );
          ctx.fillStyle = "#b5b5e8"; // Pastel violet (same as end screen)
          ctx.fill();
        }
        }
      }
    }
  
    function drawEndSprite() {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      var coord = Maze.endCoord();
      ctx.drawImage(
        endSprite,
        2,
        2,
        endSprite.width,
        endSprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    }
  
    function clear() {
      var canvasSize = cellSize * map.length;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
  
    if (endSprite != null) {
      drawEndMethod = drawEndSprite;
    } else {
      drawEndMethod = drawEndFlag;
    }
    clear();
    drawMap();
    drawEndMethod();
  }
  
  function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if (sprite != null) {
      drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
      x: maze.startCoord().x,
      y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;
  
    this.redrawPlayer = function(_cellsize) {
      cellSize = _cellsize;
      drawSpriteImg(cellCoords);
    };

  this.getCurrentPosition = function() {
    return cellCoords;
  };
  
    function drawSpriteCircle(coord) {
    // Clear previous position
    removeSprite(coord);
    
    // Draw Laura as a stick figure
    var centerX = (coord.x + 1) * cellSize - halfCellSize;
    var centerY = (coord.y + 1) * cellSize - halfCellSize;
    

    
    // Head
      ctx.beginPath();
    ctx.fillStyle = "#dda0dd";
    ctx.arc(centerX, centerY - 8, 6, 0, 2 * Math.PI);
      ctx.fill();
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Body
    ctx.beginPath();
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 1;
    ctx.moveTo(centerX, centerY - 2);
    ctx.lineTo(centerX, centerY + 8);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(centerX - 8, centerY);
    ctx.lineTo(centerX + 8, centerY);
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 8);
    ctx.lineTo(centerX - 6, centerY + 16);
    ctx.moveTo(centerX, centerY + 8);
    ctx.lineTo(centerX + 6, centerY + 16);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = "#666666";
    ctx.font = "8px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Laura", centerX, centerY + 25);
    
      if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      // Trigger the end sequence
      if (window.mazeController) {
        window.mazeController.triggerEndSequence();
      }
        onComplete(moves);
        player.unbindKeyDown();
      }
    }
  
    function drawSpriteImg(coord) {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      ctx.drawImage(
        sprite,
        0,
        0,
        sprite.width,
        sprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
      if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      // Trigger the end sequence
      if (window.mazeController) {
        window.mazeController.triggerEndSequence();
      }
        onComplete(moves);
        player.unbindKeyDown();
      }
    }
  
    function removeSprite(coord) {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      ctx.clearRect(
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    
    // Redraw dots that might have been cleared
    if (window.mazeController && window.mazeController.dots) {
      window.mazeController.redrawDots();
    }
    }
  
    function check(e) {
      var cell = map[cellCoords.x][cellCoords.y];
      moves++;
      switch (e.keyCode) {
        case 65:
        case 37: // west
          if (cell.w == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x - 1,
              y: cellCoords.y
            };
            drawSprite(cellCoords);
          // Check collision after movement
          if (window.mazeController) {
            window.mazeController.checkLauraDotCollision();
          }
          }
          break;
        case 87:
        case 38: // north
          if (cell.n == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x,
              y: cellCoords.y - 1
            };
            drawSprite(cellCoords);
          // Check collision after movement
          if (window.mazeController) {
            window.mazeController.checkLauraDotCollision();
          }
          }
          break;
        case 68:
        case 39: // east
          if (cell.e == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x + 1,
              y: cellCoords.y
            };
            drawSprite(cellCoords);
          // Check collision after movement
          if (window.mazeController) {
            window.mazeController.checkLauraDotCollision();
          }
          }
          break;
        case 83:
        case 40: // south
          if (cell.s == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x,
              y: cellCoords.y + 1
            };
            drawSprite(cellCoords);
          // Check collision after movement
          if (window.mazeController) {
            window.mazeController.checkLauraDotCollision();
          }
          }
          break;
      }
    }
  
    this.bindKeyDown = function() {
      window.addEventListener("keydown", check, false);
    };
  
    this.unbindKeyDown = function() {
      window.removeEventListener("keydown", check, false);
    };
  
    drawSprite(maze.startCoord());
    this.bindKeyDown();
  }
  
// Global variables
var mazeCanvas;
var ctx;
  var maze, draw, player;
  var cellSize;
var difficulty = 15; // Default difficulty

class MazeController {
  constructor() {
    this.maze = null;
    this.cursorAgent = null;
    this.isActive = false;
    this.dots = [];
  }

  createMaze() {
    // Get maze container and cursor agent
    this.maze = document.getElementById('maze');
    this.cursorAgent = document.getElementById('cursorAgent');
    
    if (!this.maze || !this.cursorAgent) {
      console.error('Maze or cursor agent not found');
      return;
    }

    // Clear maze content
    this.maze.innerHTML = '';

    // Create canvas
    this.mazeCanvas = document.createElement('canvas');
    this.mazeCanvas.width = 600;
    this.mazeCanvas.height = 600;
    this.mazeCanvas.style.border = '2px solid #333';
    this.mazeCanvas.style.backgroundColor = 'black';
    this.maze.appendChild(this.mazeCanvas);

    ctx = this.mazeCanvas.getContext('2d');
    mazeCanvas = this.mazeCanvas;

    // Calculate cell size based on difficulty
    cellSize = mazeCanvas.width / difficulty;

    // Create maze
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess);

    // Add static dots to the maze
    this.addStaticDots();



    // Hide the original HTML Laura when maze is active
    this.cursorAgent.style.display = 'none';

    console.log('Maze created successfully with Laura as player');
  }

  addStaticDots() {
    // Define 10 dots with their positions and text
    const dots = [
      {x: 2, y: 2, text: "Like everything, balance matters. <br>Caring, not caring <br>what others think.<br>The circularity, spiraling <br>it is exhausting. <br> I don't want to think about how that <br> stranger on the sidwalk feels about how I look.<br> I want wear a tight dress and dance in the park. <br> I want to wear nothing.<br> I want to stop wearing the cloak of minds over my own.<br> it is suffocating. <br>. I just need to <b>stop caring.</b>"},
      {x: 5, y: 3, text: "I am worthy of love.<br> I am worthy of loving myself. <br>I am worthy of speaking.<br> I am worthy of the space my body takes up.<br>I am worthy of protecting my needs. <br> I deserve to feel okay existing."},
      {x: 8, y: 6, text: "There is no such thing as deserving.<br> We just are.<br> We are just animals, existing. <br>We are strung-together states of matter and essence.<br> We are unimportant. <br>Nothing matters. Nobody matters.<br> Nobody <i> deserves </i>.<br> Therefore, I do not need to deserve; <br>the premise is fabricated."},
      {x: 3, y: 8, text: "And yet, I long to be loved. <br>I long to love. <br>I want to be witnessed, held.<br> I want to feel like I matter. <br>I want to do good. <br>I want to serve liberation.<br> I want to stand up, stand with.<br> Stand with. <br>My voice matters because of its <br>relative gravity. <br>I need it for not me, but to stand up for/with.<br> Everything matters, because we are real. <br>We feel. That matters. <br>Pain matters. So much of it doesn't need to exist.<br> Who will speak for/with?<br> Anyone who can must. Therefore I must matter. <br>Therefore I cannot be trapped in my mind. <br>My own self does not matter. <br><br>And yet, I long to be loved."},
      {x: 10, y: 4, text: "Who do I exist for?"},
      {x: 6, y: 10, text: "I don't exist for any reason. <br>I just exist. <br>There is no such thing as a reason to exist."},
      {x: 12, y: 7, text: "Is there such thing as a reason to exist?"},
      {x: 8, y: 12, text: "I could enjoy more of this transient pleasure of existence if I could just stop worrying about how the shape of my existence feels to other people."},
      {x: 9, y: 13, text: "It matters, how we make others feel.<br> It matters to be warm, to bring peace, to bring self-appreciation for others. <br>But do I do that for me? How do I love me?"},
      {x: 13, y: 11, text: "I suppose I want to prefigure <br>a warm-joyful relational world. <br>If I enact the life I want, it will <i>be</i>.<br>"}
    ];

    console.log('Creating dots...');
    console.log('Cell size:', cellSize);
    console.log('Canvas size:', this.mazeCanvas.width, this.mazeCanvas.height);
    
    // Draw each dot
    dots.forEach((dot, index) => {
      this.drawDot(dot.x, dot.y, dot.text);
    });
    console.log('Dots created:', this.dots.length);
    console.log('Dots array:', this.dots);
  }

  drawDot(x, y, text) {
    const centerX = (x + 1) * cellSize - cellSize / 2;
    const centerY = (y + 1) * cellSize - cellSize / 2;
    
    console.log('Drawing dot at', x, y, 'canvas coords:', centerX, centerY);
    
    // Draw green dot
    ctx.beginPath();
    ctx.fillStyle = '#00ff00';
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add hover detection
    this.addDotHoverDetection(x, y, text, centerX, centerY);
  }

  addDotHoverDetection(x, y, text, centerX, centerY) {
    this.dots.push({x, y, text, centerX, centerY});
  }

  showTextBubble(text, lauraX, lauraY) {
    console.log('Creating text bubble:', text, 'at position:', lauraX, lauraY);
    
    // Remove existing bubble
    this.hideTextBubble();
    
    // Create text bubble
    const bubble = document.createElement('div');
    bubble.id = 'textBubble';
    bubble.style.position = 'fixed';
    
    // Use provided coordinates or fallback to center of screen
    const x = isNaN(lauraX) ? window.innerWidth / 2 : lauraX + 10;
    const y = isNaN(lauraY) ? window.innerHeight / 2 : lauraY - 30;
    
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    bubble.style.backgroundColor = '#9CAF88'; // Pastel sage
    bubble.style.color = 'black';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '5px';
    bubble.style.border = '2px solid #7A8B6A';
    bubble.style.fontSize = '14px';
    bubble.style.fontWeight = 'normal';
    bubble.style.zIndex = '9999'; // Very high z-index
    bubble.style.pointerEvents = 'none';
    bubble.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
    bubble.innerHTML = text; // Use innerHTML instead of textContent to render HTML formatting
    
    document.body.appendChild(bubble);
    console.log('Text bubble created and added to DOM at:', x, y);
    
    // Check if the bubble is actually visible
    setTimeout(() => {
      const bubbleElement = document.getElementById('textBubble');
      if (bubbleElement) {
        console.log('Bubble element found:', bubbleElement);
        console.log('Bubble computed style:', window.getComputedStyle(bubbleElement));
        console.log('Bubble offset:', bubbleElement.offsetLeft, bubbleElement.offsetTop);
        console.log('Bubble client rect:', bubbleElement.getBoundingClientRect());
    } else {
        console.log('Bubble element not found after creation');
      }
    }, 100);
  }

  hideTextBubble() {
    const bubble = document.getElementById('textBubble');
    if (bubble) {
      bubble.remove();
    }
  }

  checkLauraDotCollision() {
    console.log('=== COLLISION CHECK START ===');
    console.log('Dots length:', this.dots.length);
    console.log('Maze canvas:', !!this.mazeCanvas);
    console.log('Player:', !!player);
    console.log('Global player variable:', typeof player);
    
    if (!this.dots.length || !this.mazeCanvas || !player) {
      console.log('Missing required elements:', {
        dotsLength: this.dots.length,
        mazeCanvas: !!this.mazeCanvas,
        player: !!player
      });
      return;
    }
    
    // Try to get Laura's position from the maze player
    console.log('Attempting to get player position...');
    let lauraCoord;
    try {
      lauraCoord = player.getCurrentPosition();
      console.log('Laura coord from player:', lauraCoord);
    } catch (error) {
      console.log('Error getting player position:', error);
      return;
    }
    
    if (!lauraCoord) {
      console.log('Could not get Laura position from player');
      return;
    }
    
    // Convert Laura's maze coordinates to canvas coordinates
    const lauraCanvasX = (lauraCoord.x + 1) * cellSize - cellSize / 2;
    const lauraCanvasY = (lauraCoord.y + 1) * cellSize - cellSize / 2;
    
    console.log('Laura maze coords:', lauraCoord.x, lauraCoord.y);
    console.log('Cell size:', cellSize);
    console.log('Calculated canvas coords:', lauraCanvasX, lauraCanvasY);
    
    console.log('Cell size:', cellSize);
    console.log('Laura maze position:', lauraCoord.x, lauraCoord.y);
    console.log('Laura canvas position:', lauraCanvasX, lauraCanvasY);
    console.log('Number of dots:', this.dots.length);
    
    let isOverDot = false;
    
    this.dots.forEach((dot, index) => {
      // Check if Laura is in the same cell as the dot
      const lauraCellX = lauraCoord.x;
      const lauraCellY = lauraCoord.y;
      const dotCellX = dot.x;
      const dotCellY = dot.y;
      
      console.log('Laura cell position:', lauraCellX, lauraCellY);
      console.log('Dot', index, 'cell position:', dotCellX, dotCellY);
      
      if (lauraCellX === dotCellX && lauraCellY === dotCellY) {
        console.log('Laura in same cell as dot', index);
        // Show text bubble at Laura's position on the page
        const mazeRect = this.mazeCanvas.getBoundingClientRect();
        const lauraPageX = mazeRect.left + lauraCanvasX;
        const lauraPageY = mazeRect.top + lauraCanvasY;
        console.log('Maze rect:', mazeRect.left, mazeRect.top);
        console.log('Laura canvas coords:', lauraCanvasX, lauraCanvasY);
        console.log('Laura page coords:', lauraPageX, lauraPageY);
        this.showTextBubble(dot.text, lauraPageX, lauraPageY);
        isOverDot = true;
      }
    });
    
    if (!isOverDot) {
      this.hideTextBubble();
    }
  }

  redrawDots() {
    if (!this.dots.length) return;
    
    this.dots.forEach(dot => {
      // Redraw each dot
      ctx.beginPath();
      ctx.fillStyle = '#00ff00';
      ctx.arc(dot.centerX, dot.centerY, 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  enableMazeNavigation() {
    this.isActive = true;
    console.log('Maze navigation enabled');
  }

  disableMazeNavigation() {
    this.isActive = false;
    if (player) {
      player.unbindKeyDown();
    }
    console.log('Maze navigation disabled');
  }

  triggerEndSequence() {
    console.log('Triggering end sequence...');
    
    // Hide the maze container
    const mazeContainer = document.getElementById('mazeContainer');
    if (mazeContainer) {
      mazeContainer.style.display = 'none';
    }
    
    // Show the original HTML Laura again
    if (this.cursorAgent) {
      this.cursorAgent.style.display = 'block';
    }
    
    // Create the transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'endTransitionOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '10000';
    overlay.style.transition = 'background-color 3s ease';
    document.body.appendChild(overlay);
    
    // Fade to pastel violet
    setTimeout(() => {
      overlay.style.backgroundColor = '#b5b5e8'; // Light pastel violet
    }, 100);
    
    // Show Laura back on screen after the transition
    setTimeout(() => {
      if (this.cursorAgent) {
        this.cursorAgent.style.display = 'block';
        this.cursorAgent.style.opacity = '0';
        this.cursorAgent.style.transition = 'opacity 2s ease';
        
        // Position Laura in the center of the screen
        this.cursorAgent.style.left = '50%';
        this.cursorAgent.style.top = '50%';
        this.cursorAgent.style.transform = 'translate(-50%, -50%)';
        this.cursorAgent.style.zIndex = '10002'; // Higher than the overlay
        
        setTimeout(() => {
          this.cursorAgent.style.opacity = '1';
          
          // Start tracking Laura's movement on the purple screen
          this.startPurpleScreenTracking();
        }, 100);
      }
    }, 2000);
  }

  startPurpleScreenTracking() {
    let moveCount = 0;
    let lastX = 50; // Starting position (50%)
    let lastY = 50; // Starting position (50%)
    
    // Track arrow key movements
    const trackMovement = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        
        // Get current position
        const currentX = parseFloat(this.cursorAgent.style.left);
        const currentY = parseFloat(this.cursorAgent.style.top);
        
        // Check if Laura actually moved (not just pressed the key)
        if (currentX !== lastX || currentY !== lastY) {
          moveCount++;
          lastX = currentX;
          lastY = currentY;
          
          console.log('Laura moved, count:', moveCount);
          
          // Show text after 2 moves
          if (moveCount >= 2 && !document.getElementById('purpleScreenText')) {
            this.showPurpleScreenText();
          }
        }
      }
    };
    
    // Add event listener for movement tracking
    document.addEventListener('keydown', trackMovement);
    
    // Store the tracking function so we can remove it later if needed
    this.purpleScreenTracker = trackMovement;
  }

  showPurpleScreenText() {
    const text = document.createElement('div');
    text.id = 'purpleScreenText';
    text.style.position = 'fixed';
    text.style.top = '50%';
    text.style.left = '50%';
    text.style.transform = 'translate(-50%, -50%)';
    text.style.color = '#5A6B5A'; // Dark sage green
    text.style.fontSize = '14px';
    text.style.fontFamily = 'Courier New, monospace';
    text.style.textAlign = 'center';
    text.style.zIndex = '10003';
    text.style.opacity = '0';
    text.style.transition = 'opacity 2s ease';
    text.textContent = "now... what world do we want to exist in? what does it feel like? <br> let's go there";
    
    document.body.appendChild(text);
    
    setTimeout(() => {
      text.style.opacity = '1';
    }, 100);
  }
}

// Create global maze controller
const mazeController = new MazeController();

// Export for use in HTML
window.mazeController = mazeController;

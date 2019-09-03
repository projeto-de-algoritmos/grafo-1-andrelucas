var ctx, wid, hei, colunas, linhas, grid = 6;
var maze, stack = [];
var start = { x: -1, y: -1 }, end = { x: -1, y: -1 };

function drawMaze() {
    for (var i = 0; i < colunas; i++) {
        for (var j = 0; j < linhas; j++) {
            
            var grd = ctx.createLinearGradient(i, j, 155, 20*j);
            grd.addColorStop(0, "black");
            grd.addColorStop(0.5, "#3244a8");
            grd.addColorStop(0.6, "#3244a8");
            grd.addColorStop(0.7, "#3240a8");
            grd.addColorStop(0.8, "#3222a8");
            grd.addColorStop(1, "black");
            
            var grdBack = ctx.createLinearGradient(i+j, j, 130, 10*j*j);
            grdBack.addColorStop(0, "#500000");
            grdBack.addColorStop(0.5, "#1a0000");
            grdBack.addColorStop(0.6, "#2a0000");
            grdBack.addColorStop(0.7, "#3a0000");
            grdBack.addColorStop(0.8, "#4a0000");
            grdBack.addColorStop(1, "#500000");
            switch (maze[i][j]) {
                case 0: ctx.fillStyle = grd; break;
                case 1: ctx.fillStyle = "white"; break;
                case 2: ctx.fillStyle = "red"; break;
                case 3: ctx.fillStyle = "orange"; break;
                case 4: ctx.fillStyle = "#500000"; break;
            }
            ctx.fillRect(grid * i, grid * j, grid, grid);
        }
    }
}

function solveMaze() {
    if (start.x == end.x && start.y == end.y) {
        for (var i = 0; i < colunas; i++) {
            for (var j = 0; j < linhas; j++) {
                switch (maze[i][j]) {
                    case 2: maze[i][j] = 3; break;
                    case 4: maze[i][j] = 0; break;
                }
            }
        }
        drawMaze();
        return;
    }
    var neighbours = getFNeighbours(start.x, start.y, 0);
    if (neighbours.length) {
        stack.push(start);
        start = neighbours[0];
        maze[start.x][start.y] = 2;
    } else {
        maze[start.x][start.y] = 4;
        start = stack.pop();
    }

    drawMaze();
    requestAnimationFrame(solveMaze);
}
function getCursorPos(event) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor((event.clientX - rect.left) / grid);
    var y = Math.floor((event.clientY - rect.top) / grid);
    if (maze[x][y]) return;
    
    if (start.x == -1) {
        start = { x: x, y: y };
    } else {
        end = { x: x, y: y };
        maze[start.x][start.y] = 2;
        solveMaze();
    }
}

function getFNeighbours(sx, sy, a) {
    var n = [];
    if (sx - 1 > 0 && maze[sx - 1][sy] == a) {
        n.push({ x: sx - 1, y: sy });
    }
    if (sx + 1 < colunas - 1 && maze[sx + 1][sy] == a) {
        n.push({ x: sx + 1, y: sy });
    }
    if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
        n.push({ x: sx, y: sy - 1 });
    }
    if (sy + 1 < linhas - 1 && maze[sx][sy + 1] == a) {
        n.push({ x: sx, y: sy + 1 });
    }
    return n;
}

function getNeighbours(sx, sy, a) {
    var n = [];
    if (sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a) {
        n.push({ x: sx - 1, y: sy }); n.push({ x: sx - 2, y: sy });
    }
    if (sx + 1 < colunas - 1 && maze[sx + 1][sy] == a && sx + 2 < colunas - 1 && maze[sx + 2][sy] == a) {
        n.push({ x: sx + 1, y: sy }); n.push({ x: sx + 2, y: sy });
    }
    if (sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a) {
        n.push({ x: sx, y: sy - 1 }); n.push({ x: sx, y: sy - 2 });
    }
    if (sy + 1 < linhas - 1 && maze[sx][sy + 1] == a && sy + 2 < linhas - 1 && maze[sx][sy + 2] == a) {
        n.push({ x: sx, y: sy + 1 }); n.push({ x: sx, y: sy + 2 });
    }
    return n;
}
function createArray(c, r) {
    var m = new Array(c);
    for (var i = 0; i < c; i++) {
        m[i] = new Array(r);
        for (var j = 0; j < r; j++) {
            m[i][j] = 1;
        }
    }
    return m;
}
function createMaze() {
    var neighbours = getNeighbours(start.x, start.y, 1), l;
    if (neighbours.length < 1) {
        if (stack.length < 1) {
            drawMaze();
            stack = [];
            start.x = start.y = -1;
            document.getElementById("canvas").addEventListener("mousedown", getCursorPos, false);
            return;
        }
        start = stack.pop();
    } else {
        var i = 2 * Math.floor(Math.random() * (neighbours.length / 2))
        l = neighbours[i]; maze[l.x][l.y] = 0;
        l = neighbours[i + 1]; maze[l.x][l.y] = 0;
        start = l
        stack.push(start)
    }
    drawMaze();
    requestAnimationFrame(createMaze);
}

function createCanvas(w, h) {
    var canvas = document.createElement("canvas");

    height = h;
    width = w;

    canvas.width = width;
    canvas.height = height;
    canvas.id = "canvas";
    ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    document.body.appendChild(canvas);
}
function init() {
    colunas = 165;
    linhas = 50;
    createCanvas(grid * colunas, grid * linhas);
    maze = createArray(colunas, linhas);
    start.x = Math.floor(Math.random() * (colunas / 2));
    start.y = Math.floor(Math.random() * (linhas / 2));
    if (!(start.x & 1)) start.x++; if (!(start.y & 1)) start.y++;
    maze[start.x][start.y] = 0;
    createMaze();
}

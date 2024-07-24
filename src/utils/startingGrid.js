export function getGrid(width, height) {
    let grid = [];
    for (let i = 0; i < height; i++) {
        let local = [];
        for (let j = 0; j < width; j++) {
            local.push({x:j, y:i, isStart:false, isTarget:false, weight:1, isWall:false});
        }
        grid.push(local);
    }
    grid[Math.floor(height/2)][Math.floor(width/2)].isStart = true;
    grid[height-2][width-2].isTarget = true;
    return grid;
}
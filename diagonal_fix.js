// 改善されたhasWallBetween関数

hasWallBetween(x1, y1, x2, y2) {
    // 同じタイルまたは隣接タイルの場合はチェック不要
    if (Math.abs(x2 - x1) <= 1 && Math.abs(y2 - y1) <= 1) {
        return false;
    }
    
    // 斜め移動の場合は、角を通り抜け防止のため
    // より厳格なチェックを行う
    if (Math.abs(x2 - x1) === Math.abs(y2 - y1)) {
        // 完全な対角線移動の場合
        return this.checkDiagonalPath(x1, y1, x2, y2);
    }
    
    // 従来のBresenhamアルゴリズム
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    
    let x = x1;
    let y = y1;
    
    while (true) {
        // 現在の位置が壁かチェック
        if (x >= 0 && x < this.mazeData.width && 
            y >= 0 && y < this.mazeData.height && 
            this.mazeData.grid[y][x] === 0) {
            return true; // 壁が見つかった
        }
        
        // 目標に到達したら終了
        if (x === x2 && y === y2) break;
        
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
    
    return false; // 壁は見つからなかった
}

// 新しい対角線専用チェック関数
checkDiagonalPath(x1, y1, x2, y2) {
    const stepX = x1 < x2 ? 1 : -1;
    const stepY = y1 < y2 ? 1 : -1;
    
    // 対角線移動では、各ステップで隣接する2つの壁もチェック
    let currentX = x1;
    let currentY = y1;
    
    while (currentX !== x2 || currentY !== y2) {
        // 次の対角線ステップ
        const nextX = currentX + stepX;
        const nextY = currentY + stepY;
        
        // 目標タイルが壁かチェック
        if (this.isWall(nextX, nextY)) {
            return true;
        }
        
        // 角を通り抜け防止: 隣接する2つのタイルもチェック
        if (this.isWall(currentX + stepX, currentY) || 
            this.isWall(currentX, currentY + stepY)) {
            return true; // 角が塞がれている
        }
        
        currentX = nextX;
        currentY = nextY;
    }
    
    return false;
}

// ヘルパー関数
isWall(x, y) {
    if (x < 0 || x >= this.mazeData.width || 
        y < 0 || y >= this.mazeData.height) {
        return true; // 境界外は壁扱い
    }
    return this.mazeData.grid[y][x] === 0;
}
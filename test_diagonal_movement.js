// 斜め移動のコーナーケーステスト

// Bresenhamアルゴリズムの動作をシミュレート
function testBresenhamPath(x1, y1, x2, y2) {
    console.log(`Testing path from (${x1},${y1}) to (${x2},${y2})`);
    
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    
    let x = x1;
    let y = y1;
    const path = [];
    
    while (true) {
        path.push({ x, y });
        
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
    
    console.log('Path tiles:', path);
    return path;
}

// 問題のケースをテスト
console.log('=== Corner Case Test ===');

// ケース1: 対角線移動
testBresenhamPath(0, 0, 2, 2);

// ケース2: より急な角度
testBresenhamPath(0, 0, 3, 1);

// ケース3: 逆方向
testBresenhamPath(2, 0, 0, 2);

// 実際の移動ロジックの問題点分析
console.log('\n=== 問題の分析 ===');
console.log('1. Bresenhamは離散的な格子点のみチェック');
console.log('2. 実際の移動は連続的な座標で補間');
console.log('3. 視覚的には壁の角を「かすめて」通るように見える');
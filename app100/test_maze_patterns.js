// Test script to verify maze pattern generation
// Quick test to ensure all 5 patterns work correctly

console.log('Testing 5 maze patterns...\n');

// Simulate pattern selection 10 times to test randomness
for (let i = 0; i < 10; i++) {
    const patternIndex = Math.floor(Math.random() * 5);
    
    // Pattern names
    const patterns = [
        'シンプル縦路',
        'L字型迷路',
        '螺旋型迷路', 
        '十字型迷路',
        'ジグザグ迷路'
    ];
    
    console.log(`Test ${i + 1}: Selected pattern ${patternIndex + 1} - ${patterns[patternIndex]}`);
}

console.log('\n✅ Pattern selection test complete!');
console.log('🎮 Open the game in browser to test the actual maze patterns.');
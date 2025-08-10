/**
 * 3 Doors Logic Maze Game
 * 4-6歳向け論理思考学習迷路ゲーム
 */

class ThreeDoorsLogicMaze {
    constructor() {
        // ゲーム状態
        this.currentScreen = 'start';
        this.selectedVehicle = null;
        this.currentTask = null;
        this.inventory = {
            items: new Set(),
            switches: new Map(),
            badges: new Set()
        };
        
        // ゲーム設定
        this.soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');
        
        // キャンバス設定
        this.canvas = null;
        this.ctx = null;
        this.canvasWidth = 320;
        this.canvasHeight = 480;
        this.tileSize = 32;
        
        // 迷路データ
        this.mazeData = null;
        this.playerPosition = { x: 0, y: 0 };
        this.playerTarget = { x: 0, y: 0 };
        this.isMoving = false;
        
        // タッチ/ドラッグ関連
        this.isDragging = false;
        this.lastTouchPos = { x: 0, y: 0 };
        
        // ヒント表示
        this.lastProgressTime = Date.now();
        this.hintTimeout = null;
        
        // 乗り物データ
        this.vehicles = {
            car: { icon: '🚗', name: 'くるま', sound: 'car_horn' },
            bus: { icon: '🚌', name: 'バス', sound: 'bus_door' },
            train: { icon: '🚂', name: 'でんしゃ', sound: 'train_whistle' },
            plane: { icon: '✈️', name: 'ひこうき', sound: 'plane_engine' }
        };
        
        // サンプルお題データ（後でJSONから読み込み）
        this.sampleTasks = [
            { targetDoor: 'middle', text: 'まんなかの ドアを あけよう！' },
            { targetDoor: 'left', text: 'ひだりの ドアを あけよう！' },
            { targetDoor: 'right', text: 'みぎの ドアを あけよう！' }
        ];
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.setupCanvas();
        this.setupEventListeners();
        this.updateSoundToggle();
        this.showScreen('start');
        
        // 簡易迷路データをセット（後で外部ファイルから読み込み）
        this.loadSampleMaze();
    }
    
    bindElements() {
        // 画面要素
        this.screens = {
            start: document.getElementById('startScreen'),
            task: document.getElementById('taskScreen'),
            game: document.getElementById('gameScreen'),
            success: document.getElementById('successScreen')
        };
        
        // スタート画面
        this.characterBtns = document.querySelectorAll('.character-btn');
        
        // お題画面
        this.taskCharacterIcon = document.getElementById('taskCharacterIcon');
        this.taskText = document.getElementById('taskText');
        this.targetDoor = document.getElementById('targetDoor');
        this.startGameBtn = document.getElementById('startGameBtn');
        
        // ゲーム画面
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.targetDoorText = document.getElementById('targetDoorText');
        this.inventory_ui = document.getElementById('inventory');
        this.gameMessage = document.getElementById('gameMessage');
        this.hintArrow = document.getElementById('hintArrow');
        
        // コントロール
        this.soundToggleBtn = document.getElementById('soundToggleBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.homeBtn = document.getElementById('homeBtn');
        
        // 成功画面
        this.successVehicle = document.getElementById('successVehicle');
        this.successMessage = document.getElementById('successMessage');
        this.nextGameBtn = document.getElementById('nextGameBtn');
        this.backToStartBtn = document.getElementById('backToStartBtn');
        
        // エフェクト
        this.pickupEffect = document.getElementById('pickupEffect');
        this.switchEffect = document.getElementById('switchEffect');
        this.sparkleEffect = document.getElementById('sparkleEffect');
    }
    
    setupCanvas() {
        if (!this.canvas) return;
        
        // 高DPI対応
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvasWidth * dpr;
        this.canvas.height = this.canvasHeight * dpr;
        this.canvas.style.width = this.canvasWidth + 'px';
        this.canvas.style.height = this.canvasHeight + 'px';
        this.ctx.scale(dpr, dpr);
        
        // スムーズ描画設定
        if (this.ctx.imageSmoothingEnabled !== undefined) {
            this.ctx.imageSmoothingEnabled = true;
        } else if (this.ctx.mozImageSmoothingEnabled !== undefined) {
            this.ctx.mozImageSmoothingEnabled = true;
        } else if (this.ctx.webkitImageSmoothingEnabled !== undefined) {
            this.ctx.webkitImageSmoothingEnabled = true;
        }
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }
    
    setupEventListeners() {
        // キャラクター選択
        this.characterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCharacter(e.target.closest('.character-btn').dataset.vehicle);
            });
        });
        
        // ゲーム開始
        if (this.startGameBtn) {
            this.startGameBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        // コントロールボタン
        if (this.soundToggleBtn) {
            this.soundToggleBtn.addEventListener('click', () => {
                this.toggleSound();
            });
        }
        
        if (this.hintBtn) {
            this.hintBtn.addEventListener('click', () => {
                this.showHint();
            });
        }
        
        if (this.homeBtn) {
            this.homeBtn.addEventListener('click', () => {
                this.goHome();
            });
        }
        
        // キャンバスのタッチ操作
        if (this.canvas) {
            this.setupCanvasEvents();
        }
        
        // 成功画面ボタン
        if (this.nextGameBtn) {
            this.nextGameBtn.addEventListener('click', () => {
                this.nextGame();
            });
        }
        
        if (this.backToStartBtn) {
            this.backToStartBtn.addEventListener('click', () => {
                this.goHome();
            });
        }
    }
    
    setupCanvasEvents() {
        // タッチ/マウス開始（互換性のため複数イベントをサポート）
        const startEvents = ['pointerdown', 'mousedown', 'touchstart'];
        const moveEvents = ['pointermove', 'mousemove', 'touchmove'];
        const endEvents = ['pointerup', 'mouseup', 'touchend'];
        
        startEvents.forEach(eventName => {
            this.canvas.addEventListener(eventName, (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.updateTouchPosition(e);
            this.moveToward(e);
        });
        
        // タッチ/マウス移動
        moveEvents.forEach(eventName => {
            this.canvas.addEventListener(eventName, (e) => {
                e.preventDefault();
                if (this.isDragging) {
                    this.updateTouchPosition(e);
                    this.moveToward(e);
                }
            });
        });
        
        // タッチ/マウス終了
        endEvents.forEach(eventName => {
            this.canvas.addEventListener(eventName, (e) => {
            e.preventDefault();
            this.isDragging = false;
            this.stopMoving();
        });
        
        // キャンバス外でのイベント終了
        endEvents.forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.stopMoving();
                }
            });
        });
    }
    
    updateTouchPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        let clientX, clientY;
        
        // タッチイベントとマウスイベントで座標取得方法が異なる
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        this.lastTouchPos = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    // 画面遷移
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
        
        // 画面別の初期化処理
        this.onScreenChange(screenName);
    }
    
    onScreenChange(screenName) {
        switch (screenName) {
            case 'task':
                this.setupTaskScreen();
                break;
            case 'game':
                this.setupGameScreen();
                break;
            case 'success':
                this.setupSuccessScreen();
                break;
        }
    }
    
    // キャラクター選択
    selectCharacter(vehicleType) {
        // 前の選択を解除
        this.characterBtns.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 新しい選択を設定
        const selectedBtn = document.querySelector(`[data-vehicle="${vehicleType}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
            this.selectedVehicle = vehicleType;
            
            // SE再生
            this.playSE('select');
            
            // 少し待ってからお題画面へ
            setTimeout(() => {
                this.setupTask();
                this.showScreen('task');
            }, 800);
        }
    }
    
    // お題設定
    setupTask() {
        if (!this.selectedVehicle) return;
        
        // ランダムにお題を選択
        this.currentTask = this.sampleTasks[Math.floor(Math.random() * this.sampleTasks.length)];
        
        // お題画面の更新
        if (this.taskCharacterIcon) {
            this.taskCharacterIcon.textContent = this.vehicles[this.selectedVehicle].icon;
        }
        
        if (this.taskText) {
            this.taskText.textContent = this.currentTask.text;
        }
        
        // ターゲットドアのハイライト
        this.highlightTargetDoor(this.currentTask.targetDoor);
    }
    
    setupTaskScreen() {
        // TTS対応予定（簡易実装）
        if (this.soundEnabled && 'speechSynthesis' in window) {
            setTimeout(() => {
                this.speakText(this.currentTask?.text || '');
            }, 500);
        }
    }
    
    highlightTargetDoor(targetDoor) {
        // 全ドアのハイライトを解除
        const doors = document.querySelectorAll('.door');
        doors.forEach(door => door.classList.remove('highlighted'));
        
        // ターゲットドアをハイライト
        let targetElement = null;
        switch (targetDoor) {
            case 'left':
                targetElement = document.querySelector('.door.left');
                break;
            case 'middle':
                targetElement = document.querySelector('.door.middle');
                break;
            case 'right':
                targetElement = document.querySelector('.door.right');
                break;
        }
        
        if (targetElement) {
            targetElement.classList.add('highlighted');
        }
    }
    
    // ゲーム開始
    startGame() {
        if (!this.selectedVehicle || !this.currentTask) return;
        
        // プレイヤー位置をリセット
        this.resetPlayer();
        
        // インベントリをクリア
        this.inventory.items.clear();
        this.inventory.switches.clear();
        this.inventory.badges.clear();
        
        // 進捗時間をリセット
        this.lastProgressTime = Date.now();
        
        this.showScreen('game');
        this.playSE('start');
    }
    
    setupGameScreen() {
        // ターゲットドア表示を更新
        if (this.targetDoorText && this.currentTask) {
            const doorNames = {
                left: 'ひだりのドア',
                middle: 'まんなかのドア', 
                right: 'みぎのドア'
            };
            this.targetDoorText.textContent = doorNames[this.currentTask.targetDoor] || '';
        }
        
        // インベントリUI更新
        this.updateInventoryUI();
        
        // 迷路を描画
        this.drawMaze();
        
        // ゲームメッセージ更新
        if (this.gameMessage) {
            this.gameMessage.textContent = 'がめんを おしたまま うごいてね';
        }
        
        // ヒントタイマー開始
        this.startHintTimer();
    }
    
    // サンプル迷路データ読み込み（後で外部ファイル化）
    loadSampleMaze() {
        this.mazeData = {
            id: "sample_maze",
            tileSize: 32,
            width: 10,
            height: 15,
            grid: this.generateSampleGrid(),
            start: { x: 1, y: 1 },
            goalArea: { x: 8, y: 13 },
            items: [
                { id: "red_key", pos: { x: 3, y: 5 }, icon: "🔑", collected: false },
                { id: "star_badge", pos: { x: 7, y: 8 }, icon: "⭐", collected: false }
            ],
            switches: [
                { id: "green_switch", pos: { x: 5, y: 10 }, icon: "🔘", state: "OFF" }
            ],
            doors: [
                { id: "left", pos: { x: 6, y: 13 }, condition: { type: "hasItem", value: "red_key" }, icon: "🔑" },
                { id: "middle", pos: { x: 7, y: 13 }, condition: { type: "switchOn", value: "green_switch" }, icon: "🔘" },
                { id: "right", pos: { x: 8, y: 13 }, condition: { type: "hasBadge", value: "star_badge" }, icon: "⭐" }
            ]
        };
    }
    
    generateSampleGrid() {
        const width = 10;
        const height = 15;
        const grid = Array(height).fill().map(() => Array(width).fill(0)); // 0 = 壁
        
        // 簡単な迷路パターンを生成
        // 1 = 道, 2 = スタート, 3 = ゴールエリア
        
        // 基本的な道を作成
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                if ((x % 2 === 1 && y % 2 === 1) || 
                    (x % 2 === 1 && Math.random() > 0.7) ||
                    (y % 2 === 1 && Math.random() > 0.7)) {
                    grid[y][x] = 1;
                }
            }
        }
        
        // スタート地点
        grid[1][1] = 2;
        
        // ゴールエリア
        for (let x = 6; x <= 8; x++) {
            grid[13][x] = 3;
        }
        
        // ゴールエリアへのアクセス路を確保
        for (let y = 11; y <= 13; y++) {
            grid[y][7] = 1;
        }
        
        return grid;
    }
    
    // プレイヤー位置リセット
    resetPlayer() {
        if (this.mazeData) {
            this.playerPosition = { ...this.mazeData.start };
            this.playerTarget = { ...this.mazeData.start };
        }
    }
    
    // サウンド関連
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', JSON.stringify(this.soundEnabled));
        this.updateSoundToggle();
        
        // テストサウンド再生
        if (this.soundEnabled) {
            this.playSE('toggle_on');
        }
    }
    
    updateSoundToggle() {
        if (this.soundToggleBtn) {
            this.soundToggleBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
            this.soundToggleBtn.classList.toggle('sound-on', this.soundEnabled);
            this.soundToggleBtn.classList.toggle('sound-off', !this.soundEnabled);
        }
    }
    
    playSE(soundId) {
        if (!this.soundEnabled) return;
        
        // 簡易的な効果音実装（後で音声ファイル対応）
        console.log(`Playing sound: ${soundId}`);
        
        // Web Audio APIによる簡易音声生成
        this.playBeep(soundId);
    }
    
    playBeep(type) {
        if (!this.soundEnabled || !window.AudioContext) return;
        
        try {
            // ユーザー操作後にのみAudioContextを作成
            if (!window.audioContext) {
                window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const audioContext = window.audioContext;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 音色設定
            let frequency = 440;
            let duration = 0.2;
            
            switch (type) {
                case 'select':
                    frequency = 600;
                    duration = 0.15;
                    break;
                case 'pickup':
                    frequency = 800;
                    duration = 0.2;
                    break;
                case 'switch':
                    frequency = 400;
                    duration = 0.3;
                    break;
                case 'success':
                    frequency = 880;
                    duration = 0.5;
                    break;
                case 'start':
                    frequency = 520;
                    duration = 0.4;
                    break;
                default:
                    frequency = 440;
                    duration = 0.2;
            }
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
            
        } catch (error) {
            console.log('Audio playback failed:', error);
        }
    }
    
    speakText(text) {
        if (!this.soundEnabled || !text || !('speechSynthesis' in window)) return;
        
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            utterance.volume = 0.7;
            
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.log('Speech synthesis failed:', error);
        }
    }
    
    // 移動関連
    moveToward(e) {
        // 実装予定：タッチ位置に向かって移動
        console.log('Moving toward:', this.lastTouchPos);
        this.lastProgressTime = Date.now();
    }
    
    stopMoving() {
        this.isMoving = false;
    }
    
    // UI更新
    updateInventoryUI() {
        if (!this.inventory_ui) return;
        
        this.inventory_ui.innerHTML = '';
        
        // アイテム表示
        this.inventory.items.forEach(itemId => {
            const item = this.findItemById(itemId);
            if (item) {
                const itemEl = document.createElement('div');
                itemEl.className = 'inventory-item collected';
                itemEl.innerHTML = `${item.icon} ${item.id}`;
                this.inventory_ui.appendChild(itemEl);
            }
        });
        
        // スイッチ状態表示
        this.inventory.switches.forEach((state, switchId) => {
            const switchItem = this.findSwitchById(switchId);
            if (switchItem) {
                const switchEl = document.createElement('div');
                switchEl.className = `inventory-item ${state === 'ON' ? 'collected' : ''}`;
                switchEl.innerHTML = `${switchItem.icon} ${state}`;
                this.inventory_ui.appendChild(switchEl);
            }
        });
    }
    
    findItemById(id) {
        return this.mazeData?.items?.find(item => item.id === id);
    }
    
    findSwitchById(id) {
        return this.mazeData?.switches?.find(sw => sw.id === id);
    }
    
    // 迷路描画
    drawMaze() {
        if (!this.ctx || !this.mazeData) return;
        
        // 背景をクリア
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // 簡易的な迷路描画
        this.drawGrid();
        this.drawItems();
        this.drawPlayer();
    }
    
    drawGrid() {
        const grid = this.mazeData.grid;
        const tileSize = this.tileSize;
        
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const tileType = grid[y][x];
                const drawX = x * tileSize;
                const drawY = y * tileSize;
                
                switch (tileType) {
                    case 0: // 壁
                        this.ctx.fillStyle = '#8d6e63';
                        this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
                        break;
                    case 1: // 道
                        this.ctx.fillStyle = '#f5f5dc';
                        this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
                        break;
                    case 2: // スタート
                        this.ctx.fillStyle = '#c8e6c9';
                        this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
                        break;
                    case 3: // ゴール
                        this.ctx.fillStyle = '#ffccbc';
                        this.ctx.fillRect(drawX, drawY, tileSize, tileSize);
                        break;
                }
                
                // グリッド線
                this.ctx.strokeStyle = '#e0e0e0';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(drawX, drawY, tileSize, tileSize);
            }
        }
    }
    
    drawItems() {
        const tileSize = this.tileSize;
        
        // アイテム描画
        if (this.mazeData.items) {
            this.mazeData.items.forEach(item => {
                if (!item.collected) {
                    this.ctx.font = '20px serif';
                    this.ctx.fillText(
                        item.icon,
                        item.pos.x * tileSize + tileSize/2,
                        item.pos.y * tileSize + tileSize/2
                    );
                }
            });
        }
        
        // スイッチ描画
        if (this.mazeData.switches) {
            this.mazeData.switches.forEach(sw => {
                this.ctx.font = '20px serif';
                const icon = sw.state === 'ON' ? '🟢' : sw.icon;
                this.ctx.fillText(
                    icon,
                    sw.pos.x * tileSize + tileSize/2,
                    sw.pos.y * tileSize + tileSize/2
                );
            });
        }
        
        // ドア描画
        if (this.mazeData.doors) {
            this.mazeData.doors.forEach(door => {
                this.ctx.font = '24px serif';
                this.ctx.fillText(
                    '🚪',
                    door.pos.x * tileSize + tileSize/2,
                    door.pos.y * tileSize + tileSize/2
                );
                
                // 条件アイコンを上に表示
                this.ctx.font = '16px serif';
                this.ctx.fillText(
                    door.icon,
                    door.pos.x * tileSize + tileSize/2,
                    door.pos.y * tileSize + tileSize/4
                );
            });
        }
    }
    
    drawPlayer() {
        if (!this.selectedVehicle) return;
        
        const vehicle = this.vehicles[this.selectedVehicle];
        const tileSize = this.tileSize;
        
        this.ctx.font = '24px serif';
        this.ctx.fillText(
            vehicle.icon,
            this.playerPosition.x * tileSize + tileSize/2,
            this.playerPosition.y * tileSize + tileSize/2
        );
    }
    
    // ヒント機能
    startHintTimer() {
        this.clearHintTimer();
        this.hintTimeout = setTimeout(() => {
            this.showAutoHint();
        }, 30000); // 30秒後
    }
    
    clearHintTimer() {
        if (this.hintTimeout) {
            clearTimeout(this.hintTimeout);
            this.hintTimeout = null;
        }
    }
    
    showHint() {
        // 手動ヒント表示
        this.showAutoHint();
    }
    
    showAutoHint() {
        if (this.hintArrow) {
            this.hintArrow.classList.remove('hidden');
            // 3秒後に非表示
            setTimeout(() => {
                this.hintArrow.classList.add('hidden');
            }, 3000);
        }
        
        // メッセージでもヒント
        if (this.gameMessage) {
            this.gameMessage.textContent = 'まずは あかい かぎを さがしてね！';
        }
    }
    
    // 成功処理
    setupSuccessScreen() {
        if (this.successVehicle && this.selectedVehicle) {
            this.successVehicle.textContent = this.vehicles[this.selectedVehicle].icon;
        }
        
        if (this.successMessage && this.currentTask) {
            const doorNames = {
                left: 'ひだり',
                middle: 'まんなか',
                right: 'みぎ'
            };
            this.successMessage.textContent = `${doorNames[this.currentTask.targetDoor]}のドアが ひらいたよ！`;
        }
        
        this.playSE('success');
    }
    
    // 次のゲーム
    nextGame() {
        // 新しいお題を設定
        this.setupTask();
        this.showScreen('task');
    }
    
    // ホームに戻る
    goHome() {
        this.selectedVehicle = null;
        this.currentTask = null;
        this.clearHintTimer();
        this.showScreen('start');
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    try {
        const game = new ThreeDoorsLogicMaze();
        console.log('Game initialized successfully');
        
        // グローバルにアクセス可能にする（デバッグ用）
        window.game = game;
    } catch (error) {
        console.error('Game initialization failed:', error);
    }
});
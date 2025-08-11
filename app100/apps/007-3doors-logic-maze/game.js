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
        this.playerTarget = null;
        this.playerRenderPos = { x: 0, y: 0 }; // 実際の描画位置（補間用）
        this.isMoving = false;
        this.moveSpeed = 4.0; // タイル/秒
        this.gameLoopRunning = false;
        this.animationId = null;
        
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
        
        // 論理思考学習お題（段階的難易度）
        this.sampleTasks = [
            { 
                targetDoor: 'left', 
                text: 'あかいカギを さがして ひだりのドアを あけよう！',
                hint: 'あかい🔑が ひつようだよ',
                learning: '条件を満たしてから行動する'
            },
            { 
                targetDoor: 'middle', 
                text: 'みどりスイッチを ONにして まんなかのドアを あけよう！',
                hint: 'みどり🔘を ONに してね',
                learning: '状態を変更してから行動する'
            },
            { 
                targetDoor: 'right', 
                text: 'ほしバッジを あつめて みぎのドアを あけよう！',
                hint: 'きらきら⭐が ひつようだよ',
                learning: '複数の条件を組み合わせる'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.setupCanvas();
        this.setupEventListeners();
        this.updateSoundToggle();
        this.showScreen('start');
        
        // 初期化時は迷路データを生成しない（ゲーム開始時に生成）
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
            
            // 少し待ってから直接ゲーム開始
            setTimeout(() => {
                console.log('Setting up task...');
                this.setupTask();
                console.log('Current task:', this.currentTask);
                console.log('Starting game...');
                this.startGame();
            }, 800);
        }
    }
    
    // お題設定
    setupTask() {
        if (!this.selectedVehicle) return;
        
        // 段階的学習：簡単な順番で提示（ランダムではなく順序立てて）
        if (!this.completedTasks) {
            this.completedTasks = new Set();
        }
        
        // 未完了のお題から最も簡単なものを選択
        const availableTasks = this.sampleTasks.filter((_, index) => !this.completedTasks.has(index));
        this.currentTask = availableTasks[0] || this.sampleTasks[0]; // 全部完了したら最初に戻る
        
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
        
        // インベントリをクリア
        this.inventory.items.clear();
        this.inventory.switches.clear();
        this.inventory.badges.clear();
        
        // 現在のお題に応じた迷路を生成
        this.loadSampleMaze();
        
        // プレイヤー位置をリセット（迷路生成後）
        this.resetPlayer();
        
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
        
        // ゲームループ開始
        this.startGameLoop();
    }
    
    // サンプル迷路データ読み込み（後で外部ファイル化）
    loadSampleMaze() {
        // 現在のお題に応じて必要なアイテムとドアだけを生成
        const task = this.currentTask;
        let items = [];
        let switches = [];
        let doors = [];
        
        if (task && task.targetDoor === 'left') {
            // レベル1: あかいカギのみ
            items = [{ id: "key-red", pos: { x: 3, y: 5 }, icon: "🔑", name: "あかいカギ", collected: false }];
            doors = [{ id: "left", pos: { x: 7, y: 13 }, condition: { type: "hasItem", value: "key-red" }, icon: "🔑" }];
        } else if (task && task.targetDoor === 'middle') {
            // レベル2: みどりスイッチのみ
            switches = [{ id: "switch-green", pos: { x: 5, y: 10 }, icon: "🔘", name: "みどりスイッチ", state: "OFF" }];
            doors = [{ id: "middle", pos: { x: 7, y: 13 }, condition: { type: "switchOn", value: "switch-green" }, icon: "🔘" }];
        } else if (task && task.targetDoor === 'right') {
            // レベル3: ほしバッジのみ
            items = [{ id: "badge-star", pos: { x: 7, y: 8 }, icon: "⭐", name: "ほしバッジ", collected: false }];
            doors = [{ id: "right", pos: { x: 7, y: 13 }, condition: { type: "hasBadge", value: "badge-star" }, icon: "⭐" }];
        } else {
            // デフォルト（最初のお題）
            items = [{ id: "key-red", pos: { x: 3, y: 5 }, icon: "🔑", name: "あかいカギ", collected: false }];
            doors = [{ id: "left", pos: { x: 7, y: 13 }, condition: { type: "hasItem", value: "key-red" }, icon: "🔑" }];
        }
        
        this.mazeData = {
            id: "sample_maze",
            tileSize: 32,
            width: 10,
            height: 15,
            grid: this.generateSampleGrid(),
            start: { x: 1, y: 1 },
            goalArea: { x: 7, y: 13 },
            items: items,
            switches: switches,
            doors: doors
        };
    }
    
    generateSampleGrid() {
        const width = 10;
        const height = 15;
        const grid = Array(height).fill().map(() => Array(width).fill(0)); // 0 = 壁
        
        // 固定迷路パターン（論理思考学習に適した設計）
        // 1 = 道, 2 = スタート, 3 = ゴールエリア
        
        // より広い通路を設計（4-6歳児が移動しやすい）
        const paths = [
            // メイン縦路（2マス幅）
            [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7], [1,8], [1,9], [1,10], [1,11], [1,12],
            [2,1], [2,2], [2,3], [2,4], [2,5], [2,6], [2,7], [2,8], [2,9], [2,10], [2,11], [2,12],
            
            // 赤いカギエリア（広いスペース）
            [3,4], [3,5], [3,6], [4,4], [4,5], [4,6],
            
            // スイッチエリアへの路（2マス幅）
            [3,9], [3,10], [3,11], [4,9], [4,10], [4,11], [5,9], [5,10], [5,11],
            
            // 星バッジエリア（広いスペース）
            [6,7], [6,8], [6,9], [7,7], [7,8], [7,9], [8,7], [8,8], [8,9],
            
            // ゴールエリアへの路（3マス幅）
            [5,12], [5,13], [6,12], [6,13], [7,12], [7,13], [8,12], [8,13],
            
            // 接続路
            [4,7], [4,8], [5,7], [5,8]
        ];
        
        // 経路を道として設定
        paths.forEach(([x, y]) => {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                grid[y][x] = 1;
            }
        });
        
        // スタート地点
        grid[1][1] = 2;
        
        // ゴールエリア
        grid[13][6] = 3;
        grid[13][7] = 3;
        grid[13][8] = 3;
        
        return grid;
    }
    
    // プレイヤー位置リセット
    resetPlayer() {
        if (this.mazeData) {
            this.playerPosition = { ...this.mazeData.start };
            this.playerTarget = null;
            this.isMoving = false;
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
        if (!this.mazeData || this.isMoving) return;

        // タッチ位置をタイル座標に変換
        const tileSize = this.mazeData.tileSize;
        const targetX = Math.floor(this.lastTouchPos.x / tileSize);
        const targetY = Math.floor(this.lastTouchPos.y / tileSize);

        // 境界チェック
        if (targetX < 0 || targetX >= this.mazeData.width || 
            targetY < 0 || targetY >= this.mazeData.height) {
            return;
        }

        // 壁チェック（0は壁、1以上は通行可能）
        const tileType = this.mazeData.grid[targetY][targetX];
        if (tileType === 0) {
            console.log('Cannot move to wall at', targetX, targetY);
            return;
        }
        
        // 斜め移動時の経路チェック（壁を通り抜け防止）
        const currentX = Math.floor(this.playerPosition.x);
        const currentY = Math.floor(this.playerPosition.y);
        
        if (this.hasWallBetween(currentX, currentY, targetX, targetY)) {
            console.log('Path blocked by wall from', currentX, currentY, 'to', targetX, targetY);
            return;
        }
        
        console.log(`Moving to tile (${targetX},${targetY}) - type: ${tileType}`);

        // 目標位置設定
        this.playerTarget = { x: targetX, y: targetY };
        this.isMoving = true;
        this.lastProgressTime = Date.now();
        
        console.log('Moving from', this.playerPosition, 'toward', this.playerTarget);
    }
    
    stopMoving() {
        this.isMoving = false;
    }
    
    // 斜め移動時の壁通り抜けチェック
    hasWallBetween(x1, y1, x2, y2) {
        // 同じタイルまたは隣接タイルの場合はチェック不要
        if (Math.abs(x2 - x1) <= 1 && Math.abs(y2 - y1) <= 1) {
            return false;
        }
        
        // Bresenhamのライン描画アルゴリズムで経路上の全タイルをチェック
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
    
    // ゲームループ - プレイヤー移動アニメーション
    gameLoop() {
        if (this.gameLoopRunning) {
            if (this.isMoving && this.playerTarget) {
                this.updatePlayerMovement();
            }
            
            // アニメーションフレーム継続
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    updatePlayerMovement() {
        if (!this.playerTarget) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastProgressTime;
        const moveSpeed = this.moveSpeed; // タイル/秒 (コンストラクタで4.0に設定)
        
        // 目標との距離計算（タイル単位）
        const dx = this.playerTarget.x - this.playerPosition.x;
        const dy = this.playerTarget.y - this.playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.05) {
            // 目標到達
            this.playerPosition.x = this.playerTarget.x;
            this.playerPosition.y = this.playerTarget.y;
            this.isMoving = false;
            this.playerTarget = null;
            
            // アイテム・スイッチの衝突判定
            this.checkCollisions();
            
        } else {
            // 移動継続（タイル単位で計算）
            const progress = Math.min((moveSpeed * deltaTime / 1000) / distance, 1.0);
            this.playerPosition.x += dx * progress;
            this.playerPosition.y += dy * progress;
        }
        
        this.lastProgressTime = currentTime;
        
        // 迷路再描画
        this.drawMaze();
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
                itemEl.innerHTML = `${item.icon} ${item.name || item.id}`;
                this.inventory_ui.appendChild(itemEl);
            }
        });
        
        // バッジ表示
        this.inventory.badges.forEach(badgeId => {
            const badge = this.findItemById(badgeId);
            if (badge) {
                const badgeEl = document.createElement('div');
                badgeEl.className = 'inventory-item collected';
                badgeEl.innerHTML = `${badge.icon} ${badge.name || badge.id}`;
                this.inventory_ui.appendChild(badgeEl);
            }
        });
        
        // スイッチ状態表示
        this.inventory.switches.forEach((state, switchId) => {
            const switchItem = this.findSwitchById(switchId);
            if (switchItem) {
                const switchEl = document.createElement('div');
                switchEl.className = `inventory-item ${state === 'ON' ? 'collected' : ''}`;
                switchEl.innerHTML = `${switchItem.icon} ${switchItem.name || switchItem.id}: ${state}`;
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
        
        // 現在のお題に応じた論理的ヒント
        if (this.gameMessage && this.currentTask) {
            this.gameMessage.textContent = this.currentTask.hint || 'がんばって！';
        }
    }
    
    // 成功処理
    setupSuccessScreen() {
        if (this.successVehicle && this.selectedVehicle) {
            this.successVehicle.textContent = this.vehicles[this.selectedVehicle].icon;
        }
        
        if (this.successMessage && this.currentTask) {
            const messages = {
                left: 'あかいカギで ドアがひらいたよ！\nレベル1 クリア！',
                middle: 'みどりスイッチで ドアがひらいたよ！\nレベル2 クリア！',
                right: 'ほしバッジで ドアがひらいたよ！\nレベル3 クリア！'
            };
            this.successMessage.textContent = messages[this.currentTask.targetDoor] || 'おめでとう！';
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
    
    // ゲームループ開始
    startGameLoop() {
        if (!this.gameLoopRunning) {
            this.gameLoopRunning = true;
            this.gameLoop();
        }
    }
    
    // ゲームループ停止
    stopGameLoop() {
        this.gameLoopRunning = false;
    }
    
    // アイテム・スイッチの衝突判定
    checkCollisions() {
        const playerTileX = Math.floor(this.playerPosition.x);
        const playerTileY = Math.floor(this.playerPosition.y);
        
        // アイテム取得判定
        if (this.mazeData.items) {
            this.mazeData.items.forEach(item => {
                if (!item.collected && 
                    item.pos.x === playerTileX && 
                    item.pos.y === playerTileY) {
                    
                    // アイテム取得
                    item.collected = true;
                    
                    // アイテムタイプに応じて適切なインベントリに追加
                    if (item.id.includes('badge')) {
                        this.inventory.badges.add(item.id);
                    } else {
                        this.inventory.items.add(item.id);
                    }
                    
                    this.playSE('pickup');
                    
                    console.log(`Collected item: ${item.id}`);
                    this.updateInventoryUI();
                }
            });
        }
        
        // スイッチ切替判定（同じ位置での連続切替を防ぐ）
        if (this.mazeData.switches) {
            this.mazeData.switches.forEach(sw => {
                if (sw.pos.x === playerTileX && sw.pos.y === playerTileY && !sw.justToggled) {
                    // スイッチ状態切替
                    sw.state = sw.state === 'ON' ? 'OFF' : 'ON';
                    this.inventory.switches.set(sw.id, sw.state);
                    this.playSE('switch');
                    sw.justToggled = true;
                    
                    console.log(`Switch ${sw.id} turned ${sw.state}`);
                    this.updateInventoryUI();
                    
                    // 少し待ってからフラグをリセット
                    setTimeout(() => { sw.justToggled = false; }, 500);
                }
            });
        }
        
        // ドア到達判定
        if (this.mazeData.doors) {
            this.mazeData.doors.forEach(door => {
                if (door.pos.x === playerTileX && door.pos.y === playerTileY) {
                    this.checkDoorConditions(door);
                }
            });
        }
    }
    
    // ドア開閉条件チェック
    checkDoorConditions(door) {
        let canOpen = false;
        let message = '';
        
        switch (door.id) {
            case 'left':
                canOpen = this.inventory.items.has('key-red');
                message = canOpen ? 'あかいカギで ひらきました！' : 'あかいカギが ひつようです';
                break;
            case 'middle':
                canOpen = this.inventory.switches.get('switch-green') === 'ON';
                message = canOpen ? 'みどりスイッチで ひらきました！' : 'みどりスイッチを ONにしてください';
                break;
            case 'right':
                canOpen = this.inventory.badges.has('badge-star');
                message = canOpen ? 'ほしバッジで ひらきました！' : 'ほしバッジが ひつようです';
                break;
        }
        
        if (canOpen && door.id === this.currentTask.targetDoor) {
            // 成功！
            this.playSE('success');
            
            // お題を完了としてマーク
            const taskIndex = this.sampleTasks.findIndex(task => task.targetDoor === this.currentTask.targetDoor);
            if (taskIndex >= 0) {
                this.completedTasks.add(taskIndex);
            }
            
            this.showScreen('success');
        } else if (canOpen) {
            // 間違ったドア
            this.playSE('wrong');
            if (this.gameMessage) {
                this.gameMessage.textContent = 'まちがったドアです！ もういちど かくにんしてね';
            }
        } else {
            // 条件不足
            this.playSE('fail');
            if (this.gameMessage) {
                this.gameMessage.textContent = message;
            }
        }
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
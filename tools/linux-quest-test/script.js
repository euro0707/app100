class LinuxQuest {
    constructor() {
        this.adventurerName = '';
        this.experience = '';
        this.goal = '';
        this.currentDay = 1;
        this.completedDays = new Set();
        
        this.initializeApp();
        this.loadProgress();
        this.updateUI();
    }
    
    initializeApp() {
        // イベントリスナーの設定
        document.getElementById('resetProgress').addEventListener('click', () => this.resetProgress());
        document.getElementById('viewCertificate').addEventListener('click', () => this.showEnding());
        
        // Day nodeクリックイベント
        document.querySelectorAll('.day-node').forEach(node => {
            node.addEventListener('click', (e) => {
                const day = parseInt(node.dataset.day);
                this.goToDay(day);
            });
        });
    }
    
    loadProgress() {
        const saved = localStorage.getItem('linuxQuestProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.adventurerName = data.adventurerName || '';
            this.experience = data.experience || '';
            this.goal = data.goal || '';
            this.currentDay = data.currentDay || 1;
            this.completedDays = new Set(data.completedDays || []);
        }
    }
    
    saveProgress() {
        const data = {
            adventurerName: this.adventurerName,
            experience: this.experience,
            goal: this.goal,
            currentDay: this.currentDay,
            completedDays: Array.from(this.completedDays)
        };
        localStorage.setItem('linuxQuestProgress', JSON.stringify(data));
    }
    
    updateUI() {
        // 冒険者情報の表示
        if (this.adventurerName) {
            document.getElementById('adventurerDisplay').textContent = `冒険者: ${this.adventurerName}`;
        }
        
        // 進捗表示
        const progress = this.completedDays.size;
        document.getElementById('overallProgress').textContent = `進捗: ${progress}/7 完了`;
        
        // Day nodesの状態更新
        this.updateDayNodes();
        
        // 賢者のメッセージ更新
        this.updateSageWisdom();
        
        // 修了証ボタンの表示/非表示
        if (this.completedDays.size === 7) {
            document.getElementById('viewCertificate').style.display = 'inline-block';
            document.getElementById('continueButton').style.display = 'none';
        }
    }
    
    updateDayNodes() {
        for (let day = 1; day <= 7; day++) {
            const node = document.getElementById(`day${day}`);
            const status = document.getElementById(`status${day}`);
            
            // クラスをリセット
            node.className = 'day-node';
            
            if (this.completedDays.has(day)) {
                // 完了済み
                node.classList.add('completed');
                status.textContent = '✅';
            } else if (day === this.currentDay) {
                // 現在のDay
                node.classList.add('current');
                status.textContent = '⭐';
            } else if (day < this.currentDay || day === 1) {
                // 利用可能
                node.classList.add('available');
                status.textContent = '🔓';
            } else {
                // ロック中
                status.textContent = '🔒';
            }
        }
    }
    
    updateSageWisdom() {
        const wisdom = document.getElementById('sageWisdom');
        const progress = this.completedDays.size;
        
        const messages = [
            "「冒険者よ、君の前には7つの試練が待っている。一歩ずつ確実に進めば、必ず稼げる武器を手に入れることができる。」",
            "「素晴らしいスタートだ！最初の一歩を踏み出した君には、もう恐れるものはない。」",
            "「順調な成長だ。基本的な操作を身につけた君は、もうLinuxの世界の住人だ。」",
            "「中盤戦突入だ！ファイルを読む技術は、デジタル考古学者の必須スキル。」",
            "「権限という概念を理解した君は、システムの真の支配者に近づいている。」",
            "「スクリプトという自動化の魔法を覚えた。これこそが現代の錬金術だ！」",
            "「データの流れを制する者が、デジタル時代を制する。君は既にその域に達している。」",
            "「完璧だ！君は今や真のLinuxマスター。この知識で世界を変えることができる。」"
        ];
        
        wisdom.textContent = messages[progress] || messages[0];
    }
    
    goToDay(day) {
        // アクセス可能かチェック
        if (day > this.currentDay && day !== 1 && !this.completedDays.has(day - 1)) {
            this.showMessage('このDayはまだロックされています！前のDayを完了してください。', 'warning');
            return;
        }
        
        // 対応するミニゲームページに移動
        const url = `day${day}-minigame/index.html?return=true`;
        window.location.href = url;
    }
    
    continueToNextDay() {
        let nextDay = this.currentDay;
        
        // 次の未完了Dayを探す
        for (let day = 1; day <= 7; day++) {
            if (!this.completedDays.has(day)) {
                nextDay = day;
                break;
            }
        }
        
        this.goToDay(nextDay);
    }
    
    markDayCompleted(day) {
        this.completedDays.add(day);
        if (day >= this.currentDay) {
            this.currentDay = Math.min(day + 1, 7);
        }
        this.saveProgress();
        this.updateUI();
    }
    
    resetProgress() {
        if (confirm('本当に進捗をリセットしますか？この操作は取り消せません。')) {
            localStorage.removeItem('linuxQuestProgress');
            this.completedDays.clear();
            this.currentDay = 1;
            this.updateUI();
            this.showMessage('進捗をリセットしました。新たな冒険を始めましょう！', 'success');
        }
    }
    
    showMessage(message, type = 'info') {
        // 簡易メッセージ表示
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            background: ${type === 'success' ? '#00ff00' : type === 'warning' ? '#ffa500' : '#00ffff'};
            color: ${type === 'success' || type === 'warning' ? '#000' : '#fff'};
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
    
    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showEnding() {
        this.switchScreen('endingScreen');
        
        // 修了証の情報を設定
        document.getElementById('certificateName').textContent = this.adventurerName || '勇敢な冒険者';
        document.getElementById('certificateDate').textContent = new Date().toLocaleDateString('ja-JP');
    }
}

// グローバル関数（HTMLから呼び出し用）
let questApp;

function startAdventure() {
    const name = document.getElementById('adventurerName').value.trim();
    const experience = document.getElementById('experience').value;
    const goal = document.getElementById('goal').value;
    
    if (!name) {
        alert('冒険者名を入力してください！');
        return;
    }
    
    // 冒険者情報を保存
    questApp.adventurerName = name;
    questApp.experience = experience;
    questApp.goal = goal;
    questApp.saveProgress();
    
    // メインハブに移動
    questApp.switchScreen('mainHub');
    questApp.updateUI();
    
    // ウェルカムメッセージ
    setTimeout(() => {
        questApp.showMessage(`ようこそ、${name}さん！Linux Questの世界へ！`, 'success');
    }, 500);
}

function continueToNextDay() {
    questApp.continueToNextDay();
}

function shareAchievement() {
    const text = `🎉 Linux Quest完全制覇！🎉\n\n7日間でLinuxコマンドライン操作の基礎技能を習得しました！\n\n習得スキル：\n✅ ターミナル操作\n✅ ファイル・ディレクトリ操作\n✅ パーミッション管理\n✅ シェルスクリプト作成\n✅ パイプ・リダイレクト\n✅ システム管理\n\n#LinuxQuest #プログラミング学習 #スキルアップ`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Linux Quest 完全制覇！',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            questApp.showMessage('成果をクリップボードにコピーしました！', 'success');
        });
    }
}

function downloadCertificate() {
    // 修了証のHTML要素を取得
    const certificate = document.querySelector('.certificate');
    
    // Canvas要素を作成してHTMLを画像化（簡易版）
    questApp.showMessage('修了証のダウンロード準備中...（実装予定）', 'info');
    
    // 実際の実装では html2canvas などのライブラリを使用
    // html2canvas(certificate).then(canvas => {
    //     const link = document.createElement('a');
    //     link.download = 'linux-quest-certificate.png';
    //     link.href = canvas.toDataURL();
    //     link.click();
    // });
}

function restartQuest() {
    if (confirm('新しい冒険を始めますか？現在の進捗は保持されます。')) {
        questApp.switchScreen('openingScreen');
    }
}

// 外部からの完了通知を受け取る関数
function markDayCompleted(day) {
    if (questApp) {
        questApp.markDayCompleted(day);
    }
}

// URLパラメータをチェックして戻り先を判定
function checkReturnFromMinigame() {
    const urlParams = new URLSearchParams(window.location.search);
    const dayCompleted = urlParams.get('completed');
    
    if (dayCompleted) {
        const day = parseInt(dayCompleted);
        questApp.markDayCompleted(day);
        questApp.showMessage(`Day${day} クリア！おめでとうございます！`, 'success');
        
        // URLをクリーンアップ
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    questApp = new LinuxQuest();
    
    // 進捗状況に応じて画面を決定
    if (questApp.adventurerName) {
        questApp.switchScreen('mainHub');
    } else {
        questApp.switchScreen('openingScreen');
    }
    
    // ミニゲームからの戻りをチェック
    checkReturnFromMinigame();
    
    // CSS アニメーション追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// 各ミニゲームから呼び出される関数（グローバルスコープに配置）
window.LinuxQuest = {
    markDayCompleted: markDayCompleted,
    returnToHub: () => {
        window.location.href = '../index.html';
    }
};
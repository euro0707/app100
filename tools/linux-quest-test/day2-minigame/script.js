class LinuxQuestDay2 {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.currentPrompt = document.getElementById('currentPrompt');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        
        // 仮想ファイルシステム
        this.fileSystem = {
            '/home/quest': {
                'sample.txt': { 
                    type: 'file', 
                    content: 'これはサンプルファイルです。',
                    permissions: '-rw-r--r--',
                    size: '23',
                    date: 'Jul 28 10:30'
                },
                'readme.md': { 
                    type: 'file', 
                    content: 'Linux Quest Day2 へようこそ！',
                    permissions: '-rw-r--r--',
                    size: '35',
                    date: 'Jul 28 09:15'
                }
            }
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });
        
        this.commandInput.focus();
        this.checkSlidesCompletion();
        this.updateFilesystemView();
        this.showWelcomeMessage();
    }
    
    checkSlidesCompletion() {
        const slidesCompleted = localStorage.getItem('day2-slides-completed');
        if (slidesCompleted === 'true') {
            this.addTerminalLine('', '✅ 事前学習完了済み！実践練習を開始しましょう！', 'success-text');
        } else {
            this.addTerminalLine('', '💡 ヒント: 事前にスライドで学習すると理解が深まります', 'hint-text');
            const slideLink = document.createElement('a');
            slideLink.href = 'slides.html';
            slideLink.textContent = '📚 事前学習スライドを見る';
            slideLink.style.cssText = 'color: #00ffff; text-decoration: underline; margin-left: 10px;';
            slideLink.target = '_blank';
            
            const terminalElement = document.getElementById('terminal');
            const lastLine = terminalElement.lastElementChild;
            if (lastLine) {
                lastLine.appendChild(slideLink);
            }
        }
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addTerminalLine('', 'ディレクトリ操作とファイル作成の冒険を始めましょう！');
            this.addTerminalLine('', 'まずは「ls -l」でファイルの詳細情報を見てみましょう。');
        }, 1000);
    }
    
    executeCommand() {
        const command = this.commandInput.value.trim();
        if (!command) return;
        
        // コマンドをターミナルに表示
        this.addTerminalLine(this.getPromptText(), command, 'user-input');
        
        // コマンド履歴に追加
        this.commandHistory.push(command);
        
        // コマンドを解析して実行
        this.processCommand(command);
        
        // 入力フィールドをクリア
        this.commandInput.value = '';
        
        // ターミナルを下にスクロール
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    getPromptText() {
        const pathShort = this.currentPath === '/home/quest' ? '~' : this.currentPath.replace('/home/quest', '~');
        return `quest@linux:${pathShort}$`;
    }
    
    updatePrompt() {
        this.currentPrompt.textContent = this.getPromptText();
    }
    
    processCommand(command) {
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        switch (cmd) {
            case 'ls':
                this.handleLs(args.slice(1));
                break;
            case 'mkdir':
                this.handleMkdir(args.slice(1));
                break;
            case 'cd':
                this.handleCd(args.slice(1));
                break;
            case 'pwd':
                this.handlePwd();
                break;
            case 'touch':
                this.handleTouch(args.slice(1));
                break;
            case 'cat':
                this.handleCat(args.slice(1));
                break;
            case 'echo':
                this.handleEcho(args.slice(1), command);
                break;
            case 'clear':
                this.handleClear();
                break;
            case 'help':
                this.handleHelp();
                break;
            case 'history':
                this.handleHistory();
                break;
            case 'debug':
                this.handleDebug();
                break;
            case 'skip':
                this.handleSkip();
                break;
            default:
                this.handleUnknownCommand(cmd);
        }
    }
    
    handleLs(options) {
        const isLongFormat = options.includes('-l');
        const currentDir = this.fileSystem[this.currentPath];
        
        if (!currentDir) {
            this.addTerminalLine('', 'ディレクトリが見つかりません', 'error-text');
            return;
        }
        
        if (isLongFormat) {
            this.addTerminalLine('', 'total ' + Object.keys(currentDir).length, 'output-text');
            Object.keys(currentDir).forEach(fileName => {
                const fileInfo = currentDir[fileName];
                const displayName = fileInfo.type === 'directory' ? fileName + '/' : fileName;
                const permissions = fileInfo.permissions || (fileInfo.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--');
                const size = fileInfo.size || '4096';
                const date = fileInfo.date || 'Jul 28 10:30';
                
                const listing = `${permissions} 1 quest quest ${size.padStart(8)} ${date} ${displayName}`;
                this.addTerminalLine('', listing, 'file-listing');
            });
            
            if (isLongFormat) {
                this.completeTask('task-ls-l');
                this.updateSageMessage('素晴らしい！ls -l で詳細な情報を確認できた。次は mkdir で新しいディレクトリを作ってみよう。');
                this.updateHint('「mkdir my_linux_adventure」と入力して新しい冒険拠点を作成しましょう。');
            }
        } else {
            Object.keys(currentDir).forEach(fileName => {
                const fileInfo = currentDir[fileName];
                const displayName = fileInfo.type === 'directory' ? fileName + '/' : fileName;
                const color = fileInfo.type === 'directory' ? 'color: #00ffff;' : 'color: #ffffff;';
                this.addTerminalLine('', displayName, 'output-text', color);
            });
        }
    }
    
    handleMkdir(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'mkdir: オペランドがありません', 'error-text');
            return;
        }
        
        const dirName = args[0];
        if (!this.fileSystem[this.currentPath]) {
            this.fileSystem[this.currentPath] = {};
        }
        
        if (this.fileSystem[this.currentPath][dirName]) {
            this.addTerminalLine('', `mkdir: ディレクトリ '${dirName}' を作成できません: ファイルが存在します`, 'error-text');
            return;
        }
        
        // 新しいディレクトリを作成
        this.fileSystem[this.currentPath][dirName] = {
            type: 'directory',
            permissions: 'drwxr-xr-x',
            size: '4096',
            date: new Date().toLocaleString('ja-JP', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        };
        
        // 新しいパスも初期化
        const newPath = this.currentPath + '/' + dirName;
        this.fileSystem[newPath] = {};
        
        this.addTerminalLine('', `ディレクトリ '${dirName}' を作成しました`, 'output-text');
        this.updateFilesystemView();
        
        if (dirName === 'my_linux_adventure') {
            this.completeTask('task-mkdir');
            this.updateSageMessage('完璧だ！新しい冒険拠点を作成できた。今度は cd コマンドでその場所に移動してみよう。');
            this.updateHint('「cd my_linux_adventure」と入力して作成したディレクトリに移動しましょう。');
        }
    }
    
    handleCd(args) {
        if (args.length === 0) {
            // cd だけの場合はホームディレクトリに移動
            this.currentPath = '/home/quest';
        } else {
            const target = args[0];
            
            if (target === '..') {
                // 親ディレクトリに移動
                if (this.currentPath !== '/home/quest') {
                    this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
                    if (this.currentPath === '/home') {
                        this.currentPath = '/home/quest';
                    }
                    this.completeTask('task-cd-parent');
                    this.updateSageMessage('見事！親ディレクトリに戻ることができた。cd .. は重要な移動コマンドだ。');
                    this.updateHint('全てのタスクが完了しました！お疲れ様でした。');
                }
            } else {
                // 指定されたディレクトリに移動
                const targetPath = this.currentPath + '/' + target;
                
                if (this.fileSystem[targetPath] !== undefined) {
                    this.currentPath = targetPath;
                    this.addTerminalLine('', `ディレクトリ '${target}' に移動しました`, 'output-text');
                    
                    if (target === 'my_linux_adventure') {
                        this.completeTask('task-cd');
                        this.updateSageMessage('素晴らしい移動だ！新しい場所に到着した。今度は touch コマンドで記録書を作ってみよう。');
                        this.updateHint('「touch adventure_log.txt」と入力して冒険記録ファイルを作成しましょう。');
                    }
                } else if (this.fileSystem[this.currentPath] && this.fileSystem[this.currentPath][target]) {
                    this.addTerminalLine('', `cd: ${target}: ディレクトリではありません`, 'error-text');
                } else {
                    this.addTerminalLine('', `cd: ${target}: そのようなファイルやディレクトリはありません`, 'error-text');
                }
            }
        }
        
        this.updatePrompt();
        this.updateFilesystemView();
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
    }
    
    handleTouch(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'touch: オペランドがありません', 'error-text');
            return;
        }
        
        const fileName = args[0];
        if (!this.fileSystem[this.currentPath]) {
            this.fileSystem[this.currentPath] = {};
        }
        
        if (!this.fileSystem[this.currentPath][fileName]) {
            this.fileSystem[this.currentPath][fileName] = {
                type: 'file',
                content: '',
                permissions: '-rw-r--r--',
                size: '0',
                date: new Date().toLocaleString('ja-JP', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
            };
            
            this.addTerminalLine('', `ファイル '${fileName}' を作成しました`, 'output-text');
            this.updateFilesystemView();
            
            if (fileName === 'adventure_log.txt') {
                this.completeTask('task-touch');
                this.updateSageMessage('良いぞ！記録書の準備ができた。次は echo コマンドで内容を書き込んでみよう。');
                this.updateHint('「echo "Day2: 初めてのディレクトリ操作に成功！" > adventure_log.txt」と入力してファイルに書き込みましょう。');
            }
        } else {
            // ファイルが既に存在する場合はタイムスタンプを更新
            this.fileSystem[this.currentPath][fileName].date = new Date().toLocaleString('ja-JP', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            this.addTerminalLine('', `ファイル '${fileName}' のタイムスタンプを更新しました`, 'output-text');
        }
    }
    
    handleEcho(args, fullCommand) {
        if (args.length === 0) {
            this.addTerminalLine('', '', 'output-text');
            return;
        }
        
        // リダイレクトの処理
        const commandStr = fullCommand.substring(5); // "echo " を除去
        
        if (commandStr.includes(' > ')) {
            const parts = commandStr.split(' > ');
            const text = parts[0].replace(/^["']|["']$/g, ''); // クォート除去
            const fileName = parts[1].trim();
            
            if (!this.fileSystem[this.currentPath]) {
                this.fileSystem[this.currentPath] = {};
            }
            
            // ファイルに書き込み（上書き）
            this.fileSystem[this.currentPath][fileName] = {
                type: 'file',
                content: text,
                permissions: '-rw-r--r--',
                size: text.length.toString(),
                date: new Date().toLocaleString('ja-JP', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
            };
            
            this.updateFilesystemView();
            
            if (fileName === 'adventure_log.txt' && text.includes('Day2')) {
                this.completeTask('task-echo-redirect');
                this.updateSageMessage('見事な書き込みだ！> を使ってファイルに内容を保存できた。次は cat で確認してみよう。');
                this.updateHint('「cat adventure_log.txt」と入力してファイルの内容を確認しましょう。');
            }
            
        } else if (commandStr.includes(' >> ')) {
            const parts = commandStr.split(' >> ');
            const text = parts[0].replace(/^["']|["']$/g, '');
            const fileName = parts[1].trim();
            
            if (!this.fileSystem[this.currentPath]) {
                this.fileSystem[this.currentPath] = {};
            }
            
            // ファイルに追記
            if (this.fileSystem[this.currentPath][fileName]) {
                const oldContent = this.fileSystem[this.currentPath][fileName].content;
                const newContent = oldContent + '\n' + text;
                this.fileSystem[this.currentPath][fileName].content = newContent;
                this.fileSystem[this.currentPath][fileName].size = newContent.length.toString();
            } else {
                this.fileSystem[this.currentPath][fileName] = {
                    type: 'file',
                    content: text,
                    permissions: '-rw-r--r--',
                    size: text.length.toString(),
                    date: new Date().toLocaleString('ja-JP', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                };
            }
            
            this.updateFilesystemView();
            this.completeTask('task-append');
            this.updateSageMessage('完璧だ！>> を使って追記ができた。最後に cd .. で元の場所に戻ってみよう。');
            this.updateHint('「cd ..」と入力して親ディレクトリに戻りましょう。');
            
        } else {
            // 通常のecho（画面出力）
            const text = args.join(' ').replace(/^["']|["']$/g, '');
            this.addTerminalLine('', text, 'output-text');
        }
    }
    
    handleCat(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'cat: オペランドがありません', 'error-text');
            return;
        }
        
        const fileName = args[0];
        const currentDir = this.fileSystem[this.currentPath];
        
        if (!currentDir || !currentDir[fileName]) {
            this.addTerminalLine('', `cat: ${fileName}: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (currentDir[fileName].type === 'directory') {
            this.addTerminalLine('', `cat: ${fileName}: ディレクトリです`, 'error-text');
            return;
        }
        
        const content = currentDir[fileName].content;
        if (content) {
            content.split('\n').forEach(line => {
                this.addTerminalLine('', line, 'output-text');
            });
        }
        
        if (fileName === 'adventure_log.txt') {
            this.completeTask('task-cat');
            this.updateSageMessage('素晴らしい！cat でファイルの内容を確認できた。これで基本的なファイル操作は完璧だ。');
            this.updateHint('次は「echo "これから毎日記録を残していこう。" >> adventure_log.txt」で追記してみましょう。');
        }
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
        this.addTerminalLine(this.getPromptText(), 'ターミナルをクリアしました');
    }
    
    handleHelp() {
        this.addTerminalLine('', 'Day2で使用可能なコマンド:', 'output-text');
        this.addTerminalLine('', '  ls [-l] - ファイル一覧を表示', 'output-text');
        this.addTerminalLine('', '  mkdir <dir> - ディレクトリを作成', 'output-text');
        this.addTerminalLine('', '  cd <dir> - ディレクトリを移動', 'output-text');
        this.addTerminalLine('', '  cd .. - 親ディレクトリに移動', 'output-text');
        this.addTerminalLine('', '  pwd - 現在のディレクトリを表示', 'output-text');
        this.addTerminalLine('', '  touch <file> - 空のファイルを作成', 'output-text');
        this.addTerminalLine('', '  cat <file> - ファイルの内容を表示', 'output-text');
        this.addTerminalLine('', '  echo "text" > file - ファイルに書き込み', 'output-text');
        this.addTerminalLine('', '  echo "text" >> file - ファイルに追記', 'output-text');
        this.addTerminalLine('', '  help - このヘルプを表示', 'output-text');
        this.addTerminalLine('', '  clear - ターミナルをクリア', 'output-text');
    }
    
    handleHistory() {
        this.addTerminalLine('', 'コマンド履歴:', 'output-text');
        this.commandHistory.forEach((cmd, index) => {
            this.addTerminalLine('', `${index + 1}: ${cmd}`, 'output-text');
        });
    }
    
    handleUnknownCommand(cmd) {
        this.addTerminalLine('', `${cmd}: コマンドが見つかりません`, 'error-text');
        this.addTerminalLine('', 'ヒント: "help" と入力して使用可能なコマンドを確認してください', 'output-text');
    }
    
    addTerminalLine(prompt, text, className = '', style = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (prompt) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = prompt;
            line.appendChild(promptSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = className;
        textSpan.textContent = text;
        if (style) textSpan.style.cssText = style;
        line.appendChild(textSpan);
        
        this.terminal.appendChild(line);
    }
    
    completeTask(taskId) {
        if (this.completedTasks.has(taskId)) return;
        
        this.completedTasks.add(taskId);
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.classList.add('completed');
            const checkbox = taskElement.querySelector('.checkbox');
            if (checkbox) {
                checkbox.textContent = '☑';
            }
        }
        
        this.showCompletionEffect();
        this.checkAllTasksComplete();
    }
    
    checkAllTasksComplete() {
        const allTasks = ['task-ls-l', 'task-mkdir', 'task-cd', 'task-touch', 'task-echo-redirect', 'task-cat', 'task-append', 'task-cd-parent'];
        const allComplete = allTasks.every(task => this.completedTasks.has(task));
        
        if (allComplete) {
            setTimeout(() => {
                this.showVictoryMessage();
            }, 1000);
        }
    }
    
    showCompletionEffect() {
        const effect = document.createElement('div');
        effect.textContent = '✨';
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 2em;
            pointer-events: none;
            animation: sparkle 1s ease-out forwards;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    }
    
    showVictoryMessage() {
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '🎉🎉🎉 Day2 クエスト完全制覇！ 🎉🎉🎉', 'output-text', 'color: #ffd700; font-weight: bold;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '君は今日、以下のスキルを習得した：', 'output-text');
        this.addTerminalLine('', '• ls -l - ファイルの詳細情報表示', 'output-text');
        this.addTerminalLine('', '• mkdir - ディレクトリ作成', 'output-text');
        this.addTerminalLine('', '• cd - ディレクトリ移動', 'output-text');
        this.addTerminalLine('', '• touch - ファイル作成', 'output-text');
        this.addTerminalLine('', '• echo と > >> - ファイル書き込み・追記', 'output-text');
        this.addTerminalLine('', '• cat - ファイル内容表示', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '明日はDay3でファイル閲覧の奥義を学ぼう！', 'output-text', 'color: #00ffff;');
        
        this.updateSageMessage('見事だ！君は今日、デジタル世界の住人として大きく成長した。明日は書物を読む技術を学ぼう！');
        this.updateHint('🏆 Day2完了！お疲れ様でした！明日はファイル閲覧・編集技術を学びます。');
        
        // メインハブに戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(2);
        }
    }
    
    showReturnButton() {
        const returnButton = document.createElement('button');
        returnButton.textContent = '🏠 メイン画面に戻る';
        returnButton.style.cssText = `
            background: linear-gradient(45deg, #ff6b35, #ffd700);
            border: none;
            padding: 15px 30px;
            font-size: 1.2em;
            font-weight: bold;
            color: #000;
            border-radius: 25px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
            animation: pulse 2s infinite;
        `;
        returnButton.onclick = () => {
            window.location.href = '../index.html?completed=2';
        };
        
        document.body.appendChild(returnButton);
    }
    
    handleDebug() {
        this.addTerminalLine('', '🐛 デバッグ情報:', 'output-text');
        this.addTerminalLine('', `完了タスク: ${Array.from(this.completedTasks).join(', ')}`, 'output-text');
        this.addTerminalLine('', `現在パス: ${this.currentPath}`, 'output-text');
        this.addTerminalLine('', `コマンド履歴: ${this.commandHistory.length}件`, 'output-text');  
        this.addTerminalLine('', `スライド完了: ${localStorage.getItem('day2-slides-completed') || 'false'}`, 'output-text');
        this.addTerminalLine('', `ファイルシステム構造:`, 'output-text');
        Object.keys(this.fileSystem).forEach(path => {
            this.addTerminalLine('', `  ${path}: ${Object.keys(this.fileSystem[path]).length}個のアイテム`, 'output-text');
        });
    }
    
    handleSkip() {
        this.addTerminalLine('', '⚡ テスト用: Day2の全タスクを完了します', 'output-text');
        // Day2の主要タスクを完了
        const tasks = ['task-ls-detail', 'task-mkdir', 'task-cd', 'task-touch', 'task-echo-redirect', 'task-cat'];
        tasks.forEach(task => {
            this.completeTask(task);
        });
        setTimeout(() => {
            this.checkAllTasksComplete();
        }, 500);
    }
    
    updateSageMessage(message) {
        this.sageMessage.textContent = message;
    }
    
    updateHint(hint) {
        this.hintText.textContent = hint;
    }
    
    updateFilesystemView() {
        const tree = document.getElementById('filesystemTree');
        tree.innerHTML = this.generateFilesystemHTML();
    }
    
    generateFilesystemHTML() {
        let html = '';
        
        const renderDirectory = (path, name, indent = 0) => {
            const isCurrentDir = path === this.currentPath;
            const dirClass = isCurrentDir ? 'current-directory' : '';
            
            html += `<div class="directory-item ${dirClass}" data-path="${path}" style="margin-left: ${indent * 20}px">`;
            html += `<span class="folder-icon">📁</span> ${name}`;
            
            if (this.fileSystem[path]) {
                html += `<div class="subdirectory">`;
                Object.keys(this.fileSystem[path]).forEach(itemName => {
                    const item = this.fileSystem[path][itemName];
                    if (item.type === 'directory') {
                        const childPath = path + '/' + itemName;
                        renderDirectory(childPath, itemName, 0);
                    } else {
                        html += `<div class="file-item">📄 ${itemName}</div>`;
                    }
                });
                html += `</div>`;
            }
            
            html += `</div>`;
        };
        
        renderDirectory('/home/quest', '/home/quest');
        return html;
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    // スタイル追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    new LinuxQuestDay2();
});

// 意図的な退出フラグ
let isIntentionalExit = false;

// ページ離脱前の確認（意図しない離脱のみ）
window.addEventListener('beforeunload', (event) => {
    // 意図的な退出の場合は警告しない
    if (isIntentionalExit) {
        return;
    }
    
    // 進行中の場合のみ確認
    const game = document.querySelector('.container');
    if (game && !localStorage.getItem('day2-completed')) {
        event.preventDefault();
        event.returnValue = '本当にページを離れますか？進捗が失われる可能性があります。';
        return event.returnValue;
    }
});

// 固定ナビゲーションボタンの関数
function confirmReturnHome() {
    const confirmed = confirm('メイン画面に戻りますか？\n\n現在の進捗は保存されます。');
    if (confirmed) {
        // 意図的な退出フラグを設定
        isIntentionalExit = true;
        
        // 進捗を保存
        const currentProgress = {
            completedTasks: Array.from(document.querySelector('.container')?.game?.completedTasks || []),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('day2-progress', JSON.stringify(currentProgress));
        
        // メイン画面に戻る
        window.location.href = '../index.html';
    }
}
class Day4LinuxQuest {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        
        // ファイルシステム（権限情報付き）
        this.fileSystem = {
            '/home/quest': {
                'secret.txt': {
                    type: 'file',
                    content: 'これは秘密の情報です。権限によって守られています。',
                    permissions: {
                        owner: 'rw-',
                        group: 'r--',
                        other: 'r--',
                        octal: '644'
                    },
                    owner: 'quest',
                    group: 'quest'
                },
                'my_script.sh': {
                    type: 'file',
                    content: '#!/bin/bash\necho "Hello from my script!"\necho "現在の時刻: $(date)"',
                    permissions: {
                        owner: 'rw-',
                        group: 'r--',
                        other: 'r--',
                        octal: '644'
                    },
                    owner: 'quest',
                    group: 'quest'
                },
                'test_dir': {
                    type: 'directory',
                    permissions: {
                        owner: 'rwx',
                        group: 'r-x',
                        other: 'r-x',
                        octal: '755'
                    },
                    owner: 'quest',
                    group: 'quest'
                },
                'notes.txt': {
                    type: 'file',
                    content: 'これは普通のメモファイルです。\n権限の学習中です。',
                    permissions: {
                        owner: 'rw-',
                        group: 'rw-',
                        other: 'r--',
                        octal: '664'
                    },
                    owner: 'quest',
                    group: 'quest'
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
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addTerminalLine('', '今日はファイルの権限システムについて学びます！');
            this.addTerminalLine('', 'まずはls -lで詳細な権限情報を見てみましょう。');
        }, 1000);
    }
    
    checkSlidesCompletion() {
        const slidesCompleted = localStorage.getItem('day4-slides-completed');
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
    
    executeCommand() {
        const command = this.commandInput.value.trim();
        if (!command) return;
        
        this.addTerminalLine('quest@linux:~$', command, 'user-input');
        this.commandHistory.push(command);
        this.processCommand(command);
        this.commandInput.value = '';
        this.scrollTerminalToBottom();
    }
    
    processCommand(command) {
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        switch (cmd) {
            case 'ls':
                this.handleLs(args.slice(1));
                break;
            case 'chmod':
                this.handleChmod(args.slice(1));
                break;
            case 'cat':
                this.handleCat(args.slice(1));
                break;
            case 'touch':
                this.handleTouch(args.slice(1));
                break;
            case 'mkdir':
                this.handleMkdir(args.slice(1));
                break;
            case './my_script.sh':
            case './script.sh':
                this.handleRunScript(command);
                break;
            case 'pwd':
                this.handlePwd();
                break;
            case 'clear':
                this.handleClear();
                break;
            case 'help':
                this.handleHelp();
                break;
            default:
                if (command.startsWith('./')) {
                    this.handleRunScript(command);
                } else {
                    this.handleUnknownCommand(cmd);
                }
        }
    }
    
    handleLs(args) {
        const isLongFormat = args.includes('-l');
        const isDirectory = args.includes('-d');
        
        if (isLongFormat) {
            this.addTerminalLine('', '合計 16', 'output-text');
            
            const files = this.fileSystem[this.currentPath];
            Object.keys(files).forEach(fileName => {
                const file = files[fileName];
                const line = this.formatLsLong(fileName, file);
                this.addTerminalLine('', line, 'output-text');
            });
            
            if (!this.completedTasks.has('task-ls-l')) {
                this.completeTask('task-ls-l');
                this.updateSageMessage('素晴らしい！ls -lで権限情報を読み取れるようになりました。最初の文字はファイル種類、次の9文字が権限です。');
                this.updateHint('今度はchmod 600 secret.txtで権限を変更してみましょう。');
            }
        } else {
            // 通常のls
            const files = this.fileSystem[this.currentPath];
            Object.keys(files).forEach(fileName => {
                const file = files[fileName];
                const displayName = file.type === 'directory' ? fileName + '/' : fileName;
                const color = file.type === 'directory' ? 'color: #00ffff;' : 
                             file.permissions.owner.includes('x') ? 'color: #00ff00;' : 'color: #ffffff;';
                this.addTerminalLine('', displayName, 'output-text', color);
            });
        }
    }
    
    formatLsLong(fileName, file) {
        const fileType = file.type === 'directory' ? 'd' : '-';
        const permissions = fileType + file.permissions.owner + file.permissions.group + file.permissions.other;
        const links = '1';
        const owner = file.owner;
        const group = file.group;
        const size = file.type === 'directory' ? '4096' : (file.content ? file.content.length.toString() : '0');
        const date = 'Jul 28 12:00';
        
        // 権限部分にカラーを付ける
        const coloredPermissions = this.colorizePermissions(permissions);
        
        return `${coloredPermissions} ${links} ${owner} ${group} ${size.padStart(5)} ${date} ${fileName}`;
    }
    
    colorizePermissions(permissions) {
        // HTML形式で色付け
        const fileType = permissions[0];
        const owner = permissions.substring(1, 4);
        const group = permissions.substring(4, 7);
        const other = permissions.substring(7, 10);
        
        return `${fileType}<span class="owner-perm">${owner}</span><span class="group-perm">${group}</span><span class="other-perm">${other}</span>`;
    }
    
    handleChmod(args) {
        if (args.length < 2) {
            this.addTerminalLine('', 'chmod: 使用法: chmod 権限 ファイル名', 'error-text');
            return;
        }
        
        const permission = args[0];
        const fileName = args[1];
        
        const file = this.fileSystem[this.currentPath][fileName];
        if (!file) {
            this.addTerminalLine('', `chmod: '${fileName}' にアクセスできません: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (this.isNumericPermission(permission)) {
            this.handleChmodNumeric(permission, fileName, file);
        } else {
            this.handleChmodSymbolic(permission, fileName, file);
        }
        
        this.addTerminalLine('', `権限を変更しました: ${fileName}`, 'output-text');
    }
    
    isNumericPermission(permission) {
        return /^[0-7]{3}$/.test(permission);
    }
    
    handleChmodNumeric(permission, fileName, file) {
        const octal = permission;
        const binary = octal.split('').map(digit => parseInt(digit, 8).toString(2).padStart(3, '0'));
        
        file.permissions.owner = this.binaryToPermission(binary[0]);
        file.permissions.group = this.binaryToPermission(binary[1]);
        file.permissions.other = this.binaryToPermission(binary[2]);
        file.permissions.octal = octal;
        
        if (!this.completedTasks.has('task-chmod-number')) {
            this.completeTask('task-chmod-number');
            this.updateSageMessage('完璧です！数字表記での権限変更をマスターしました。644=rw-r--r--、755=rwxr-xr-xというパターンを覚えましょう。');
            this.updateHint('今度はchmod u+x my_script.shで文字表記での権限変更を試してみましょう。');
        }
    }
    
    handleChmodSymbolic(permission, fileName, file) {
        // 簡易的なシンボリック権限の実装
        const match = permission.match(/([ugo]+)([+-=])([rwx]+)/);
        if (!match) {
            this.addTerminalLine('', `chmod: 無効な権限: '${permission}'`, 'error-text');
            return;
        }
        
        const [, target, operation, perms] = match;
        
        if (target.includes('u') || target.includes('a')) {
            file.permissions.owner = this.applySymbolicChange(file.permissions.owner, operation, perms);
        }
        if (target.includes('g') || target.includes('a')) {
            file.permissions.group = this.applySymbolicChange(file.permissions.group, operation, perms);
        }
        if (target.includes('o') || target.includes('a')) {
            file.permissions.other = this.applySymbolicChange(file.permissions.other, operation, perms);
        }
        
        // オクタル値を更新
        file.permissions.octal = this.permissionsToOctal(file.permissions);
        
        if (!this.completedTasks.has('task-chmod-letter')) {
            this.completeTask('task-chmod-letter');
            this.updateSageMessage('見事です！文字表記での権限変更も習得しました。u=user、g=group、o=other、a=allを覚えておきましょう。');
            this.updateHint('スクリプトファイルに実行権限を付けたら、./my_script.shで実行してみましょう。');
        }
        
        // スクリプトファイルに実行権限が付いた場合
        if (fileName === 'my_script.sh' && file.permissions.owner.includes('x')) {
            if (!this.completedTasks.has('task-script-execute')) {
                this.completeTask('task-script-execute');
                this.updateSageMessage('素晴らしい！スクリプトファイルに実行権限を付与しました。これで実行可能になります。');
            }
        }
    }
    
    applySymbolicChange(currentPerms, operation, perms) {
        let result = currentPerms.split('');
        
        perms.split('').forEach(perm => {
            let index;
            switch (perm) {
                case 'r': index = 0; break;
                case 'w': index = 1; break;
                case 'x': index = 2; break;
            }
            
            switch (operation) {
                case '+':
                    result[index] = perm;
                    break;
                case '-':
                    result[index] = '-';
                    break;
                case '=':
                    result = ['r', 'w', 'x'].map(p => perms.includes(p) ? p : '-');
                    break;
            }
        });
        
        return result.join('');
    }
    
    binaryToPermission(binary) {
        return [
            binary[0] === '1' ? 'r' : '-',
            binary[1] === '1' ? 'w' : '-',
            binary[2] === '1' ? 'x' : '-'
        ].join('');
    }
    
    permissionsToOctal(permissions) {
        const ownerOctal = this.permissionToOctal(permissions.owner);
        const groupOctal = this.permissionToOctal(permissions.group);
        const otherOctal = this.permissionToOctal(permissions.other);
        return ownerOctal + groupOctal + otherOctal;
    }
    
    permissionToOctal(permission) {
        let value = 0;
        if (permission[0] === 'r') value += 4;
        if (permission[1] === 'w') value += 2;
        if (permission[2] === 'x') value += 1;
        return value.toString();
    }
    
    handleRunScript(command) {
        const scriptName = command.replace('./', '');
        const file = this.fileSystem[this.currentPath][scriptName];
        
        if (!file) {
            this.addTerminalLine('', `bash: ${command}: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (file.type !== 'file') {
            this.addTerminalLine('', `bash: ${command}: ディレクトリです`, 'error-text');
            return;
        }
        
        if (!file.permissions.owner.includes('x')) {
            this.addTerminalLine('', `bash: ${command}: 許可がありません`, 'error-text');
            this.addTerminalLine('', 'ヒント: chmod +x でファイルに実行権限を付与してください', 'hint-text');
            return;
        }
        
        // スクリプト実行のシミュレーション
        this.addTerminalLine('', 'Hello from my script!', 'output-text');
        this.addTerminalLine('', `現在の時刻: ${new Date().toLocaleString('ja-JP')}`, 'output-text');
        
        if (!this.completedTasks.has('task-run-script')) {
            this.completeTask('task-run-script');
            this.updateSageMessage('完璧です！スクリプトの実行に成功しました。./は現在のディレクトリを表します。');
            this.updateHint('最後にls -ld test_dirでディレクトリの権限を確認してみましょう。');
        }
    }
    
    handleCat(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'cat: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') {
            this.addTerminalLine('', `cat: ${fileName}: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (!file.permissions.owner.includes('r')) {
            this.addTerminalLine('', `cat: ${fileName}: 許可がありません`, 'error-text');
            return;
        }
        
        const lines = file.content.split('\n');
        lines.forEach(line => {
            this.addTerminalLine('', line, 'output-text');
        });
    }
    
    handleTouch(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'touch: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        if (!this.fileSystem[this.currentPath][fileName]) {
            this.fileSystem[this.currentPath][fileName] = {
                type: 'file',
                content: '',
                permissions: {
                    owner: 'rw-',
                    group: 'r--',
                    other: 'r--',
                    octal: '644'
                },
                owner: 'quest',
                group: 'quest'
            };
            this.addTerminalLine('', `ファイル '${fileName}' を作成しました`, 'output-text');
        }
    }
    
    handleMkdir(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'mkdir: ディレクトリ名を指定してください', 'error-text');
            return;
        }
        
        const dirName = args[0];
        if (!this.fileSystem[this.currentPath][dirName]) {
            this.fileSystem[this.currentPath][dirName] = {
                type: 'directory',
                permissions: {
                    owner: 'rwx',
                    group: 'r-x',
                    other: 'r-x',
                    octal: '755'
                },
                owner: 'quest',
                group: 'quest'
            };
            this.addTerminalLine('', `ディレクトリ '${dirName}' を作成しました`, 'output-text');
            
            if (!this.completedTasks.has('task-directory-permission')) {
                this.completeTask('task-directory-permission');
                this.updateSageMessage('理解できました！ディレクトリの権限も学習しました。ディレクトリの場合、xは「中に入る」権限を意味します。');
                this.updateHint('🎉 すべてのタスクが完了しました！権限管理をマスターできましたね！');
                this.checkAllTasksComplete();
            }
        } else {
            this.addTerminalLine('', `mkdir: ディレクトリ '${dirName}' を作成できません: ファイルが存在します`, 'error-text');
        }
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
    }
    
    handleHelp() {
        this.addTerminalLine('', '=== Day4 利用可能なコマンド ===', 'output-text');
        this.addTerminalLine('', 'ls -l - 詳細なファイル情報と権限を表示', 'output-text');
        this.addTerminalLine('', 'chmod 644 ファイル名 - 数字で権限変更', 'output-text');
        this.addTerminalLine('', 'chmod u+x ファイル名 - 文字で権限変更', 'output-text');
        this.addTerminalLine('', './スクリプト名 - スクリプトファイルを実行', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 - ファイル内容を表示', 'output-text');
        this.addTerminalLine('', 'touch ファイル名 - 新しいファイルを作成', 'output-text');
        this.addTerminalLine('', 'mkdir ディレクトリ名 - 新しいディレクトリを作成', 'output-text');
        this.addTerminalLine('', 'pwd - 現在のディレクトリを表示', 'output-text');
        this.addTerminalLine('', 'clear - ターミナルをクリア', 'output-text');
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
        
        // HTMLタグが含まれている場合はinnerHTMLを使用
        if (text.includes('<span')) {
            textSpan.innerHTML = text;
        } else {
            textSpan.textContent = text;
        }
        
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
    }
    
    checkAllTasksComplete() {
        const requiredTasks = ['task-ls-l', 'task-chmod-number', 'task-chmod-letter', 'task-script-execute', 'task-run-script', 'task-directory-permission'];
        const allComplete = requiredTasks.every(task => this.completedTasks.has(task));
        
        if (allComplete) {
            setTimeout(() => {
                this.showVictoryMessage();
            }, 1000);
        }
    }
    
    showCompletionEffect() {
        const effect = document.createElement('div');
        effect.textContent = '🛡️';
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
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 1000);
        
        // CSS animation for sparkle effect
        if (!document.getElementById('sparkle-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-style';
            style.textContent = `
                @keyframes sparkle {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showVictoryMessage() {
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '🎉🎉🎉 Day4 クエスト完全制覇！ 🎉🎉🎉', 'output-text', 'color: #ffd700; font-weight: bold;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '今日習得したスキル：', 'output-text');
        this.addTerminalLine('', '• ls -l - 詳細な権限情報の表示', 'output-text');
        this.addTerminalLine('', '• chmod 数字 - 数値表記での権限変更', 'output-text');
        this.addTerminalLine('', '• chmod 文字 - シンボリック表記での権限変更', 'output-text');
        this.addTerminalLine('', '• スクリプトファイルの実行権限管理', 'output-text');
        this.addTerminalLine('', '• ディレクトリ権限の理解', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '明日はDay5でシェルスクリプト作成について学びます！', 'output-text', 'color: #00ffff;');
        
        this.updateSageMessage('見事だ！君は今日、システムセキュリティの根幹である権限システムを完全に理解した。これは実際の業務で毎日使う重要な知識だ！');
        this.updateHint('🏆 Day4完了！お疲れ様でした！明日はシェルスクリプトの作成について学びます。');
        
        // メイン画面に戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(4);
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
            window.location.href = '../index.html?completed=4';
        };
        
        document.body.appendChild(returnButton);
    }
    
    updateSageMessage(message) {
        this.sageMessage.textContent = message;
        this.sageMessage.parentElement.style.animation = 'none';
        setTimeout(() => {
            this.sageMessage.parentElement.style.animation = 'pulse 2s ease-in-out';
        }, 10);
    }
    
    updateHint(hint) {
        this.hintText.textContent = hint;
        this.hintText.parentElement.style.animation = 'none';
        setTimeout(() => {
            this.hintText.parentElement.style.animation = 'pulse 2s infinite';
        }, 10);
    }
    
    scrollTerminalToBottom() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new Day4LinuxQuest();
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
    if (game && !localStorage.getItem('day4-completed')) {
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
        localStorage.setItem('day4-progress', JSON.stringify(currentProgress));
        
        // メイン画面に戻る
        window.location.href = '../index.html';
    }
}
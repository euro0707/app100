class Day3LinuxQuest {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        this.nanoEditor = document.getElementById('nanoEditor');
        this.nanoTextarea = document.getElementById('nanoTextarea');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        this.isInNano = false;
        this.isInLess = false;
        this.lessContent = [];
        this.lessCurrentLine = 0;
        this.lessSearchTerm = '';
        
        // サンプルファイルシステム
        this.fileSystem = {
            '/home/quest': {
                'long_story.txt': {
                    type: 'file',
                    content: `=== Linux Quest 冒険記録 ===
Day1: 初めてのターミナル体験
Day2: ディレクトリとファイル操作をマスター
Day3: ファイル閲覧術を習得中
Day4: 権限システムについて学ぶ予定
Day5: スクリプト作成に挑戦予定
Day6: パイプとリダイレクトの奥秘
Day7: 最終試練と卒業

冒険者の心得：
1. 好奇心を持って学ぶこと
2. 失敗を恐れないこと
3. 基本を大切にすること
4. 常に学び続けること
5. 他の冒険者と助け合うこと

これまでの成長：
- ターミナルの操作が自然になった
- ファイル操作に慣れた
- エラーを恐れなくなった
- ググって解決する力がついた
- 黒い画面が友達になった`
                },
                'adventure_log.txt': {
                    type: 'file',
                    content: `Day3での新発見：
- catでファイル全体を表示できる
- lessでページごとに閲覧できる
- headで最初の部分を確認
- tailで最後の部分を確認
- nanoで編集も可能
- grepで検索ができる`
                },
                'config.txt': {
                    type: 'file',
                    content: `# システム設定ファイル
username=quest_adventurer
theme=dark
language=ja
debug=true
auto_save=enabled
backup_enabled=true`
                }
            }
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.isInNano) {
                    this.handleNanoInput(e.ctrlKey);
                } else if (this.isInLess) {
                    this.handleLessInput();
                } else {
                    this.executeCommand();
                }
            }
        });
        
        this.commandInput.addEventListener('keydown', (e) => {
            if (this.isInLess) {
                this.handleLessNavigation(e);
            }
        });
        
        this.commandInput.focus();
        this.checkSlidesCompletion();
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addTerminalLine('', '今日はファイルの中身を様々な方法で閲覧し、編集する技術を学びます！');
            this.addTerminalLine('', 'まずは長い書物「long_story.txt」をcatコマンドで読んでみましょう。');
        }, 1000);
    }
    
    checkSlidesCompletion() {
        const slidesCompleted = localStorage.getItem('day3-slides-completed');
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
            case 'cat':
                this.handleCat(args.slice(1));
                break;
            case 'less':
                this.handleLess(args.slice(1));
                break;
            case 'head':
                this.handleHead(args.slice(1));
                break;
            case 'tail':
                this.handleTail(args.slice(1));
                break;
            case 'nano':
                this.handleNano(args.slice(1));
                break;
            case 'grep':
                this.handleGrep(args.slice(1));
                break;
            case 'ls':
                this.handleLs();
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
            case 'q':
                if (this.isInLess) {
                    this.exitLess();
                } else {
                    this.handleUnknownCommand(cmd);
                }
                break;
            default:
                this.handleUnknownCommand(cmd);
        }
    }
    
    handleCat(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'cat: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file) {
            this.addTerminalLine('', `cat: ${fileName}: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (file.type !== 'file') {
            this.addTerminalLine('', `cat: ${fileName}: ディレクトリです`, 'error-text');
            return;
        }
        
        // ファイル内容を表示
        const lines = file.content.split('\n');
        
        if (args.includes('-n')) {
            // 行番号付きで表示
            lines.forEach((line, index) => {
                this.addTerminalLine('', `${String(index + 1).padStart(6)} ${line}`, 'output-text');
            });
            
            if (fileName === 'long_story.txt' && !this.completedTasks.has('task-cat-n')) {
                this.completeTask('task-cat-n');
                this.updateSageMessage('素晴らしい！行番号付きで表示できました。これで特定の行を参照しやすくなります。');
                this.updateHint('次はnano adventure_log.txtでファイルを編集してみましょう。');
            }
        } else {
            lines.forEach(line => {
                this.addTerminalLine('', line, 'output-text');
            });
            
            if (fileName === 'long_story.txt' && !this.completedTasks.has('task-cat-full')) {
                this.completeTask('task-cat-full');
                this.updateSageMessage('よくできました！catでファイル全体を表示できました。長いファイルの場合はlessの方が便利です。');
                this.updateHint('次はlessコマンドでページごとに閲覧してみましょう: less long_story.txt');
            }
        }
    }
    
    handleLess(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'less: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') {
            this.addTerminalLine('', `less: ${fileName}: そのようなファイルはありません`, 'error-text');
            return;
        }
        
        this.enterLessMode(file.content, fileName);
    }
    
    enterLessMode(content, fileName) {
        this.isInLess = true;
        this.lessContent = content.split('\n');
        this.lessCurrentLine = 0;
        
        this.addTerminalLine('', `--- ${fileName} を less で表示中 ---`, 'output-text');
        this.addTerminalLine('', 'スペース: 次のページ, b: 前のページ, q: 終了, /文字: 検索', 'hint-text');
        this.displayLessPage();
        
        this.commandInput.placeholder = 'less コマンド (スペース/b/q/検索) を入力';
        
        if (!this.completedTasks.has('task-less')) {
            this.completeTask('task-less');
            this.updateSageMessage('素晴らしい！lessでページごとに閲覧できるようになりました。長いファイルを読むのに最適です。');
            this.updateHint('📋 lessを終了するには「q」を入力してEnterを押してください。終了後にheadコマンドを試しましょう。');
        }
    }
    
    displayLessPage() {
        const pageSize = 10;
        const startLine = this.lessCurrentLine;
        const endLine = Math.min(startLine + pageSize, this.lessContent.length);
        
        for (let i = startLine; i < endLine; i++) {
            let line = this.lessContent[i];
            
            // 検索ハイライト
            if (this.lessSearchTerm) {
                const regex = new RegExp(`(${this.escapeRegex(this.lessSearchTerm)})`, 'gi');
                line = line.replace(regex, '<span class="search-highlight">$1</span>');
            }
            
            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';
            lineElement.innerHTML = `<span class="pager-text">${line}</span>`;
            this.terminal.appendChild(lineElement);
        }
        
        // ページ情報表示
        const progress = Math.round((endLine / this.lessContent.length) * 100);
        this.addTerminalLine('', `--- ${progress}% (${endLine}/${this.lessContent.length}行) ---`, 'hint-text');
    }
    
    handleLessInput() {
        const input = this.commandInput.value.trim();
        this.commandInput.value = '';
        
        if (input === 'q') {
            this.exitLess();
        } else if (input === ' ' || input === '') {
            this.lessNextPage();
        } else if (input === 'b') {
            this.lessPrevPage();
        } else if (input.startsWith('/')) {
            this.lessSearch(input.substring(1));
        } else if (input === 'g') {
            this.lessCurrentLine = 0;
            this.clearTerminal();
            this.displayLessPage();
        } else if (input === 'G') {
            this.lessCurrentLine = Math.max(0, this.lessContent.length - 10);
            this.clearTerminal();
            this.displayLessPage();
        }
    }
    
    handleLessNavigation(e) {
        if (!this.isInLess) return;
        
        if (e.key === ' ') {
            e.preventDefault();
            this.lessNextPage();
        } else if (e.key === 'q') {
            e.preventDefault();
            this.exitLess();
        }
    }
    
    lessNextPage() {
        const pageSize = 10;
        if (this.lessCurrentLine + pageSize < this.lessContent.length) {
            this.lessCurrentLine += pageSize;
            this.clearTerminal();
            this.displayLessPage();
        } else {
            this.addTerminalLine('', '--- ファイルの最後です ---', 'hint-text');
        }
    }
    
    lessPrevPage() {
        const pageSize = 10;
        if (this.lessCurrentLine > 0) {
            this.lessCurrentLine = Math.max(0, this.lessCurrentLine - pageSize);
            this.clearTerminal();
            this.displayLessPage();
        } else {
            this.addTerminalLine('', '--- ファイルの最初です ---', 'hint-text');
        }
    }
    
    lessSearch(term) {
        if (!term) {
            this.lessSearchTerm = '';
            return;
        }
        
        this.lessSearchTerm = term;
        
        // 検索実行
        for (let i = this.lessCurrentLine + 1; i < this.lessContent.length; i++) {
            if (this.lessContent[i].toLowerCase().includes(term.toLowerCase())) {
                this.lessCurrentLine = Math.max(0, i - 2);
                this.clearTerminal();
                this.displayLessPage();
                this.addTerminalLine('', `検索語「${term}」が見つかりました`, 'output-text');
                return;
            }
        }
        
        this.addTerminalLine('', `検索語「${term}」は見つかりませんでした`, 'error-text');
    }
    
    exitLess() {
        this.isInLess = false;
        this.lessContent = [];
        this.lessCurrentLine = 0;
        this.lessSearchTerm = '';
        this.commandInput.placeholder = 'コマンドを入力してください';
        this.commandInput.value = ''; // 入力フィールドをクリア
        this.addTerminalLine('', '--- less を終了しました ---', 'output-text');
        this.addTerminalLine('', '🎯 次のクエスト: head long_story.txt を入力してください', 'hint-text');
        this.updateHint('次はheadコマンドでファイルの最初の部分を表示してみましょう: head long_story.txt');
        this.commandInput.focus(); // フォーカスを確実に戻す
        console.log('Less exited successfully'); // デバッグ用ログ
    }
    
    handleHead(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'head: ファイル名を指定してください', 'error-text');
            return;
        }
        
        let lines = 10; // デフォルト行数
        let fileName = args[0];
        
        // -n オプションのチェック
        if (args[0] === '-n' && args.length >= 3) {
            lines = parseInt(args[1]);
            fileName = args[2];
        } else if (args[0].startsWith('-') && args[0].length > 1) {
            lines = parseInt(args[0].substring(1));
            fileName = args[1];
        }
        
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') {
            this.addTerminalLine('', `head: ${fileName}: そのようなファイルはありません`, 'error-text');
            return;
        }
        
        const fileLines = file.content.split('\n');
        const displayLines = fileLines.slice(0, lines);
        
        displayLines.forEach(line => {
            this.addTerminalLine('', line, 'output-text');
        });
        
        if (!this.completedTasks.has('task-head')) {
            this.completeTask('task-head');
            this.updateSageMessage('完璧です！headでファイルの最初の部分を表示できました。長いファイルの概要把握に便利です。');
            this.updateHint('今度はtail long_story.txtでファイルの最後の部分を見てみましょう。');
        }
    }
    
    handleTail(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'tail: ファイル名を指定してください', 'error-text');
            return;
        }
        
        let lines = 10; // デフォルト行数
        let fileName = args[0];
        
        // -n オプションのチェック
        if (args[0] === '-n' && args.length >= 3) {
            lines = parseInt(args[1]);
            fileName = args[2];
        } else if (args[0].startsWith('-') && args[0].length > 1) {
            lines = parseInt(args[0].substring(1));
            fileName = args[1];
        }
        
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') {
            this.addTerminalLine('', `tail: ${fileName}: そのようなファイルはありません`, 'error-text');
            return;
        }
        
        const fileLines = file.content.split('\n');
        const displayLines = fileLines.slice(-lines);
        
        displayLines.forEach(line => {
            this.addTerminalLine('', line, 'output-text');
        });
        
        if (!this.completedTasks.has('task-tail')) {
            this.completeTask('task-tail');
            this.updateSageMessage('見事です！tailでファイルの最後の部分を表示できました。ログファイルの監視などに重宝します。');
            this.updateHint('今度はcat -n long_story.txtで行番号付きで表示してみましょう。');
        }
    }
    
    handleNano(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'nano: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        this.openNanoEditor(fileName);
    }
    
    openNanoEditor(fileName) {
        this.isInNano = true;
        this.currentEditingFile = fileName;
        
        // 既存ファイルの内容を読み込み
        const file = this.fileSystem[this.currentPath][fileName];
        const content = file ? file.content : '';
        
        this.nanoTextarea.value = content;
        this.nanoEditor.style.display = 'block';
        this.nanoTextarea.focus();
        
        this.commandInput.disabled = true;
        this.commandInput.placeholder = 'nano編集中... Ctrl+O: 保存, Ctrl+X: 終了';
        
        this.addTerminalLine('', `--- nano で ${fileName} を編集中 ---`, 'output-text');
        
        if (!this.completedTasks.has('task-nano')) {
            this.completeTask('task-nano');
            this.updateSageMessage('素晴らしい！nanoエディタが開きました。Ctrl+Oで保存、Ctrl+Xで終了です。');
        }
    }
    
    handleNanoInput(ctrlPressed) {
        if (!ctrlPressed) return;
        
        const key = event.key.toLowerCase();
        
        if (key === 'o') {
            // 保存
            event.preventDefault();
            this.saveFileInNano();
        } else if (key === 'x') {
            // 終了
            event.preventDefault();
            this.exitNano();
        }
    }
    
    saveFileInNano() {
        const content = this.nanoTextarea.value;
        
        // ファイルシステムを更新
        if (!this.fileSystem[this.currentPath][this.currentEditingFile]) {
            this.fileSystem[this.currentPath][this.currentEditingFile] = { type: 'file' };
        }
        this.fileSystem[this.currentPath][this.currentEditingFile].content = content;
        
        // 保存メッセージを表示
        this.addTerminalLine('', `ファイル「${this.currentEditingFile}」を保存しました`, 'output-text');
        
        // nanoの下部にメッセージを表示する代わりに、ターミナルに表示
        setTimeout(() => {
            this.addTerminalLine('', '[ ファイルが保存されました ]', 'output-text');
        }, 100);
    }
    
    exitNano() {
        this.isInNano = false;
        this.nanoEditor.style.display = 'none';
        this.commandInput.disabled = false;
        this.commandInput.placeholder = 'コマンドを入力してください';
        this.commandInput.focus();
        
        this.addTerminalLine('', '--- nano を終了しました ---', 'output-text');
        this.updateHint('最後にgrep "Day" long_story.txtでファイル内検索を試してみましょう。');
    }
    
    handleGrep(args) {
        if (args.length < 2) {
            this.addTerminalLine('', 'grep: 使用法: grep "検索文字列" ファイル名', 'error-text');
            return;
        }
        
        const searchTerm = args[0].replace(/"/g, '');
        const fileName = args[1];
        
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') {
            this.addTerminalLine('', `grep: ${fileName}: そのようなファイルはありません`, 'error-text');
            return;
        }
        
        const lines = file.content.split('\n');
        const matchingLines = [];
        
        lines.forEach((line, index) => {
            if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
                matchingLines.push(`${index + 1}:${line}`);
            }
        });
        
        if (matchingLines.length === 0) {
            this.addTerminalLine('', `grep: "${searchTerm}" は見つかりませんでした`, 'error-text');
        } else {
            matchingLines.forEach(line => {
                // 検索語をハイライト
                const highlightedLine = line.replace(
                    new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi'),
                    '<span class="search-highlight">$1</span>'
                );
                
                const lineElement = document.createElement('div');
                lineElement.className = 'terminal-line';
                lineElement.innerHTML = `<span class="output-text">${highlightedLine}</span>`;
                this.terminal.appendChild(lineElement);
            });
            
            if (!this.completedTasks.has('task-grep')) {
                this.completeTask('task-grep');
                this.updateSageMessage('完璧です！grepでファイル内検索ができました。これで大きなファイルから必要な情報を素早く見つけられます。');
                this.updateHint('🎉 すべてのタスクが完了しました！Day3の学習目標を達成しました！');
                this.checkAllTasksComplete();
            }
        }
    }
    
    handleLs() {
        const files = this.fileSystem[this.currentPath];
        Object.keys(files).forEach(fileName => {
            const fileInfo = files[fileName];
            const displayName = fileInfo.type === 'directory' ? fileName + '/' : fileName;
            const color = fileInfo.type === 'directory' ? 'color: #00ffff;' : 'color: #ffffff;';
            this.addTerminalLine('', displayName, 'output-text', color);
        });
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
    }
    
    clearTerminal() {
        this.terminal.innerHTML = '';
    }
    
    handleHelp() {
        this.addTerminalLine('', '=== Day3 利用可能なコマンド ===', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 - ファイル全体を表示', 'output-text');
        this.addTerminalLine('', 'cat -n ファイル名 - 行番号付きで表示', 'output-text');
        this.addTerminalLine('', 'less ファイル名 - ページごとに表示', 'output-text');
        this.addTerminalLine('', 'head ファイル名 - 最初の10行を表示', 'output-text');
        this.addTerminalLine('', 'tail ファイル名 - 最後の10行を表示', 'output-text');
        this.addTerminalLine('', 'nano ファイル名 - ファイルを編集', 'output-text');
        this.addTerminalLine('', 'grep "文字列" ファイル名 - ファイル内検索', 'output-text');
        this.addTerminalLine('', 'ls - ファイル一覧表示', 'output-text');
        this.addTerminalLine('', 'pwd - 現在のディレクトリ表示', 'output-text');
        this.addTerminalLine('', 'clear - ターミナルクリア', 'output-text');
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
        if (text.includes('<span class="search-highlight">')) {
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
        const requiredTasks = ['task-cat-full', 'task-less', 'task-head', 'task-tail', 'task-cat-n', 'task-nano', 'task-grep'];
        const allComplete = requiredTasks.every(task => this.completedTasks.has(task));
        
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
        this.addTerminalLine('', '🎉🎉🎉 Day3 クエスト完全制覇！ 🎉🎉🎉', 'output-text', 'color: #ffd700; font-weight: bold;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '今日習得したスキル：', 'output-text');
        this.addTerminalLine('', '• cat - ファイル全体の表示', 'output-text');
        this.addTerminalLine('', '• less - ページごとの閲覧', 'output-text');
        this.addTerminalLine('', '• head - ファイルの最初の確認', 'output-text');
        this.addTerminalLine('', '• tail - ファイルの最後の確認', 'output-text');
        this.addTerminalLine('', '• nano - テキストエディタでの編集', 'output-text');
        this.addTerminalLine('', '• grep - ファイル内検索', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '明日はDay4でファイル権限について学びます！', 'output-text', 'color: #00ffff;');
        
        this.updateSageMessage('おめでとう！君は今日、ファイルを読み解く様々な技術を習得した。これらは実際のシステム管理で毎日使われる重要な技術だ！');
        this.updateHint('🏆 Day3完了！お疲れ様でした！明日はファイル権限とchmodについて学びます。');
        
        // メイン画面に戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(3);
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
            window.location.href = '../index.html?completed=3';
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
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new Day3LinuxQuest();
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
    if (game && !localStorage.getItem('day3-completed')) {
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
        localStorage.setItem('day3-progress', JSON.stringify(currentProgress));
        
        // メイン画面に戻る
        window.location.href = '../index.html';
    }
}
class Day5LinuxQuest {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        this.scriptEditor = document.getElementById('scriptEditor');
        this.scriptTextarea = document.getElementById('scriptTextarea');
        this.editingFileName = document.getElementById('editingFileName');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        this.currentEditingFile = null;
        this.scriptVariables = {};
        
        // ファイルシステム
        this.fileSystem = {
            '/home/quest': {
                'hello.sh': {
                    type: 'file',
                    content: '#!/bin/bash\necho "Hello World!"',
                    permissions: { owner: 'rw-', group: 'r--', other: 'r--' }
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
        
        // エディタのボタンイベント
        document.getElementById('saveScript').addEventListener('click', () => {
            this.saveScript();
        });
        
        document.getElementById('closeEditor').addEventListener('click', () => {
            this.closeEditor();
        });
        
        // リファレンスタブの処理
        document.querySelectorAll('.ref-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchReferenceTab(e.target.dataset.tab);
            });
        });
        
        this.commandInput.focus();
        this.checkSlidesCompletion();
        this.showWelcomeMessage();
    }
    
    checkSlidesCompletion() {
        const slidesCompleted = localStorage.getItem('day5-slides-completed');
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
            this.addTerminalLine('', '今日はシェルスクリプトの作成方法を学びます！');
            this.addTerminalLine('', 'まずは基本的なスクリプトファイルを作成してみましょう。');
            this.addTerminalLine('', 'edit hello.sh でエディタを開いてスクリプトを作成できます。');
        }, 1000);
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
            case 'edit':
                this.handleEdit(args.slice(1));
                break;
            case 'cat':
                this.handleCat(args.slice(1));
                break;
            case 'chmod':
                this.handleChmod(args.slice(1));
                break;
            case 'ls':
                this.handleLs(args.slice(1));
                break;
            case 'bash':
                this.handleBash(args.slice(1));
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
            case 'demo':
                this.handleDemo(args.slice(1));
                break;
            default:
                if (command.startsWith('./')) {
                    this.handleRunScript(command);
                } else {
                    this.handleUnknownCommand(cmd);
                }
        }
    }
    
    handleEdit(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'edit: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        this.openScriptEditor(fileName);
    }
    
    openScriptEditor(fileName) {
        this.currentEditingFile = fileName;
        this.editingFileName.textContent = fileName;
        
        const file = this.fileSystem[this.currentPath][fileName];
        const content = file ? file.content : '#!/bin/bash\n# ' + fileName + ' - 作成者: ' + this.getCurrentUser() + '\n\necho "スクリプトの実行に成功しました！"';
        
        this.scriptTextarea.value = content;
        this.scriptEditor.style.display = 'flex';
        this.scriptTextarea.focus();
        
        this.commandInput.disabled = true;
        
        this.addTerminalLine('', `--- ${fileName} をエディタで編集中 ---`, 'output-text');
    }
    
    saveScript() {
        if (!this.currentEditingFile) return;
        
        const content = this.scriptTextarea.value;
        
        // ファイルシステムに保存
        if (!this.fileSystem[this.currentPath][this.currentEditingFile]) {
            this.fileSystem[this.currentPath][this.currentEditingFile] = {
                type: 'file',
                permissions: { owner: 'rw-', group: 'r--', other: 'r--' }
            };
        }
        
        this.fileSystem[this.currentPath][this.currentEditingFile].content = content;
        
        this.addTerminalLine('', `スクリプト「${this.currentEditingFile}」を保存しました`, 'output-text');
        
        // タスクチェック
        this.checkScriptContent(content);
    }
    
    closeEditor() {
        this.scriptEditor.style.display = 'none';
        this.commandInput.disabled = false;
        this.commandInput.focus();
        this.currentEditingFile = null;
        
        this.addTerminalLine('', 'エディタを閉じました', 'output-text');
    }
    
    checkScriptContent(content) {
        const lines = content.toLowerCase().split('\n');
        const contentStr = content.toLowerCase();
        
        // 基本スクリプト作成のチェック
        if (content.includes('#!/bin/bash') && content.includes('echo')) {
            if (!this.completedTasks.has('task-create-script')) {
                this.completeTask('task-create-script');
                this.updateSageMessage('素晴らしい！基本的なスクリプトが作成できました。#!/bin/bashで始まり、echoで出力するのが基本形です。');
                this.updateHint('今度は変数を使ってみましょう。NAME="値"で変数を定義し、$NAMEで参照できます。');
            }
        }
        
        // 変数使用のチェック
        if (contentStr.includes('=') && contentStr.includes('$')) {
            if (!this.completedTasks.has('task-variables')) {
                this.completeTask('task-variables');
                this.updateSageMessage('完璧です！変数の使い方を習得しました。変数は情報を記憶し、再利用するために重要です。');
                this.updateHint('次はreadコマンドでユーザー入力を受け取ってみましょう。');
            }
        }
        
        // ユーザー入力のチェック
        if (contentStr.includes('read')) {
            if (!this.completedTasks.has('task-user-input')) {
                this.completeTask('task-user-input');
                this.updateSageMessage('見事です！readでユーザーからの入力を受け取れるようになりました。インタラクティブなスクリプトの基本です。');
                this.updateHint('今度はif文で条件分岐を作ってみましょう。if [ 条件 ]; then 処理; fi の形式です。');
            }
        }
        
        // if文のチェック
        if (contentStr.includes('if') && contentStr.includes('then') && contentStr.includes('fi')) {
            if (!this.completedTasks.has('task-if-statement')) {
                this.completeTask('task-if-statement');
                this.updateSageMessage('優秀です！条件分岐をマスターしました。プログラムが判断して動作を変える、重要な技術です。');
                this.updateHint('次はfor文でループ処理を作ってみましょう。for i in 1 2 3; do 処理; done です。');
            }
        }
        
        // for文のチェック
        if (contentStr.includes('for') && contentStr.includes('do') && contentStr.includes('done')) {
            if (!this.completedTasks.has('task-for-loop')) {
                this.completeTask('task-for-loop');
                this.updateSageMessage('素晴らしい！繰り返し処理を習得しました。同じ作業を効率的に行う自動化の核心技術です。');
                this.updateHint('最後に関数を定義してみましょう。function_name() { 処理; } の形式です。');
            }
        }
        
        // 関数のチェック
        if ((contentStr.includes('function') || contentStr.includes('()')) && contentStr.includes('{') && contentStr.includes('}')) {
            if (!this.completedTasks.has('task-function')) {
                this.completeTask('task-function');
                this.updateSageMessage('完璧です！関数の定義と使用をマスターしました。コードの再利用性を高める重要な概念です。');
                this.updateHint('実用的なスクリプトを完成させて実行してみましょう！chmod +x で実行権限を付けて ./スクリプト名 で実行できます。');
            }
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
        
        const lines = file.content.split('\n');
        lines.forEach(line => {
            this.addTerminalLine('', line, 'output-text');
        });
    }
    
    handleChmod(args) {
        if (args.length < 2) {
            this.addTerminalLine('', 'chmod: 使用法: chmod +x ファイル名', 'error-text');
            return;
        }
        
        const permission = args[0];
        const fileName = args[1];
        
        const file = this.fileSystem[this.currentPath][fileName];
        if (!file) {
            this.addTerminalLine('', `chmod: ${fileName}: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (permission === '+x') {
            file.permissions.owner = 'rwx';
            this.addTerminalLine('', `${fileName}に実行権限を付与しました`, 'output-text');
        }
    }
    
    handleLs(args) {
        const files = this.fileSystem[this.currentPath];
        Object.keys(files).forEach(fileName => {
            const file = files[fileName];
            const displayName = file.type === 'directory' ? fileName + '/' : fileName;
            const color = file.type === 'directory' ? 'color: #00ffff;' : 
                         (file.permissions && file.permissions.owner.includes('x')) ? 'color: #00ff00;' : 'color: #ffffff;';
            this.addTerminalLine('', displayName, 'output-text', color);
        });
    }
    
    handleBash(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'bash: ファイル名を指定してください', 'error-text');
            return;
        }
        
        const fileName = args[0];
        this.runScript(fileName, false);
    }
    
    handleRunScript(command) {
        const fileName = command.replace('./', '');
        this.runScript(fileName, true);
    }
    
    runScript(fileName, checkPermission = true) {
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') {
            this.addTerminalLine('', `bash: ${fileName}: そのようなファイルやディレクトリはありません`, 'error-text');
            return;
        }
        
        if (checkPermission && (!file.permissions || !file.permissions.owner.includes('x'))) {
            this.addTerminalLine('', `bash: ${fileName}: 許可がありません`, 'error-text');
            this.addTerminalLine('', 'ヒント: chmod +x でファイルに実行権限を付与してください', 'hint-text');
            return;
        }
        
        this.addTerminalLine('', `--- ${fileName} を実行中 ---`, 'script-output');
        this.executeScriptContent(file.content);
        
        // 実用的なスクリプトの完成チェック
        if (file.content.includes('#!/bin/bash') && 
            file.content.toLowerCase().includes('echo') && 
            (file.content.toLowerCase().includes('read') || 
             file.content.toLowerCase().includes('if') || 
             file.content.toLowerCase().includes('for'))) {
            if (!this.completedTasks.has('task-practical-script')) {
                this.completeTask('task-practical-script');
                this.updateSageMessage('圧倒的です！実用的なスクリプトを完成させて実行できました。これで自動化の基本をマスターしました！');
                this.updateHint('🎉 すべてのタスクが完了しました！シェルスクリプトの基本をマスターできましたね！');
                this.checkAllTasksComplete();
            }
        }
    }
    
    executeScriptContent(content) {
        const lines = content.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            
            // コメントとシェバンをスキップ
            if (line.startsWith('#') || line === '') continue;
            
            // 変数定義
            if (line.includes('=') && !line.includes('$')) {
                const [varName, varValue] = line.split('=');
                this.scriptVariables[varName.trim()] = varValue.replace(/"/g, '').trim();
                continue;
            }
            
            // echo文の処理
            if (line.startsWith('echo')) {
                let output = line.substring(4).trim();
                output = output.replace(/"/g, '');
                
                // 変数置換
                output = this.replaceVariables(output);
                
                // コマンド置換のシミュレーション
                output = output.replace(/\$\(date\)/g, new Date().toLocaleString('ja-JP'));
                output = output.replace(/\$\(pwd\)/g, this.currentPath);
                output = output.replace(/\$USER/g, this.getCurrentUser());
                
                this.addTerminalLine('', output, 'script-output');
            }
            
            // read文の処理（簡易版）
            if (line.startsWith('read')) {
                const varName = line.split(' ')[1];
                if (varName) {
                    // デモ用の値を設定
                    this.scriptVariables[varName] = 'デモ入力値';
                    this.addTerminalLine('', `[ユーザー入力: デモ入力値]`, 'script-output');
                }
            }
            
            // if文の簡易処理
            if (line.includes('if') && line.includes('then')) {
                this.addTerminalLine('', '[条件分岐が実行されました]', 'script-output');
            }
            
            // for文の簡易処理
            if (line.includes('for') && line.includes('do')) {
                this.addTerminalLine('', '[ループ処理が実行されました]', 'script-output');
            }
            
            // 関数呼び出しの簡易処理
            if (line.includes('()') || line.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                if (!line.includes('echo') && !line.includes('read') && !line.includes('if') && !line.includes('for')) {
                    this.addTerminalLine('', '[関数が実行されました]', 'script-output');
                }
            }
        }
        
        this.addTerminalLine('', `--- ${this.currentEditingFile || 'スクリプト'} の実行完了 ---`, 'script-output');
    }
    
    replaceVariables(text) {
        Object.keys(this.scriptVariables).forEach(varName => {
            const regex = new RegExp(`\\$${varName}\\b`, 'g');
            text = text.replace(regex, this.scriptVariables[varName]);
        });
        return text;
    }
    
    handleDemo(args) {
        const demoType = args[0];
        
        switch (demoType) {
            case 'basic':
                this.createDemoScript('basic_demo.sh', this.getDemoScript('basic'));
                break;
            case 'variables':
                this.createDemoScript('variables_demo.sh', this.getDemoScript('variables'));
                break;
            case 'conditions':
                this.createDemoScript('conditions_demo.sh', this.getDemoScript('conditions'));
                break;
            case 'loops':
                this.createDemoScript('loops_demo.sh', this.getDemoScript('loops'));
                break;
            case 'functions':
                this.createDemoScript('functions_demo.sh', this.getDemoScript('functions'));
                break;
            default:
                this.addTerminalLine('', 'demo: 利用可能なデモ: basic, variables, conditions, loops, functions', 'output-text');
        }
    }
    
    createDemoScript(fileName, content) {
        this.fileSystem[this.currentPath][fileName] = {
            type: 'file',
            content: content,
            permissions: { owner: 'rwx', group: 'r-x', other: 'r-x' }
        };
        
        this.addTerminalLine('', `デモスクリプト「${fileName}」を作成しました`, 'output-text');
        this.addTerminalLine('', `cat ${fileName} で内容を確認、./${fileName} で実行できます`, 'output-text');
    }
    
    getDemoScript(type) {
        const demos = {
            basic: `#!/bin/bash
# 基本的なスクリプトの例
echo "=== 基本スクリプトのデモ ==="
echo "こんにちは、スクリプトの世界へ！"
echo "現在の時刻: $(date)"
echo "現在のユーザー: $USER"`,
            
            variables: `#!/bin/bash
# 変数を使ったスクリプトの例
NAME="Linux冒険者"
LEVEL=5
EXPERIENCE=1000

echo "=== 変数のデモ ==="
echo "名前: $NAME"
echo "レベル: $LEVEL"
echo "経験値: $EXPERIENCE"

# 計算
NEW_EXP=$((EXPERIENCE + 500))
echo "新しい経験値: $NEW_EXP"`,
            
            conditions: `#!/bin/bash
# 条件分岐のデモ
echo "=== 条件分岐のデモ ==="
SCORE=85

if [ $SCORE -ge 90 ]; then
    echo "素晴らしい！Aランクです"
elif [ $SCORE -ge 70 ]; then
    echo "良い成績です！Bランクです"
else
    echo "もう少し頑張りましょう"
fi`,
            
            loops: `#!/bin/bash
# ループのデモ
echo "=== ループのデモ ==="

echo "カウントダウン:"
for i in 5 4 3 2 1; do
    echo "$i..."
done
echo "完了！"

echo "1から5まで:"
for ((i=1; i<=5; i++)); do
    echo "数字: $i"
done`,
            
            functions: `#!/bin/bash
# 関数のデモ
greet_user() {
    local name=$1
    echo "こんにちは、$name さん！"
}

calculate_square() {
    local number=$1
    local result=$((number * number))
    echo "$number の二乗は $result です"
}

echo "=== 関数のデモ ==="
greet_user "スクリプト学習者"
calculate_square 8`
        };
        
        return demos[type] || '';
    }
    
    switchReferenceTab(tabName) {
        // タブの切り替え
        document.querySelectorAll('.ref-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // コンテンツの切り替え
        document.querySelectorAll('.ref-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector(`[data-section="${tabName}"]`).classList.add('active');
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
    }
    
    handleHelp() {
        this.addTerminalLine('', '=== Day5 利用可能なコマンド ===', 'output-text');
        this.addTerminalLine('', 'edit ファイル名 - スクリプトエディタを開く', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 - ファイル内容を表示', 'output-text');
        this.addTerminalLine('', 'chmod +x ファイル名 - 実行権限を付与', 'output-text');
        this.addTerminalLine('', './スクリプト名 - スクリプトを実行', 'output-text');
        this.addTerminalLine('', 'bash スクリプト名 - スクリプトを実行', 'output-text');
        this.addTerminalLine('', 'demo タイプ - デモスクリプトを作成', 'output-text');
        this.addTerminalLine('', '  (basic, variables, conditions, loops, functions)', 'output-text');
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
    }
    
    checkAllTasksComplete() {
        const requiredTasks = ['task-create-script', 'task-variables', 'task-user-input', 'task-if-statement', 'task-for-loop', 'task-function', 'task-practical-script'];
        const allComplete = requiredTasks.every(task => this.completedTasks.has(task));
        
        if (allComplete) {
            setTimeout(() => {
                this.showVictoryMessage();
            }, 1000);
        }
    }
    
    showCompletionEffect() {
        const effect = document.createElement('div');
        effect.textContent = '📜';
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
        this.addTerminalLine('', '🎉🎉🎉 Day5 クエスト完全制覇！ 🎉🎉🎉', 'output-text', 'color: #ffd700; font-weight: bold;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '今日習得したスキル：', 'output-text');
        this.addTerminalLine('', '• 基本的なシェルスクリプトの作成', 'output-text');
        this.addTerminalLine('', '• 変数の定義と使用方法', 'output-text');
        this.addTerminalLine('', '• ユーザー入力の受け取り', 'output-text');
        this.addTerminalLine('', '• if文による条件分岐', 'output-text');
        this.addTerminalLine('', '• for文による繰り返し処理', 'output-text');
        this.addTerminalLine('', '• 関数の定義と呼び出し', 'output-text');
        this.addTerminalLine('', '• 実用的なスクリプトの開発', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '明日はDay6でパイプとリダイレクトについて学びます！', 'output-text', 'color: #00ffff;');
        
        this.updateSageMessage('圧倒的だ！君は今日、自動化の魔法使いになった。スクリプトは君の分身となり、繰り返し作業から君を解放してくれる！');
        this.updateHint('🏆 Day5完了！お疲れ様でした！明日はパイプとリダイレクトでデータの流れを制御する技術を学びます。');
        
        // メイン画面に戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(5);
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
            window.location.href = '../index.html?completed=5';
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
    
    getCurrentUser() {
        return 'quest_adventurer';
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new Day5LinuxQuest();
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
    if (game && !localStorage.getItem('day5-completed')) {
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
        localStorage.setItem('day5-progress', JSON.stringify(currentProgress));
        
        // メイン画面に戻る
        window.location.href = '../index.html';
    }
}
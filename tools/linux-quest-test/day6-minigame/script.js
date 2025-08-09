class Day6LinuxQuest {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        this.flowContainer = document.getElementById('flowContainer');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        
        // ファイルシステム
        this.fileSystem = {
            '/home/quest': {
                'access.log': {
                    type: 'file',
                    content: `192.168.1.10 - - [28/Jul/2024:10:30:15] "GET /index.html" 200 1234
192.168.1.11 - - [28/Jul/2024:10:31:22] "GET /about.html" 200 5678
192.168.1.10 - - [28/Jul/2024:10:32:45] "POST /login" 404 0
192.168.1.12 - - [28/Jul/2024:10:33:12] "GET /products.html" 200 9876
192.168.1.10 - - [28/Jul/2024:10:34:33] "GET /index.html" 200 1234
192.168.1.13 - - [28/Jul/2024:10:35:44] "GET /contact.html" 500 0
192.168.1.11 - - [28/Jul/2024:10:36:55] "GET /about.html" 200 5678
192.168.1.14 - - [28/Jul/2024:10:37:12] "GET /index.html" 200 1234
192.168.1.10 - - [28/Jul/2024:10:38:33] "GET /search.html" 200 3456
192.168.1.15 - - [28/Jul/2024:10:39:44] "POST /submit" 200 789`
                },
                'users.txt': {
                    type: 'file',
                    content: `alice:admin:25:marketing
bob:user:30:engineering
charlie:admin:28:sales
diana:user:35:marketing
eve:moderator:22:support
frank:user:40:engineering
grace:admin:27:sales
henry:user:33:support
ivy:moderator:29:marketing
jack:user:31:engineering`
                },
                'sales.csv': {
                    type: 'file',
                    content: `date,product,amount,sales_person
2024-07-01,Product A,10000,Alice
2024-07-01,Product B,15000,Bob
2024-07-02,Product A,12000,Alice
2024-07-02,Product C,8000,Charlie
2024-07-03,Product B,18000,Bob
2024-07-03,Product A,14000,Alice
2024-07-04,Product C,9000,Charlie
2024-07-04,Product B,16000,Bob
2024-07-05,Product A,11000,Alice
2024-07-05,Product D,20000,Diana`
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
    
    checkSlidesCompletion() {
        const slidesCompleted = localStorage.getItem('day6-slides-completed');
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
            this.addTerminalLine('', '今日はパイプ（|）とリダイレクト（>, >>）でデータの流れを操る技術を学びます！');
            this.addTerminalLine('', 'まずはsetup-dataでサンプルデータを確認してから始めましょう。');
            this.updateFlowVisualization(['データ準備', '確認', '処理開始', '結果出力']);
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
        // パイプとリダイレクトの解析
        if (command.includes('|') || command.includes('>')) {
            this.processPipeline(command);
            return;
        }
        
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        switch (cmd) {
            case 'setup-data':
                this.handleSetupData();
                break;
            case 'cat':
                this.handleCat(args.slice(1));
                break;
            case 'ls':
                this.handleLs(args.slice(1));
                break;
            case 'grep':
                this.handleGrep(args.slice(1));
                break;
            case 'sort':
                this.handleSort(args.slice(1));
                break;
            case 'uniq':
                this.handleUniq(args.slice(1));
                break;
            case 'wc':
                this.handleWc(args.slice(1));
                break;
            case 'cut':
                this.handleCut(args.slice(1));
                break;
            case 'head':
                this.handleHead(args.slice(1));
                break;
            case 'tail':
                this.handleTail(args.slice(1));
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
                this.handleUnknownCommand(cmd);
        }
    }
    
    processPipeline(command) {
        const steps = [];\n        let currentData = '';
        let isRedirecting = false;
        let redirectFile = '';
        let isAppending = false;
        
        // リダイレクトの検出
        if (command.includes('>>')) {
            isRedirecting = true;
            isAppending = true;
            const parts = command.split('>>');\n            command = parts[0].trim();
            redirectFile = parts[1].trim();
        } else if (command.includes('>')) {
            isRedirecting = true;
            const parts = command.split('>');
            command = parts[0].trim();
            redirectFile = parts[1].trim();
        }
        
        // パイプラインの分割
        const pipelineSteps = command.split('|').map(step => step.trim());
        
        // 各ステップを実行
        for (let i = 0; i < pipelineSteps.length; i++) {
            const step = pipelineSteps[i];
            const args = step.split(' ');
            const cmd = args[0].toLowerCase();
            
            if (i === 0) {
                // 最初のコマンド - データの取得
                currentData = this.executeFirstCommand(cmd, args.slice(1));
                steps.push(`${cmd} (データ取得)`);
            } else {
                // パイプ処理
                currentData = this.executePipeCommand(cmd, args.slice(1), currentData);
                steps.push(`${cmd} (処理)`);
            }
            
            if (!currentData) {
                this.addTerminalLine('', 'パイプライン処理でエラーが発生しました', 'error-text');
                return;
            }
        }
        
        // 結果の出力またはリダイレクト
        if (isRedirecting) {
            this.redirectOutput(currentData, redirectFile, isAppending);
            steps.push(`${isAppending ? '>>' : '>'} ${redirectFile} (保存)`);
        } else {
            this.displayPipelineResult(currentData);
        }
        
        // フロー可視化の更新
        this.updateFlowVisualization(steps);
        
        // タスクの完了チェック
        this.checkPipelineTasks(command, pipelineSteps.length);
    }
    
    executeFirstCommand(cmd, args) {
        switch (cmd) {
            case 'cat':
                return this.getCatOutput(args);
            case 'ls':
                return this.getLsOutput(args);
            case 'echo':
                return args.join(' ').replace(/"/g, '');
            default:
                this.addTerminalLine('', `${cmd}: パイプライン開始コマンドとしてサポートされていません`, 'error-text');
                return null;
        }
    }
    
    executePipeCommand(cmd, args, inputData) {
        if (!inputData) return null;
        
        const lines = inputData.split('\n').filter(line => line.trim() !== '');
        
        switch (cmd) {
            case 'grep':
                return this.grepProcess(args, lines);
            case 'sort':
                return this.sortProcess(args, lines);
            case 'uniq':
                return this.uniqProcess(args, lines);
            case 'wc':
                return this.wcProcess(args, lines);
            case 'cut':
                return this.cutProcess(args, lines);
            case 'head':
                return this.headProcess(args, lines);
            case 'tail':
                return this.tailProcess(args, lines);
            default:
                this.addTerminalLine('', `${cmd}: パイプコマンドとしてサポートされていません`, 'error-text');
                return null;
        }
    }
    
    getCatOutput(args) {
        if (args.length === 0) return null;
        
        const fileName = args[0];
        const file = this.fileSystem[this.currentPath][fileName];
        
        if (!file || file.type !== 'file') return null;
        
        return file.content;
    }
    
    getLsOutput(args) {
        const files = this.fileSystem[this.currentPath];
        return Object.keys(files).join('\n');
    }
    
    grepProcess(args, lines) {
        if (args.length === 0) return lines.join('\n');
        
        const pattern = args[0].replace(/"/g, '');
        const filteredLines = lines.filter(line => 
            line.toLowerCase().includes(pattern.toLowerCase())
        );
        
        return filteredLines.join('\n');
    }
    
    sortProcess(args, lines) {
        const sortedLines = [...lines].sort();
        return sortedLines.join('\n');
    }
    
    uniqProcess(args, lines) {
        const result = [];
        const counts = {};
        
        lines.forEach(line => {
            counts[line] = (counts[line] || 0) + 1;
        });
        
        if (args.includes('-c')) {
            Object.keys(counts).forEach(line => {
                result.push(`${counts[line].toString().padStart(7)} ${line}`);
            });
        } else {
            result.push(...Object.keys(counts));
        }
        
        return result.join('\n');
    }
    
    wcProcess(args, lines) {
        const lineCount = lines.length;
        const wordCount = lines.join(' ').split(/\s+/).filter(w => w).length;
        const charCount = lines.join('\n').length;
        
        if (args.includes('-l')) {
            return lineCount.toString();
        } else if (args.includes('-w')) {
            return wordCount.toString();
        } else if (args.includes('-c')) {
            return charCount.toString();
        } else {
            return `${lineCount} ${wordCount} ${charCount}`;
        }
    }
    
    cutProcess(args, lines) {
        let delimiter = '\t';
        let field = 1;
        
        // 引数の解析
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-d' && i + 1 < args.length) {
                delimiter = args[i + 1].replace(/'/g, '');
                i++;
            } else if (args[i] === '-f' && i + 1 < args.length) {
                field = parseInt(args[i + 1]);
                i++;
            } else if (args[i].startsWith('-d')) {
                delimiter = args[i].substring(2).replace(/'/g, '');
            } else if (args[i].startsWith('-f')) {
                field = parseInt(args[i].substring(2));
            }
        }
        
        const result = lines.map(line => {
            const parts = line.split(delimiter);
            return parts[field - 1] || '';
        });
        
        return result.join('\n');
    }
    
    headProcess(args, lines) {
        let count = 10;
        
        if (args.length > 0 && args[0].startsWith('-')) {
            count = parseInt(args[0].substring(1)) || 10;
        } else if (args.includes('-n') && args.length > 1) {
            const index = args.indexOf('-n');
            count = parseInt(args[index + 1]) || 10;
        }
        
        return lines.slice(0, count).join('\n');
    }
    
    tailProcess(args, lines) {
        let count = 10;
        
        if (args.length > 0 && args[0].startsWith('-')) {
            count = parseInt(args[0].substring(1)) || 10;
        } else if (args.includes('-n') && args.length > 1) {
            const index = args.indexOf('-n');
            count = parseInt(args[index + 1]) || 10;
        }
        
        return lines.slice(-count).join('\n');
    }
    
    redirectOutput(data, fileName, isAppending) {
        if (!this.fileSystem[this.currentPath][fileName]) {
            this.fileSystem[this.currentPath][fileName] = {
                type: 'file',
                content: ''
            };
        }
        
        if (isAppending) {
            this.fileSystem[this.currentPath][fileName].content += '\n' + data;
        } else {
            this.fileSystem[this.currentPath][fileName].content = data;
        }
        
        this.addTerminalLine('', `結果を${fileName}に${isAppending ? '追記' : '保存'}しました`, 'output-text');
    }
    
    displayPipelineResult(data) {
        const lines = data.split('\n');
        lines.forEach(line => {
            this.addTerminalLine('', line, 'pipe-output');
        });
    }
    
    checkPipelineTasks(command, pipeCount) {
        // 基本的なパイプ
        if (command.includes('|') && !this.completedTasks.has('task-basic-pipe')) {
            this.completeTask('task-basic-pipe');
            this.updateSageMessage('素晴らしい！基本的なパイプを使用できました。一つのコマンドの出力を次のコマンドの入力に渡すことができます。');
            this.updateHint('今度は > を使って結果をファイルに保存してみましょう。');
        }
        
        // 出力リダイレクト
        if (command.includes('>') && !command.includes('>>') && !this.completedTasks.has('task-redirect-output')) {
            this.completeTask('task-redirect-output');
            this.updateSageMessage('完璧です！出力リダイレクトをマスターしました。結果をファイルに保存する重要な技術です。');
            this.updateHint('今度は >> を使って既存ファイルに追記してみましょう。');
        }
        
        // 追記リダイレクト
        if (command.includes('>>') && !this.completedTasks.has('task-append-output')) {
            this.completeTask('task-append-output');
            this.updateSageMessage('見事です！追記リダイレクトも習得しました。既存ファイルにデータを追加する技術です。');
            this.updateHint('複数のパイプを組み合わせて複雑な処理を作ってみましょう。');
        }
        
        // 複数パイプ
        if (pipeCount >= 3 && !this.completedTasks.has('task-multiple-pipes')) {
            this.completeTask('task-multiple-pipes');
            this.updateSageMessage('優秀です！複数のパイプを組み合わせて複雑なデータ処理ができるようになりました。');
            this.updateHint('grepとパイプを組み合わせてデータフィルタリングを試してみましょう。');
        }
        
        // grep + パイプ
        if (command.includes('grep') && command.includes('|') && !this.completedTasks.has('task-grep-pipe')) {
            this.completeTask('task-grep-pipe');
            this.updateSageMessage('完璧です！grepとパイプの組み合わせでデータフィルタリングをマスターしました。');
            this.updateHint('sort + uniq でデータの重複除去と整理を試してみましょう。');
        }
        
        // sort + uniq
        if (command.includes('sort') && command.includes('uniq') && !this.completedTasks.has('task-sort-uniq')) {
            this.completeTask('task-sort-uniq');
            this.updateSageMessage('素晴らしい！sort + uniq でデータ整理の技術をマスターしました。');
            this.updateHint('実用的なデータ解析にチャレンジしてみましょう！例：複雑な組み合わせでログ解析など。');
        }
        
        // 実用的なデータ解析
        if ((command.includes('cut') || command.includes('wc')) && 
            command.includes('|') && pipeCount >= 2 && 
            !this.completedTasks.has('task-data-analysis')) {
            this.completeTask('task-data-analysis');
            this.updateSageMessage('圧倒的です！実用的なデータ解析技術をマスターしました。これで本格的なデータ処理ができます！');
            this.updateHint('🎉 すべてのタスクが完了しました！パイプとリダイレクトをマスターできましたね！');
            this.checkAllTasksComplete();
        }
    }
    
    handleSetupData() {
        this.addTerminalLine('', '=== サンプルデータの確認 ===', 'output-text');
        this.addTerminalLine('', 'access.log - Webサーバーのアクセスログ', 'output-text');
        this.addTerminalLine('', 'users.txt - ユーザー情報データ', 'output-text');
        this.addTerminalLine('', 'sales.csv - 売上データ（CSV形式）', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', 'データが準備されました！', 'analysis-result');
        this.addTerminalLine('', 'まずは cat access.log | wc -l でログの行数を数えてみましょう', 'hint-text');
        
        this.updateFlowVisualization(['データ確認', '準備完了', '処理可能', '実践開始']);
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
    
    handleLs(args) {
        const files = this.fileSystem[this.currentPath];
        Object.keys(files).forEach(fileName => {
            const file = files[fileName];
            const displayName = file.type === 'directory' ? fileName + '/' : fileName;
            const color = file.type === 'directory' ? 'color: #00ffff;' : 'color: #ffffff;';
            this.addTerminalLine('', displayName, 'output-text', color);
        });
    }
    
    handleGrep(args) {
        if (args.length === 0) {
            this.addTerminalLine('', 'grep: 検索文字列を指定してください', 'error-text');
            return;
        }
        
        this.addTerminalLine('', 'grep: パイプラインで使用してください。例: cat file.txt | grep "検索語"', 'hint-text');
    }
    
    handleSort(args) {
        this.addTerminalLine('', 'sort: パイプラインで使用してください。例: cat file.txt | sort', 'hint-text');
    }
    
    handleUniq(args) {
        this.addTerminalLine('', 'uniq: パイプラインで使用してください。例: sort file.txt | uniq', 'hint-text');
    }
    
    handleWc(args) {
        this.addTerminalLine('', 'wc: パイプラインで使用してください。例: cat file.txt | wc -l', 'hint-text');
    }
    
    handleCut(args) {
        this.addTerminalLine('', 'cut: パイプラインで使用してください。例: cat file.csv | cut -d, -f1', 'hint-text');
    }
    
    handleHead(args) {
        this.addTerminalLine('', 'head: パイプラインで使用してください。例: cat file.txt | head -5', 'hint-text');
    }
    
    handleTail(args) {
        this.addTerminalLine('', 'tail: パイプラインで使用してください。例: cat file.txt | tail -5', 'hint-text');
    }
    
    handleDemo(args) {
        const demoType = args[0];
        
        switch (demoType) {
            case 'pipe':
                this.addTerminalLine('', '=== パイプのデモ ===', 'output-text');
                this.addTerminalLine('', 'cat access.log | grep "GET" | head -3', 'analysis-result');
                this.addTerminalLine('', 'cat users.txt | cut -d: -f1 | sort', 'analysis-result');
                break;
            case 'redirect':
                this.addTerminalLine('', '=== リダイレクトのデモ ===', 'output-text');
                this.addTerminalLine('', 'cat access.log | grep "200" > success.log', 'analysis-result');
                this.addTerminalLine('', 'cat users.txt | sort >> sorted_users.txt', 'analysis-result');
                break;
            case 'analysis':
                this.addTerminalLine('', '=== データ解析のデモ ===', 'output-text');
                this.addTerminalLine('', 'cat sales.csv | cut -d, -f2 | sort | uniq -c', 'analysis-result');
                this.addTerminalLine('', 'cat access.log | cut -d" " -f1 | sort | uniq -c | sort -nr', 'analysis-result');
                break;
            default:
                this.addTerminalLine('', 'demo: 利用可能なデモ: pipe, redirect, analysis', 'output-text');
        }
    }
    
    updateFlowVisualization(steps) {
        const flowSteps = this.flowContainer.querySelectorAll('.flow-step');
        
        // 既存のステップをクリア
        this.flowContainer.innerHTML = '';
        
        // 新しいステップを作成
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'flow-step';
            
            const boxElement = document.createElement('div');
            boxElement.className = 'flow-box';
            boxElement.textContent = step;
            
            stepElement.appendChild(boxElement);
            
            // 最後の要素以外は矢印を追加
            if (index < steps.length - 1) {
                const arrowElement = document.createElement('div');
                arrowElement.className = 'flow-arrow';
                arrowElement.textContent = '→';
                stepElement.appendChild(arrowElement);
            }
            
            this.flowContainer.appendChild(stepElement);
        });
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
    }
    
    handleHelp() {
        this.addTerminalLine('', '=== Day6 利用可能なコマンド ===', 'output-text');
        this.addTerminalLine('', 'setup-data - サンプルデータを準備', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '=== パイプライン例 ===', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 | grep "検索語" - パターンフィルタリング', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 | sort | uniq - 重複除去', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 | wc -l - 行数カウント', 'output-text');
        this.addTerminalLine('', 'cat ファイル名 | head -5 - 最初の5行', 'output-text');
        this.addTerminalLine('', 'cat csv.txt | cut -d, -f1 - 1列目を抽出', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '=== リダイレクト例 ===', 'output-text');
        this.addTerminalLine('', 'コマンド > ファイル名 - ファイルに保存', 'output-text');
        this.addTerminalLine('', 'コマンド >> ファイル名 - ファイルに追記', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', 'demo パイプ種類 - デモを表示 (pipe, redirect, analysis)', 'output-text');
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
        const requiredTasks = ['task-basic-pipe', 'task-redirect-output', 'task-append-output', 'task-multiple-pipes', 'task-grep-pipe', 'task-sort-uniq', 'task-data-analysis'];
        const allComplete = requiredTasks.every(task => this.completedTasks.has(task));
        
        if (allComplete) {
            setTimeout(() => {
                this.showVictoryMessage();
            }, 1000);
        }
    }
    
    showCompletionEffect() {
        const effect = document.createElement('div');
        effect.textContent = '🌊';
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
        this.addTerminalLine('', '🎉🎉🎉 Day6 クエスト完全制覇！ 🎉🎉🎉', 'output-text', 'color: #ffd700; font-weight: bold;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '今日習得したスキル：', 'output-text');
        this.addTerminalLine('', '• パイプ（|）によるコマンド連結', 'output-text');
        this.addTerminalLine('', '• 出力リダイレクト（>）でファイル保存', 'output-text');
        this.addTerminalLine('', '• 追記リダイレクト（>>）でファイル追記', 'output-text');
        this.addTerminalLine('', '• 複数パイプの組み合わせ', 'output-text');
        this.addTerminalLine('', '• grep, sort, uniq, cut, wc との連携', 'output-text');
        this.addTerminalLine('', '• 実用的なデータ解析技術', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '明日はDay7で最終試練 - 総合システム管理ツールの作成です！', 'output-text', 'color: #00ffff;');
        
        this.updateSageMessage('圧倒的だ！君は今日、データの流れを自在に操る術を習得した。パイプとリダイレクトは、Linux の最も美しく強力な機能の一つだ！');
        this.updateHint('🏆 Day6完了！お疲れ様でした！明日は最終日 - 総合的なシステム管理ツールを作成します。');
        
        // メイン画面に戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(6);
        }
        
        this.updateFlowVisualization(['習得完了', '技術統合', '実践準備', '最終試練へ']);
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
            window.location.href = '../index.html?completed=6';
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
    new Day6LinuxQuest();
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
    if (game && !localStorage.getItem('day6-completed')) {
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
        localStorage.setItem('day6-progress', JSON.stringify(currentProgress));
        
        // メイン画面に戻る
        window.location.href = '../index.html';
    }
}
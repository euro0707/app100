class Day7LinuxQuest {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.commandInput = document.getElementById('commandInput');
        this.hintText = document.getElementById('hintText');
        this.sageMessage = document.getElementById('sageMessage');
        this.adminToolInterface = document.getElementById('adminToolInterface');
        this.adminDisplay = document.getElementById('adminDisplay');
        
        this.currentPath = '/home/quest';
        this.completedTasks = new Set();
        this.commandHistory = [];
        this.adminToolCreated = false;
        this.startTime = Date.now();
        
        // システム管理ツールのデータ
        this.systemData = {
            processes: [
                { pid: 1234, name: 'systemd', cpu: 0.1, memory: 2.3, user: 'root' },
                { pid: 2345, name: 'chrome', cpu: 15.2, memory: 12.7, user: 'quest' },
                { pid: 3456, name: 'node', cpu: 8.5, memory: 6.4, user: 'quest' },
                { pid: 4567, name: 'bash', cpu: 0.2, memory: 1.1, user: 'quest' },
                { pid: 5678, name: 'mysql', cpu: 3.1, memory: 45.2, user: 'mysql' }
            ],
            logs: [
                '[2024-07-29 10:30:15] INFO: システム起動完了',
                '[2024-07-29 10:31:22] WARN: メモリ使用量が80%を超えました',
                '[2024-07-29 10:32:45] ERROR: ディスク容量不足',
                '[2024-07-29 10:33:12] INFO: バックアップ処理開始',
                '[2024-07-29 10:34:33] INFO: バックアップ処理完了',
                '[2024-07-29 10:35:44] WARN: 不正なログイン試行を検出',
                '[2024-07-29 10:36:55] INFO: システム最適化処理実行'
            ],
            files: [
                { name: 'config.txt', size: '2.3KB', modified: '2024-07-29 10:20' },
                { name: 'logs/', size: '156MB', modified: '2024-07-29 10:35' },
                { name: 'backup/', size: '2.1GB', modified: '2024-07-29 10:30' },
                { name: 'scripts/', size: '45KB', modified: '2024-07-29 09:15' },
                { name: 'data.db', size: '890MB', modified: '2024-07-28 18:45' }
            ]
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });
        
        // 管理ツールのイベントリスナー
        this.setupAdminToolEvents();
        
        // スキルカードの初期化
        this.initializeSkillCards();
        
        // 稼働時間の更新
        this.updateUptime();
        setInterval(() => this.updateUptime(), 1000);
        
        this.commandInput.focus();
        this.checkSlidesCompletion();
        this.showWelcomeMessage();
    }
    
    setupAdminToolEvents() {
        document.getElementById('minimizeAdmin').addEventListener('click', () => {
            this.adminToolInterface.style.display = 'none';
        });
        
        document.getElementById('closeAdmin').addEventListener('click', () => {
            this.adminToolInterface.style.display = 'none';
        });
        
        document.querySelectorAll('.admin-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const functionName = e.target.dataset.function;
                this.executeAdminFunction(functionName);
                
                // アクティブボタンの更新
                document.querySelectorAll('.admin-menu-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    initializeSkillCards() {
        // 全てのスキルカードを習得済みとしてマーク
        document.querySelectorAll('.skill-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('mastered');
            }, index * 200);
        });
    }
    
    updateUptime() {
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            uptimeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    checkSlidesCompletion() {
        const slidesCompleted = localStorage.getItem('day7-slides-completed');
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
            this.addTerminalLine('', '🎊 ついに最終日です！これまでの7日間の学習の集大成として');
            this.addTerminalLine('', '総合的なシステム管理ツールを作成しましょう！');
            this.addTerminalLine('', '');
            this.addTerminalLine('', 'このツールには以下の機能を統合します：');
            this.addTerminalLine('', '• システム情報表示（Day1-2の技術）');
            this.addTerminalLine('', '• プロセス監視（Day3-4の技術）');
            this.addTerminalLine('', '• ログ解析（Day5の技術）');
            this.addTerminalLine('', '• バックアップシステム（Day6の技術）');
            this.addTerminalLine('', '• ファイル管理機能（全日程の技術統合）');
            this.addTerminalLine('', '');
            this.addTerminalLine('', 'create-admin-tool コマンドで開始しましょう！');
        }, 1500);
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
            case 'create-admin-tool':
                this.handleCreateAdminTool();
                break;
            case 'launch-admin':
                this.handleLaunchAdmin();
                break;
            case 'system-info':
                this.handleSystemInfo();
                break;
            case 'test-functions':
                this.handleTestFunctions();
                break;
            case 'generate-certificate':
                this.handleGenerateCertificate();
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
            case 'history':
                this.handleHistory();
                break;
            default:
                this.handleUnknownCommand(cmd);
        }
    }
    
    handleCreateAdminTool() {
        if (this.adminToolCreated) {
            this.addTerminalLine('', 'システム管理ツールは既に作成されています。', 'output-text');
            this.addTerminalLine('', 'launch-admin コマンドで起動してください。', 'hint-text');
            return;
        }
        
        this.addTerminalLine('', '=== Linux Quest システム管理ツール作成中 ===', 'admin-output');
        
        // アニメーション付きで進行状況を表示
        const steps = [
            '📊 システム情報モジュールを初期化中...',
            '⚡ プロセス監視モジュールを構築中...',\n            '📋 ログ解析エンジンを設定中...',\n            '💾 バックアップシステムを組み込み中...',\n            '📁 ファイル管理機能を統合中...',\n            '🧹 システムクリーンアップ機能を追加中...',\n            '🎨 ユーザーインターフェースを構築中...',\n            '✅ 全機能の統合テスト実行中...'
        ];
        
        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < steps.length) {
                this.addTerminalLine('', steps[currentStep], 'success-text');
                currentStep++;
            } else {
                clearInterval(stepInterval);
                this.completeAdminToolCreation();
            }
        }, 800);
    }
    
    completeAdminToolCreation() {
        this.adminToolCreated = true;
        
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '🎉 Linux Quest システム管理ツールの作成が完了しました！', 'admin-output');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '統合された機能：', 'output-text');
        this.addTerminalLine('', '• システム情報表示 - リアルタイム監視', 'output-text');
        this.addTerminalLine('', '• プロセス監視 - CPU・メモリ使用率', 'output-text');
        this.addTerminalLine('', '• ログ解析 - 自動エラー検出', 'output-text');
        this.addTerminalLine('', '• バックアップシステム - 自動化対応', 'output-text');
        this.addTerminalLine('', '• ファイル管理 - 権限・整理機能', 'output-text');
        this.addTerminalLine('', '• システムクリーンアップ - 最適化機能', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', 'launch-admin コマンドでGUIツールを起動できます！', 'hint-text');
        
        this.completeTask('task-create-admin-tool');
        this.updateSageMessage('見事だ！君はついに全ての技術を統合したシステム管理ツールを完成させた。これこそが真のLinuxマスターの証だ！');
        this.updateHint('launch-admin でGUIツールを起動し、各機能をテストしてみましょう。');
    }
    
    handleLaunchAdmin() {
        if (!this.adminToolCreated) {
            this.addTerminalLine('', 'エラー: システム管理ツールが作成されていません。', 'error-text');
            this.addTerminalLine('', 'create-admin-tool コマンドで先にツールを作成してください。', 'hint-text');
            return;
        }
        
        this.addTerminalLine('', '🚀 Linux Quest システム管理ツールを起動中...', 'admin-output');
        this.addTerminalLine('', 'GUIインターフェースが開きました！', 'success-text');
        
        setTimeout(() => {
            this.adminToolInterface.style.display = 'block';
            
            if (!this.completedTasks.has('task-menu-system')) {
                this.completeTask('task-menu-system');
                this.updateSageMessage('完璧だ！メニューシステムが動作している。各機能をクリックして動作を確認してみよう。');
                this.updateHint('左側のメニューから各機能をクリックして、全ての機能をテストしてみましょう。');
            }
        }, 1000);
    }
    
    executeAdminFunction(functionName) {
        let displayContent = '';
        
        switch (functionName) {
            case 'system-info':
                displayContent = this.generateSystemInfoDisplay();
                if (!this.completedTasks.has('task-system-info')) {
                    this.completeTask('task-system-info');
                    this.addTerminalLine('', '✅ システム情報表示機能が正常に動作しました', 'success-text');
                }
                break;
                
            case 'process-monitor':
                displayContent = this.generateProcessMonitorDisplay();
                if (!this.completedTasks.has('task-process-monitor')) {
                    this.completeTask('task-process-monitor');
                    this.addTerminalLine('', '✅ プロセス監視機能が正常に動作しました', 'success-text');
                }
                break;
                
            case 'log-analysis':
                displayContent = this.generateLogAnalysisDisplay();
                if (!this.completedTasks.has('task-log-analysis')) {
                    this.completeTask('task-log-analysis');
                    this.addTerminalLine('', '✅ ログ解析機能が正常に動作しました', 'success-text');
                }
                break;
                
            case 'backup':
                displayContent = this.generateBackupDisplay();
                if (!this.completedTasks.has('task-backup-system')) {
                    this.completeTask('task-backup-system');
                    this.addTerminalLine('', '✅ バックアップシステムが正常に動作しました', 'success-text');
                }
                break;
                
            case 'file-manager':
                displayContent = this.generateFileManagerDisplay();
                if (!this.completedTasks.has('task-file-management')) {
                    this.completeTask('task-file-management');
                    this.addTerminalLine('', '✅ ファイル管理機能が正常に動作しました', 'success-text');
                }
                break;
                
            case 'cleanup':
                displayContent = this.generateCleanupDisplay();
                break;
        }
        
        this.adminDisplay.innerHTML = displayContent;
        
        // 全機能テスト完了チェック
        this.checkAllFunctionsComplete();
    }
    
    generateSystemInfoDisplay() {
        return `
            <div style="color: #e0e0e0;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">📊 システム情報</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="color: #00ff00; margin-bottom: 10px;">基本情報</h4>
                        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                            <div>ホスト名: linux-quest-server</div>
                            <div>OS: Linux Quest OS v1.0</div>
                            <div>カーネル: 5.15.0-quest</div>
                            <div>アーキテクチャ: x86_64</div>
                            <div>稼働時間: ${this.getFormattedUptime()}</div>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #00ff00; margin-bottom: 10px;">リソース使用状況</h4>
                        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                            <div>CPU使用率: 23.5%</div>
                            <div>メモリ使用率: 67.2% (5.4GB/8GB)</div>
                            <div>ディスク使用率: 45.8% (458GB/1TB)</div>
                            <div>ネットワーク: 125.3 MB/s</div>
                            <div>負荷平均: 1.23, 1.45, 1.67</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="color: #00ff00; margin-bottom: 10px;">接続中のユーザー</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace;">
                        quest    tty1     2024-07-29 10:00<br>
                        admin    pts/0    2024-07-29 09:45<br>
                        guest    pts/1    2024-07-29 10:30
                    </div>
                </div>
            </div>
        `;
    }
    
    generateProcessMonitorDisplay() {
        return `
            <div style="color: #e0e0e0;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">⚡ プロセス監視</h3>
                <div>
                    <h4 style="color: #00ff00; margin-bottom: 10px;">CPU使用率トップ5</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 14px;">
                        <div style="display: grid; grid-template-columns: 80px 120px 80px 80px 100px; gap: 10px; border-bottom: 1px solid #ffd700; padding-bottom: 5px; margin-bottom: 10px;">
                            <div style="color: #ffd700;">PID</div>
                            <div style="color: #ffd700;">プロセス名</div>
                            <div style="color: #ffd700;">CPU%</div>
                            <div style="color: #ffd700;">MEM%</div>
                            <div style="color: #ffd700;">ユーザー</div>
                        </div>
                        ${this.systemData.processes.map(proc => `
                            <div style="display: grid; grid-template-columns: 80px 120px 80px 80px 100px; gap: 10px; margin-bottom: 5px;">
                                <div>${proc.pid}</div>
                                <div>${proc.name}</div>
                                <div style="color: ${proc.cpu > 10 ? '#ff4444' : '#00ff00'};">${proc.cpu}%</div>
                                <div style="color: ${proc.memory > 20 ? '#ff4444' : '#00ff00'};">${proc.memory}%</div>
                                <div>${proc.user}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="color: #00ff00; margin-bottom: 10px;">システム統計</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                        <div>総プロセス数: 156</div>
                        <div>実行中: 3</div>
                        <div>スリープ: 153</div>
                        <div>ゾンビ: 0</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateLogAnalysisDisplay() {
        return `
            <div style="color: #e0e0e0;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">📋 ログ解析</h3>
                <div>
                    <h4 style="color: #00ff00; margin-bottom: 10px;">最新のシステムログ</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; max-height: 200px; overflow-y: auto;">
                        ${this.systemData.logs.map(log => {
                            let color = '#e0e0e0';
                            if (log.includes('ERROR')) color = '#ff4444';
                            else if (log.includes('WARN')) color = '#ffa500';
                            else if (log.includes('INFO')) color = '#00ff00';
                            return `<div style="color: ${color}; margin-bottom: 3px;">${log}</div>`;
                        }).join('')}
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="color: #00ff00; margin-bottom: 10px;">ログ統計（過去24時間）</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                            <div style="text-align: center;">
                                <div style="color: #00ff00; font-size: 24px;">234</div>
                                <div>INFO</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #ffa500; font-size: 24px;">12</div>
                                <div>WARN</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #ff4444; font-size: 24px;">3</div>
                                <div>ERROR</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateBackupDisplay() {
        return `
            <div style="color: #e0e0e0;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">💾 バックアップシステム</h3>
                <div>
                    <h4 style="color: #00ff00; margin-bottom: 10px;">バックアップ状況</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                        <div style="margin-bottom: 10px;">
                            <div>最新バックアップ: 2024-07-29 10:00:00</div>
                            <div>バックアップサイズ: 2.1GB</div>
                            <div>次回自動バックアップ: 2024-07-30 02:00:00</div>
                            <div style="color: #00ff00;">ステータス: 正常</div>
                        </div>
                        <div style="margin-top: 15px;">
                            <button style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 10px; cursor: pointer;">手動バックアップ実行</button>
                            <button style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">バックアップ復元</button>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="color: #00ff00; margin-bottom: 10px;">バックアップ履歴</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 14px;">
                        <div style="display: grid; grid-template-columns: 150px 100px 100px 150px; gap: 10px; border-bottom: 1px solid #ffd700; padding-bottom: 5px; margin-bottom: 10px;">
                            <div style="color: #ffd700;">日時</div>
                            <div style="color: #ffd700;">サイズ</div>
                            <div style="color: #ffd700;">種類</div>
                            <div style="color: #ffd700;">ステータス</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 150px 100px 100px 150px; gap: 10px; margin-bottom: 5px;">
                            <div>07-29 10:00</div>
                            <div>2.1GB</div>
                            <div>フル</div>
                            <div style="color: #00ff00;">成功</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 150px 100px 100px 150px; gap: 10px; margin-bottom: 5px;">
                            <div>07-28 10:00</div>
                            <div>1.8GB</div>
                            <div>フル</div>
                            <div style="color: #00ff00;">成功</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 150px 100px 100px 150px; gap: 10px; margin-bottom: 5px;">
                            <div>07-27 10:00</div>
                            <div>2.0GB</div>
                            <div>フル</div>
                            <div style="color: #00ff00;">成功</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateFileManagerDisplay() {
        return `
            <div style="color: #e0e0e0;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">📁 ファイル管理</h3>
                <div>
                    <h4 style="color: #00ff00; margin-bottom: 10px;">現在のディレクトリ: /home/quest</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 14px;">
                        <div style="display: grid; grid-template-columns: 200px 100px 150px 100px; gap: 10px; border-bottom: 1px solid #ffd700; padding-bottom: 5px; margin-bottom: 10px;">
                            <div style="color: #ffd700;">ファイル名</div>
                            <div style="color: #ffd700;">サイズ</div>
                            <div style="color: #ffd700;">更新日時</div>
                            <div style="color: #ffd700;">権限</div>
                        </div>
                        ${this.systemData.files.map(file => `
                            <div style="display: grid; grid-template-columns: 200px 100px 150px 100px; gap: 10px; margin-bottom: 5px;">
                                <div style="color: ${file.name.endsWith('/') ? '#00ffff' : '#ffffff'};">${file.name}</div>
                                <div>${file.size}</div>
                                <div>${file.modified}</div>
                                <div style="color: #00ff00;">rwxr-xr-x</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="color: #00ff00; margin-bottom: 10px;">ディスク使用量分析</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                        <div style="margin-bottom: 10px;">
                            <div>総容量: 1TB</div>
                            <div>使用量: 458GB (45.8%)</div>
                            <div>空き容量: 542GB</div>
                        </div>
                        <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #00ff00, #ffa500); width: 45.8%; height: 100%;"></div>
                        </div>
                        <div style="margin-top: 10px;">
                            <button style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-right: 10px; cursor: pointer;">不要ファイル削除</button>
                            <button style="background: #17a2b8; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">ディスク最適化</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateCleanupDisplay() {
        return `
            <div style="color: #e0e0e0;">
                <h3 style="color: #ffd700; margin-bottom: 20px;">🧹 システムクリーンアップ</h3>
                <div>
                    <h4 style="color: #00ff00; margin-bottom: 10px;">クリーンアップ項目</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                <input type="checkbox" checked style="margin-right: 10px;">
                                一時ファイル (234MB)
                            </label>
                            <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                <input type="checkbox" checked style="margin-right: 10px;">
                                古いログファイル (156MB)
                            </label>
                            <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                <input type="checkbox" style="margin-right: 10px;">
                                パッケージキャッシュ (89MB)
                            </label>
                            <label style="display: flex; align-items: center; margin-bottom: 10px;">
                                <input type="checkbox" style="margin-right: 10px;">
                                ゴミ箱 (45MB)
                            </label>
                        </div>
                        <div>
                            <button style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 4px; margin-right: 10px; cursor: pointer;">クリーンアップ実行</button>
                            <button style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer;">スケジュール設定</button>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4 style="color: #00ff00; margin-bottom: 10px;">最適化提案</h4>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                        <div style="margin-bottom: 10px; padding: 10px; background: rgba(40, 167, 69, 0.2); border-left: 4px solid #28a745; border-radius: 4px;">
                            💡 定期的な自動クリーンアップを設定することで、システムパフォーマンスを維持できます
                        </div>
                        <div style="margin-bottom: 10px; padding: 10px; background: rgba(255, 193, 7, 0.2); border-left: 4px solid #ffc107; border-radius: 4px;">
                            ⚠️ ログファイルが大きくなっています。ローテーション設定を確認してください
                        </div>
                        <div style="padding: 10px; background: rgba(23, 162, 184, 0.2); border-left: 4px solid #17a2b8; border-radius: 4px;">
                            ℹ️ ディスク使用量が50%を超えた場合、追加のクリーンアップを実行することをお勧めします
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    checkAllFunctionsComplete() {
        const requiredTasks = ['task-system-info', 'task-process-monitor', 'task-log-analysis', 'task-backup-system', 'task-file-management'];
        const allComplete = requiredTasks.every(task => this.completedTasks.has(task));
        
        if (allComplete && !this.completedTasks.has('task-graduation')) {
            setTimeout(() => {
                this.completeTask('task-graduation');
                this.showGraduationMessage();
            }, 1000);
        }
    }
    
    showGraduationMessage() {
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '🎓🎓🎓 Linux Quest 完全修了！ 🎓🎓🎓', 'admin-output', 'color: #ffd700; font-weight: bold; font-size: 18px;');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '君は7日間の旅路を通じて、以下の技術をマスターした：', 'success-text');
        this.addTerminalLine('', '✅ Day1: ターミナル操作の基礎', 'output-text');
        this.addTerminalLine('', '✅ Day2: ディレクトリとファイル操作', 'output-text');
        this.addTerminalLine('', '✅ Day3: ファイル閲覧・編集技術', 'output-text');
        this.addTerminalLine('', '✅ Day4: 権限管理システム', 'output-text');
        this.addTerminalLine('', '✅ Day5: シェルスクリプト作成', 'output-text');
        this.addTerminalLine('', '✅ Day6: パイプとリダイレクト', 'output-text');
        this.addTerminalLine('', '✅ Day7: 総合システム管理ツール', 'output-text');
        this.addTerminalLine('', '', 'output-text');
        this.addTerminalLine('', '🏆 君は今や真のLinuxマスターだ！', 'admin-output');
        this.addTerminalLine('', 'generate-certificate で修了証明書を生成できます', 'hint-text');
        
        this.updateSageMessage('完璧だ！君は見事にLinux Questを完走した。今や君は企業が求める貴重な人材だ。DevOps、SRM、システム管理者...多くの道が君の前に開かれている！');
        this.updateHint('🎊 Linux Quest修了おめでとうございます！generate-certificate で修了証明書を作成しましょう。');
        
        // メイン画面に戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(7);
        }
    }
    
    handleGenerateCertificate() {
        this.addTerminalLine('', '📜 修了証明書を生成中...', 'admin-output');
        
        setTimeout(() => {
            this.showCertificate();
        }, 1500);
    }
    
    showCertificate() {
        const certificate = document.createElement('div');
        certificate.className = 'graduation-certificate';
        certificate.innerHTML = `
            <div class="certificate-title">🎓 修了証明書 🎓</div>
            <div class="certificate-text">
                Linux Quest - 7日間の冒険<br><br>
                これにより、下記の者がLinux Questを完走し、<br>
                Linuxコマンドライン操作の実践的技能を習得したことを証明します。<br><br>
                修了者: <strong>Linux Quest Adventurer</strong><br>
                修了日: <strong>${new Date().toLocaleDateString('ja-JP')}</strong><br><br>
                習得スキル:<br>
                ✅ ターミナル操作 ✅ ファイル・ディレクトリ操作<br>
                ✅ ファイル閲覧・編集 ✅ 権限管理<br>
                ✅ シェルスクリプト ✅ パイプ・リダイレクト<br>
                ✅ システム管理ツール開発
            </div>
            <div class="certificate-signature">
                Linux Quest 運営委員会<br>
                認定: Claude AI Mentor 🧙‍♂️
            </div>
            <button onclick="this.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(certificate);
        
        this.addTerminalLine('', '🎉 修了証明書が生成されました！', 'success-text');
        this.addTerminalLine('', '君の7日間の学習成果が正式に認定されました。', 'admin-output');
    }
    
    getFormattedUptime() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        return `${hours}時間${minutes}分${seconds}秒`;
    }
    
    handleSystemInfo() {
        this.addTerminalLine('', '=== システム情報 ===', 'output-text');
        this.addTerminalLine('', 'ホスト名: linux-quest-server', 'output-text');
        this.addTerminalLine('', 'OS: Linux Quest OS v1.0', 'output-text');
        this.addTerminalLine('', `稼働時間: ${this.getFormattedUptime()}`, 'output-text');
        this.addTerminalLine('', 'CPU使用率: 23.5%', 'output-text');
        this.addTerminalLine('', 'メモリ使用率: 67.2%', 'output-text');
    }
    
    handleTestFunctions() {
        this.addTerminalLine('', '=== 機能テスト実行中 ===', 'admin-output');
        this.addTerminalLine('', '✅ システム情報表示: 正常', 'success-text');
        this.addTerminalLine('', '✅ プロセス監視: 正常', 'success-text');
        this.addTerminalLine('', '✅ ログ解析: 正常', 'success-text');
        this.addTerminalLine('', '✅ バックアップシステム: 正常', 'success-text');
        this.addTerminalLine('', '✅ ファイル管理: 正常', 'success-text');
        this.addTerminalLine('', '✅ システムクリーンアップ: 正常', 'success-text');
        this.addTerminalLine('', '🎉 全機能が正常に動作しています！', 'admin-output');
    }
    
    handleLs() {
        this.addTerminalLine('', 'admin_tool.sh', 'output-text', 'color: #00ff00;');
        this.addTerminalLine('', 'logs/', 'output-text', 'color: #00ffff;');
        this.addTerminalLine('', 'backups/', 'output-text', 'color: #00ffff;');
        this.addTerminalLine('', 'config.txt', 'output-text');
        this.addTerminalLine('', 'data.db', 'output-text');
    }
    
    handlePwd() {
        this.addTerminalLine('', this.currentPath, 'output-text');
    }
    
    handleClear() {
        this.terminal.innerHTML = '';
    }
    
    handleHelp() {
        this.addTerminalLine('', '=== Day7 最終試練 利用可能なコマンド ===', 'output-text');
        this.addTerminalLine('', 'create-admin-tool - 統合システム管理ツールを作成', 'output-text');
        this.addTerminalLine('', 'launch-admin - GUIツールを起動', 'output-text');
        this.addTerminalLine('', 'system-info - システム情報を表示', 'output-text');
        this.addTerminalLine('', 'test-functions - 全機能をテスト', 'output-text');
        this.addTerminalLine('', 'generate-certificate - 修了証明書を生成', 'output-text');
        this.addTerminalLine('', 'ls - ファイル一覧表示', 'output-text');
        this.addTerminalLine('', 'pwd - 現在のディレクトリ表示', 'output-text');
        this.addTerminalLine('', 'clear - ターミナルクリア', 'output-text');
        this.addTerminalLine('', 'history - コマンド履歴表示', 'output-text');
    }
    
    handleHistory() {
        this.addTerminalLine('', 'コマンド履歴:', 'output-text');
        this.commandHistory.forEach((cmd, index) => {
            this.addTerminalLine('', `${(index + 1).toString().padStart(3)}: ${cmd}`, 'output-text');
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
        textSpan.innerHTML = text; // HTMLを許可（改行のため）
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
    
    showCompletionEffect() {
        const effect = document.createElement('div');
        effect.textContent = '⚔️';
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 3em;
            pointer-events: none;
            animation: sparkle 1.5s ease-out forwards;
            z-index: 1000;
            text-shadow: 0 0 20px #ffd700;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 1500);
        
        // CSS animation for sparkle effect
        if (!document.getElementById('sparkle-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-style';
            style.textContent = `
                @keyframes sparkle {
                    0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(2) rotate(180deg); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
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
            window.location.href = '../index.html?completed=7';
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
    new Day7LinuxQuest();
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
    if (game && !localStorage.getItem('day7-completed')) {
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
        localStorage.setItem('day7-progress', JSON.stringify(currentProgress));
        
        // メイン画面に戻る
        window.location.href = '../index.html';
    }
}
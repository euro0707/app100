# 重要な抜けの完全設計

## 1. エラーハンドリングシステム設計

### グローバルエラーハンドラー
```javascript
// portfolio/js/error-handler.js
class GlobalErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10;
        this.init();
    }
    
    init() {
        // JavaScript エラー
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        // Promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || event.reason,
                promise: event.promise
            });
            event.preventDefault();
        });
        
        // ネットワークエラー
        window.addEventListener('offline', () => {
            this.showNetworkError();
        });
        
        window.addEventListener('online', () => {
            this.hideNetworkError();
        });
    }
    
    handleError(errorInfo) {
        this.errorCount++;
        
        // ログ記録
        console.error('Error caught:', errorInfo);
        
        // エラー頻発時の処理
        if (this.errorCount > this.maxErrors) {
            this.showCriticalError();
            return;
        }
        
        // エラータイプ別処理
        switch (errorInfo.type) {
            case 'javascript':
                this.showJavaScriptError(errorInfo);
                break;
            case 'promise':
                this.showPromiseError(errorInfo);
                break;
            default:
                this.showGenericError(errorInfo);
        }
    }
    
    showJavaScriptError(errorInfo) {
        this.showErrorMessage({
            title: 'プログラムエラーが発生しました',
            message: 'ページの一部機能が正常に動作しない可能性があります。',
            actions: [
                { text: 'ページを再読み込み', action: () => location.reload() },
                { text: '続行', action: () => this.hideError() }
            ]
        });
    }
    
    showPromiseError(errorInfo) {
        this.showErrorMessage({
            title: 'データ読み込みエラー',
            message: 'アプリ情報の読み込みに失敗しました。',
            actions: [
                { text: '再試行', action: () => this.retryLastOperation() },
                { text: 'ページを再読み込み', action: () => location.reload() }
            ]
        });
    }
    
    showNetworkError() {
        this.showErrorMessage({
            title: 'ネットワーク接続エラー',
            message: 'インターネット接続を確認してください。',
            persistent: true
        });
    }
    
    showCriticalError() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 20px;
                background: #f5f5f5;
                font-family: Arial, sans-serif;
            ">
                <h1 style="color: #d32f2f;">🚨 重大なエラーが発生しました</h1>
                <p>申し訳ございませんが、アプリケーションで重大な問題が発生しました。</p>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    font-size: 16px;
                    background: #1976d2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">ページを再読み込み</button>
            </div>
        `;
    }
    
    showErrorMessage(config) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `
            <div class="error-overlay">
                <div class="error-dialog">
                    <h3>${config.title}</h3>
                    <p>${config.message}</p>
                    <div class="error-actions">
                        ${config.actions ? config.actions.map(action => 
                            `<button onclick="this.closest('.error-message').remove(); (${action.action.toString()})()">${action.text}</button>`
                        ).join('') : '<button onclick="this.closest(\'.error-message\').remove()">閉じる</button>'}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorEl);
        
        // 自動消去（persistent でない場合）
        if (!config.persistent) {
            setTimeout(() => {
                if (errorEl.parentNode) {
                    errorEl.remove();
                }
            }, 10000);
        }
    }
}

// 初期化
const errorHandler = new GlobalErrorHandler();
```

### エラーメッセージCSS
```css
/* portfolio/css/error-styles.css */
.error-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
}

.error-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
}

.error-dialog {
    background: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 500px;
    margin: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.error-dialog h3 {
    margin: 0 0 15px 0;
    color: #d32f2f;
}

.error-dialog p {
    margin: 0 0 20px 0;
    line-height: 1.5;
}

.error-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.error-actions button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
}

.error-actions button:first-child {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
}
```

## 2. アクセシビリティフレームワーク設計

### 基本HTML構造テンプレート
```html
<!-- portfolio/templates/accessible-base.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>100 Apps Journey - ポートフォリオ</title>
    
    <!-- アクセシビリティメタ情報 -->
    <meta name="description" content="100個のアプリ作成チャレンジ。プログラミング学習の記録とポートフォリオ。">
    <meta name="keywords" content="プログラミング, アプリ開発, ポートフォリオ, 学習記録">
    <meta name="author" content="euro0707">
    
    <!-- スキップリンク用CSS -->
    <style>
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
        }
        .skip-link:focus {
            top: 6px;
        }
    </style>
</head>
<body>
    <!-- スキップリンク -->
    <a href="#main-content" class="skip-link">メインコンテンツにスキップ</a>
    
    <!-- ページ構造 -->
    <header role="banner">
        <nav role="navigation" aria-label="メインナビゲーション">
            <!-- ナビゲーション -->
        </nav>
    </header>
    
    <main id="main-content" role="main" tabindex="-1">
        <!-- メインコンテンツ -->
    </main>
    
    <footer role="contentinfo">
        <!-- フッター -->
    </footer>
</body>
</html>
```

### アクセシビリティヘルパークラス
```javascript
// portfolio/js/accessibility.js
class AccessibilityHelper {
    static init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupColorContrastValidation();
    }
    
    static setupKeyboardNavigation() {
        // Tab順序の管理
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.highlightFocusedElement();
            }
            
            // Enterキーでクリック可能要素を活性化
            if (e.key === 'Enter' && e.target.getAttribute('role') === 'button') {
                e.target.click();
            }
        });
    }
    
    static setupFocusManagement() {
        // フォーカス可能要素の特定
        const focusableElements = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[role="button"]:not([disabled])'
        ].join(', ');
        
        // フォーカストラップ（モーダル用）
        this.createFocusTrap = (container) => {
            const focusable = container.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        };
    }
    
    static setupScreenReaderSupport() {
        // 動的コンテンツの通知
        this.announceToScreenReader = (message, priority = 'polite') => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', priority);
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        };
        
        // ページ読み込み完了の通知
        window.addEventListener('load', () => {
            this.announceToScreenReader('ページの読み込みが完了しました');
        });
    }
    
    static setupColorContrastValidation() {
        // 最低限のカラーコントラスト確保
        const style = document.createElement('style');
        style.textContent = `
            /* 高コントラストモード対応 */
            @media (prefers-contrast: high) {
                * {
                    border-color: ButtonText !important;
                }
                .app-card {
                    border: 2px solid ButtonText !important;
                }
            }
            
            /* 色覚特性対応 */
            .status-completed { background: #2e7d32; color: white; }
            .status-pending { background: #f57c00; color: white; }
            .status-error { background: #c62828; color: white; }
            
            /* スクリーンリーダー専用 */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    static validateAccessibility() {
        const errors = [];
        
        // 画像のalt属性チェック
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('alt')) {
                errors.push(`画像にalt属性がありません: ${img.src}`);
            }
        });
        
        // 見出しの階層チェック
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let lastLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                errors.push(`見出しレベルがスキップされています: ${heading.textContent}`);
            }
            lastLevel = level;
        });
        
        // フォーカス可能要素のラベルチェック
        document.querySelectorAll('button, input, select, textarea').forEach(el => {
            const hasLabel = el.labels?.length > 0 || 
                            el.hasAttribute('aria-label') || 
                            el.hasAttribute('aria-labelledby');
            if (!hasLabel) {
                errors.push(`フォーム要素にラベルがありません: ${el.outerHTML.substring(0, 50)}`);
            }
        });
        
        if (errors.length > 0) {
            console.warn('アクセシビリティの問題:', errors);
        }
        
        return errors;
    }
}

// 初期化
AccessibilityHelper.init();
```

## 3. データ検証システム設計

### 包括的データバリデーター
```javascript
// portfolio/js/data-validator.js
class DataValidator {
    static schemas = {
        app: {
            id: { type: 'string', pattern: /^\d{3}$/, required: true },
            title: { type: 'string', minLength: 1, maxLength: 100, required: true },
            description: { type: 'string', minLength: 10, maxLength: 500, required: true },
            category: { 
                type: 'string', 
                enum: ['education', 'game', 'utility', 'creative'], 
                required: true 
            },
            technologies: { type: 'array', minItems: 1, maxItems: 10, required: true },
            liveUrl: { type: 'url', required: false },
            githubUrl: { type: 'url', required: false },
            completedDate: { type: 'date', required: true },
            features: { type: 'array', minItems: 1, maxItems: 10, required: true },
            status: { 
                type: 'string', 
                enum: ['completed', 'in-progress', 'planned'], 
                required: true 
            }
        }
    };
    
    static validate(data, schemaName) {
        const schema = this.schemas[schemaName];
        if (!schema) {
            throw new Error(`Unknown schema: ${schemaName}`);
        }
        
        const errors = [];
        const warnings = [];
        
        // 必須フィールドチェック
        for (const [field, rules] of Object.entries(schema)) {
            if (rules.required && (data[field] === undefined || data[field] === null)) {
                errors.push(`必須フィールドが不足: ${field}`);
                continue;
            }
            
            if (data[field] !== undefined && data[field] !== null) {
                const fieldErrors = this.validateField(data[field], rules, field);
                errors.push(...fieldErrors);
            }
        }
        
        // 追加の整合性チェック
        if (schemaName === 'app') {
            const appErrors = this.validateAppConsistency(data);
            errors.push(...appErrors);
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    static validateField(value, rules, fieldName) {
        const errors = [];
        
        // 型チェック
        if (rules.type) {
            if (!this.checkType(value, rules.type)) {
                errors.push(`${fieldName}: 型が不正です (期待: ${rules.type})`);
                return errors; // 型が違う場合は他のチェックをスキップ
            }
        }
        
        // 文字列の長さチェック
        if (rules.type === 'string') {
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${fieldName}: 最低${rules.minLength}文字必要です`);
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`${fieldName}: ${rules.maxLength}文字以下である必要があります`);
            }
            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push(`${fieldName}: 形式が不正です`);
            }
        }
        
        // 配列のチェック
        if (rules.type === 'array') {
            if (rules.minItems && value.length < rules.minItems) {
                errors.push(`${fieldName}: 最低${rules.minItems}個の項目が必要です`);
            }
            if (rules.maxItems && value.length > rules.maxItems) {
                errors.push(`${fieldName}: ${rules.maxItems}個以下である必要があります`);
            }
        }
        
        // 列挙値チェック
        if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`${fieldName}: 有効な値は ${rules.enum.join(', ')} です`);
        }
        
        // URL チェック
        if (rules.type === 'url') {
            try {
                new URL(value);
            } catch {
                errors.push(`${fieldName}: 有効なURLではありません`);
            }
        }
        
        // 日付チェック
        if (rules.type === 'date') {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                errors.push(`${fieldName}: 有効な日付ではありません`);
            }
        }
        
        return errors;
    }
    
    static checkType(value, expectedType) {
        switch (expectedType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'array':
                return Array.isArray(value);
            case 'object':
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            case 'url':
                return typeof value === 'string';
            case 'date':
                return typeof value === 'string';
            default:
                return true;
        }
    }
    
    static validateAppConsistency(app) {
        const errors = [];
        
        // IDとURLの整合性チェック
        if (app.liveUrl && app.id) {
            const expectedPath = `/apps/${app.id}-`;
            if (!app.liveUrl.includes(expectedPath)) {
                errors.push('liveUrlとIDが整合していません');
            }
        }
        
        // 完了日の妥当性チェック
        if (app.completedDate) {
            const completedDate = new Date(app.completedDate);
            const today = new Date();
            if (completedDate > today) {
                errors.push('完了日が未来の日付になっています');
            }
        }
        
        // ステータスと完了日の整合性
        if (app.status === 'completed' && !app.completedDate) {
            errors.push('完了ステータスなのに完了日がありません');
        }
        
        return errors;
    }
    
    static validateAppCollection(apps) {
        const errors = [];
        const ids = new Set();
        
        apps.forEach((app, index) => {
            // 個別アプリの検証
            const validation = this.validate(app, 'app');
            if (!validation.valid) {
                errors.push(`アプリ${index + 1}: ${validation.errors.join(', ')}`);
            }
            
            // ID重複チェック
            if (ids.has(app.id)) {
                errors.push(`重複するID: ${app.id}`);
            }
            ids.add(app.id);
        });
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
```

## 4. 実装チェックリスト

### 実装前必須確認項目
```markdown
## Phase 1: 設計完了確認

### エラーハンドリング
- [ ] GlobalErrorHandler クラス設計完了
- [ ] JavaScript エラー処理定義
- [ ] Promise rejection 処理定義
- [ ] ネットワークエラー処理定義
- [ ] ユーザーフレンドリーエラー表示設計
- [ ] エラーCSS設計完了

### アクセシビリティ
- [ ] 基本HTML構造テンプレート作成
- [ ] スキップリンク設計
- [ ] ARIA属性使用方針決定
- [ ] キーボードナビゲーション設計
- [ ] スクリーンリーダー対応設計
- [ ] 色覚特性対応設計

### データ検証
- [ ] DataValidator クラス設計完了
- [ ] アプリデータスキーマ定義
- [ ] 入力値検証ルール定義
- [ ] 整合性チェック定義
- [ ] エラーメッセージ定義

### セキュリティ
- [ ] CSP設定完了
- [ ] XSS防止対策設計
- [ ] セキュアヘッダー設定
- [ ] データサニタイズ方針決定

## Phase 2: 実装時必須項目

### ファイル構造
- [ ] portfolio/js/error-handler.js
- [ ] portfolio/js/accessibility.js  
- [ ] portfolio/js/data-validator.js
- [ ] portfolio/css/error-styles.css
- [ ] portfolio/css/accessibility.css

### 基本機能
- [ ] エラーハンドラー初期化
- [ ] アクセシビリティヘルパー初期化
- [ ] データバリデーター組み込み
- [ ] 7個アプリデータ検証

### テスト項目
- [ ] JavaScript エラー発生時の動作確認
- [ ] ネットワーク切断時の動作確認
- [ ] キーボード操作での全機能利用確認
- [ ] スクリーンリーダーでの動作確認
- [ ] 不正データ入力時の動作確認

## Phase 3: デプロイ前確認

### 品質保証
- [ ] 全エラーケース動作確認
- [ ] アクセシビリティ検証ツール実行
- [ ] データ整合性確認
- [ ] セキュリティ設定確認
- [ ] レスポンシブ動作確認

### パフォーマンス
- [ ] ページ読み込み速度測定
- [ ] 大量データ処理確認
- [ ] メモリリーク確認

### ドキュメント
- [ ] エラー対応手順書作成
- [ ] メンテナンス手順書作成
- [ ] トラブルシューティングガイド作成
```

## 結論

**全ての重要な抜けを事前に完全設計しました。**

これで実装時に「抜けを同時に埋める」必要がなくなり、
安全に実装を進められます。

実装を開始しますか？
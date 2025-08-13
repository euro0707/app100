# 100 Apps Journey - セキュリティ設計書

## 1. GitHub Pages基盤セキュリティ

### HTTPS強制設定
```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v3
      - name: Setup Pages
        uses: actions/configure-pages@v2
        with:
          enablement: true
          static_site_generator: none
```

### リポジトリアクセス制御
- **Public Repository**: 教育目的でオープンソース
- **Branch Protection**: main ブランチへの直接push禁止
- **Review Required**: Pull Request必須 (個人開発のため自己レビュー)

## 2. Webアプリケーションセキュリティ

### Content Security Policy (CSP)
```html
<!-- portfolio/index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.github.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### XSS (Cross-Site Scripting) 防止
```javascript
// portfolio/script.js
class SecurityUtils {
    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    static escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    
    static validateInput(input, type = 'text') {
        const patterns = {
            text: /^[a-zA-Z0-9\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\-_.,!?]+$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };
        return patterns[type] ? patterns[type].test(input) : false;
    }
}
```

### セキュアヘッダー設定
```html
<!-- 全HTMLファイル共通 -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()">
```

## 3. データセキュリティ

### 個人情報保護
```javascript
// 個人情報の取り扱い規則
const DataProtection = {
    // 収集する情報
    allowedData: [
        'アプリ使用統計（匿名）',
        'ブラウザ情報（分析用）',
        'アクセスログ（GitHub Pages標準）'
    ],
    
    // 収集しない情報
    forbiddenData: [
        '個人名',
        'メールアドレス',
        'IPアドレス（個別識別）',
        'Cookie（必須以外）',
        'ローカルストレージの個人情報'
    ],
    
    // データ保持期間
    retentionPolicy: {
        analytics: '30日',
        logs: 'GitHub Pages標準',
        userPreferences: 'ブラウザローカルのみ'
    }
};
```

### ローカルストレージ安全利用
```javascript
// portfolio/script.js
class SecureStorage {
    static setItem(key, value) {
        try {
            // データ検証
            if (!key || typeof key !== 'string') return false;
            
            // サイズ制限 (5MB以下)
            const serialized = JSON.stringify(value);
            if (serialized.length > 5 * 1024 * 1024) return false;
            
            // 暗号化（基本的な難読化）
            const encoded = btoa(serialized);
            localStorage.setItem(`app100_${key}`, encoded);
            return true;
        } catch (e) {
            console.warn('Storage error:', e);
            return false;
        }
    }
    
    static getItem(key) {
        try {
            const encoded = localStorage.getItem(`app100_${key}`);
            if (!encoded) return null;
            
            const serialized = atob(encoded);
            return JSON.parse(serialized);
        } catch (e) {
            console.warn('Storage retrieval error:', e);
            return null;
        }
    }
    
    static removeItem(key) {
        localStorage.removeItem(`app100_${key}`);
    }
    
    static clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith('app100_'))
            .forEach(key => localStorage.removeItem(key));
    }
}
```

## 4. 開発セキュリティ

### セキュアコーディング規則
```javascript
// セキュリティ チェックリスト

class SecurityChecklist {
    static codeReview = [
        // XSS防止
        '✓ 全ユーザー入力をエスケープ処理',
        '✓ innerHTML使用時はサニタイズ実施',
        '✓ eval()、Function()の使用禁止',
        
        // データ保護
        '✓ APIキー、パスワードのハードコード禁止',
        '✓ 機密データのローカルストレージ保存禁止',
        '✓ コンソール出力に機密情報なし',
        
        // 外部リソース
        '✓ 外部スクリプトの整合性検証 (SRI)',
        '✓ 信頼できるCDNのみ使用',
        '✓ HTTP通信の禁止（HTTPS必須）',
        
        // エラーハンドリング
        '✓ エラーメッセージに内部情報を含めない',
        '✓ 例外処理の適切な実装',
        '✓ フォールバック処理の安全性確認'
    ];
}
```

### 依存関係セキュリティ管理
```json
// package.json (将来の拡張時)
{
  "scripts": {
    "audit": "npm audit",
    "audit-fix": "npm audit fix",
    "security-check": "npm run audit && npm run lint-security"
  },
  "devDependencies": {
    "eslint-plugin-security": "^1.7.1",
    "audit-ci": "^6.6.1"
  }
}
```

### Git Secrets 防止
```bash
# .gitignore 強化
# 機密情報ファイル
*.key
*.pem
*.p12
.env
.env.local
.env.production
config/secrets.json

# IDEファイル
.vscode/settings.json
.idea/

# 一時ファイル
*.tmp
*.log
.DS_Store
Thumbs.db
```

## 5. アプリケーション固有セキュリティ

### 子供向けアプリの安全設計
```javascript
// 子供の安全を考慮した設計
const ChildSafetyRules = {
    // データ収集制限
    dataCollection: {
        personalInfo: false,        // 個人情報一切収集しない
        analytics: 'anonymous',     // 匿名統計のみ
        cookies: 'none',           // Cookie使用なし
        tracking: false            // トラッキング禁止
    },
    
    // 外部リンク制御
    externalLinks: {
        allowed: ['github.com'],   // 許可ドメイン
        target: '_blank',          // 新しいタブで開く
        rel: 'noopener noreferrer' // セキュア設定
    },
    
    // コンテンツ検証
    content: {
        language: 'family-friendly',
        images: 'safe-for-children',
        audio: 'age-appropriate'
    }
};
```

### ゲームセキュリティ
```javascript
// ゲーム固有のセキュリティ対策
class GameSecurity {
    static validateGameData(data) {
        // スコア改ざん防止
        const maxReasonableScore = 1000000;
        if (data.score > maxReasonableScore) return false;
        
        // 時間整合性チェック
        const minTime = 1000; // 1秒
        if (data.completionTime < minTime) return false;
        
        // レベル整合性チェック
        const maxLevel = 100;
        if (data.level > maxLevel) return false;
        
        return true;
    }
    
    static encryptProgress(progress) {
        // 簡単な暗号化でプログレス保護
        const key = 'app100game';
        let encrypted = '';
        const progressStr = JSON.stringify(progress);
        
        for (let i = 0; i < progressStr.length; i++) {
            encrypted += String.fromCharCode(
                progressStr.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        
        return btoa(encrypted);
    }
}
```

## 6. モニタリング・監査

### セキュリティ監視
```javascript
// セキュリティイベント検知
class SecurityMonitor {
    static logSecurityEvent(event, details) {
        const securityLog = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // 重要なセキュリティイベントのみログ
        const criticalEvents = [
            'xss_attempt',
            'csrf_attempt', 
            'unauthorized_access',
            'data_breach_attempt'
        ];
        
        if (criticalEvents.includes(event)) {
            console.warn('Security Event:', securityLog);
            // 将来的にはセキュリティサービスに送信
        }
    }
    
    static detectSuspiciousActivity() {
        // 異常なアクセスパターン検知
        const accessCount = this.getAccessCount();
        const timeWindow = 60000; // 1分
        
        if (accessCount > 100) {
            this.logSecurityEvent('suspicious_access', {
                count: accessCount,
                timeWindow: timeWindow
            });
        }
    }
}
```

### 定期セキュリティ監査計画
```markdown
## セキュリティ監査スケジュール

### 毎週
- [ ] GitHub dependabot alerts確認
- [ ] コードの新規追加部分セキュリティレビュー
- [ ] アクセスログ異常チェック

### 毎月
- [ ] 全アプリのセキュリティ機能テスト
- [ ] CSPポリシー見直し
- [ ] セキュリティヘッダー確認

### 四半期
- [ ] 包括的セキュリティ監査
- [ ] 脆弱性スキャン実施
- [ ] セキュリティ設計見直し

### 年次
- [ ] セキュリティ戦略全体見直し
- [ ] 最新セキュリティ標準への適応
- [ ] セキュリティ教育・学習
```

## 7. インシデント対応計画

### セキュリティインシデント対応手順
```markdown
## インシデント発生時の対応

### Level 1: 軽微な問題
- 不審なアクセスパターン
- 軽微なコード問題
**対応**: 24時間以内に調査・修正

### Level 2: 中程度の問題  
- セキュリティ警告検出
- データ整合性問題
**対応**: 4時間以内に一次対応、24時間以内に完全修正

### Level 3: 重大な問題
- セキュリティ侵害疑い
- データ漏洩の可能性
**対応**: 即座にサイト停止、1時間以内に調査開始

### 連絡先
- GitHub: Issues作成
- 緊急時: リポジトリ一時非公開
```

## 8. プライバシー保護

### プライバシーポリシー
```html
<!-- portfolio/privacy.html -->
<section id="privacy-policy">
    <h2>プライバシーポリシー</h2>
    <div class="privacy-content">
        <h3>収集する情報</h3>
        <ul>
            <li>匿名の使用統計（どのアプリが人気かなど）</li>
            <li>技術的情報（ブラウザタイプ、画面サイズなど）</li>
        </ul>
        
        <h3>収集しない情報</h3>
        <ul>
            <li>個人を特定できる情報</li>
            <li>連絡先情報</li>
            <li>位置情報</li>
        </ul>
        
        <h3>データの利用目的</h3>
        <ul>
            <li>サイトの改善</li>
            <li>技術的問題の解決</li>
            <li>学習目的での分析</li>
        </ul>
    </div>
</section>
```

この包括的なセキュリティ設計により、100個のアプリ開発を通じて安全性を維持できます。
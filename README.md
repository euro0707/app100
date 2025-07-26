# 100 Apps Journey - ポートフォリオサイト

## 概要
100個のアプリを作成する挑戦の記録を公開するポートフォリオサイトです。学習の軌跡、技術の成長、各アプリの詳細情報を美しく展示します。

## 🌟 特徴

### デザイン・UX
- **モダンで美しいデザイン** - グラデーション、シャドウ、アニメーション
- **レスポンシブ対応** - デスクトップ・タブレット・モバイル
- **スムーズなアニメーション** - Intersection Observer API使用
- **プログレスリング** - 進捗の視覚化

### 機能
- **アプリギャラリー** - 100個のアプリを美しく展示
- **カテゴリフィルター** - 教育・ゲーム・ユーティリティ・クリエイティブ
- **検索機能** - リアルタイムでアプリを検索
- **詳細ページ** - 各アプリの詳細情報・プレビュー
- **進捗統計** - 完成数・進捗率・開始日数
- **タイムライン** - 開発の時系列記録

### 技術的特徴
- **Vanilla JavaScript** - フレームワーク不要
- **CSS Grid & Flexbox** - モダンなレイアウト
- **CSS Variables** - テーマ管理
- **ES6+ Features** - クラス・モジュール・async/await
- **PWA対応準備** - Service Worker対応

## 📁 ファイル構成

```
portfolio-website/
├── index.html          # メインページ
├── app-detail.html     # アプリ詳細ページ
├── styles.css          # スタイルシート
├── script.js           # JavaScript機能
└── README.md          # このファイル
```

## 🎨 デザインシステム

### カラーパレット
- **Primary**: `#3b82f6` (Blue)
- **Secondary**: `#f59e0b` (Amber)
- **Accent**: `#10b981` (Emerald)
- **Text**: `#1f2937` / `#6b7280` / `#9ca3af`
- **Background**: `#ffffff` / `#f9fafb` / `#f3f4f6`

### グラデーション
- **Primary**: `135deg, #667eea 0%, #764ba2 100%`
- **Secondary**: `135deg, #f093fb 0%, #f5576c 100%`
- **Accent**: `135deg, #4facfe 0%, #00f2fe 100%`

### タイポグラフィ
- **フォント**: Inter (Google Fonts)
- **サイズスケール**: 0.75rem ~ 3.5rem
- **ウェイト**: 400, 500, 600, 700

## 🚀 使用方法

### 開発環境
```bash
# ローカルサーバーで開く
npx serve .
# または
python -m http.server 8000
```

### 新しいアプリの追加
```javascript
// script.js の apps 配列に追加
{
    id: '002',
    title: '新しいアプリ',
    description: 'アプリの説明',
    category: 'utility',
    technologies: ['React', 'TypeScript'],
    liveUrl: '../app/002-app-name/index.html',
    githubUrl: 'https://github.com/...',
    completedDate: '2025-01-27',
    features: ['機能1', '機能2'],
    status: 'completed'
}
```

## 📱 レスポンシブブレイクポイント

- **Mobile**: `< 480px`
- **Tablet**: `481px - 768px`
- **Desktop**: `> 768px`

## 🎯 パフォーマンス最適化

- **画像の最適化** - WebP形式推奨
- **コードの分割** - 必要に応じてES Modules使用
- **CSS最小化** - 本番環境では圧縮
- **キャッシュ戦略** - Service Worker実装

## 🔧 カスタマイズ

### テーマの変更
```css
:root {
    --primary-color: #新しい色;
    --gradient-primary: linear-gradient(...);
}
```

### 新しいカテゴリの追加
```javascript
// script.js の categoryLabels に追加
const categoryLabels = {
    education: '教育',
    game: 'ゲーム',
    utility: 'ユーティリティ',
    creative: 'クリエイティブ',
    newCategory: '新カテゴリ'
};
```

## 🌐 デプロイ

### GitHub Pages
```bash
# GitHub Pages でのデプロイ
git add .
git commit -m "Portfolio website"
git push origin main
```

### Netlify
1. リポジトリをNetlifyに接続
2. ビルド設定不要（静的サイト）
3. 自動デプロイ有効化

### Vercel
```bash
# Vercel CLI使用
npx vercel --prod
```

## 📈 今後の拡張予定

- [ ] **PWA機能** - オフライン対応・インストール可能
- [ ] **ダークモード** - テーマ切り替え機能
- [ ] **多言語対応** - 英語・日本語切り替え
- [ ] **統計ダッシュボード** - 詳細な分析データ
- [ ] **コメント機能** - 各アプリへのフィードバック
- [ ] **お気に入り機能** - ユーザーのアプリ保存
- [ ] **タグシステム** - より詳細な分類
- [ ] **検索フィルター拡張** - 技術・日付・人気度

## 🤝 貢献

このプロジェクトは個人の学習記録ですが、提案やフィードバックは歓迎します！

## 📄 ライセンス

このプロジェクトは学習目的で作成されています。

---

**100 Apps Journey** - 毎日コードを書き、100個のアプリで成長する旅の記録
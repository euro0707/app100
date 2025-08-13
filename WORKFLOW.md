# 100 Apps Journey - 開発ワークフロー

## 基本構造

```
euro0707/app100 (リポジトリルート)
├── portfolio/          ← ポートフォリオサイト
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── app100/             ← アプリ格納フォルダ
│   ├── apps/
│   │   ├── 001-number-learning/
│   │   ├── 002-animal-food-matching/
│   │   └── ...
│   └── docs/
├── index.html          ← ルートリダイレクト (portfolio/へ)
└── README.md
```

## 新しいアプリ追加の手順

### 1. アプリ開発
```bash
# app100/apps/内に新しいアプリディレクトリを作成
mkdir app100/apps/008-new-app
cd app100/apps/008-new-app

# 開発ファイルを作成
touch index.html style.css script.js
```

### 2. ポートフォリオ更新
```javascript
// portfolio/script.js のapps配列に追加
{
    id: '008',
    title: '新しいアプリ名',
    description: 'アプリの説明',
    category: 'education', // education, game, utility, creative
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://euro0707.github.io/app100/app100/apps/008-new-app/',
    githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/008-new-app',
    completedDate: '2025-08-13',
    features: ['機能1', '機能2', '機能3'],
    image: null,
    status: 'completed'
}
```

### 3. Git操作
```bash
# mainブランチで作業
git checkout main

# 変更をコミット
git add .
git commit -m "feat: add 008-new-app to portfolio"

# GitHub Pagesに反映
git push origin main
```

## 重要なポイント

### URL構造
- **ポートフォリオ**: `https://euro0707.github.io/app100/portfolio/`
- **個別アプリ**: `https://euro0707.github.io/app100/app100/apps/XXX-app-name/`

### ファイルパス注意点
- ポートフォリオは**リポジトリルート直下**
- アプリは**app100/apps/内**
- リダイレクトは**portfolio/**（app100/portfolio/ではない）

### GitHub Pages更新
- mainブランチのpushで自動デプロイ
- 更新反映まで1-2分待つ
- ブラウザキャッシュクリア必要な場合あり

## トラブルシューティング

### 404エラーの場合
1. ファイルパスを確認
2. GitHub Pages設定確認
3. ブラウザキャッシュクリア (Ctrl+F5)

### ポートフォリオに反映されない場合
1. portfolio/script.js のapps配列確認
2. git push origin main 実行済み確認
3. ブラウザで強制更新

## 今後の展開

- **10個達成時**: カテゴリー別フィルター強化
- **25個達成時**: 検索機能改善
- **50個達成時**: PWA機能追加
- **75個達成時**: ダークモード実装
- **100個達成時**: 最終統計とレポート作成
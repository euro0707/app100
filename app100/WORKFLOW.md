# 100 Apps Journey - 開発ワークフロー

## 基本構造

```
euro0707/app100 (リポジトリルート)
├── portfolio/          ← ポートフォリオサイト (要移動)
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── app100/             ← アプリ格納フォルダ
│   ├── apps/
│   │   ├── 001-number-learning/
│   │   ├── 002-animal-food-matching/
│   │   └── ...
│   └── docs/
├── index.html          ← ルートリダイレクト (要修正: portfolio/へ)
└── README.md
```

## 重要: 現在の修正必要事項

### 1. GitHub上で手動修正が必要
- app100/portfolio/ → portfolio/ (ルート直下に移動)
- index.html のリダイレクト先を app100/portfolio/ → portfolio/ に修正

### 2. 新しいアプリ追加の手順 (8個目以降)

#### アプリ開発
```bash
# mainブランチで作業
git checkout main

# app100/apps/内に新しいアプリディレクトリを作成
mkdir app100/apps/008-new-app
cd app100/apps/008-new-app

# 開発ファイルを作成
touch index.html style.css script.js
```

#### ポートフォリオ更新
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

#### Git操作
```bash
# 変更をコミット
git add .
git commit -m "feat: add 008-new-app

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# GitHub Pagesに反映
git push origin main
```

## 正しいURL構造 (修正後)

- **ポートフォリオ**: `https://euro0707.github.io/app100/portfolio/`
- **個別アプリ**: `https://euro0707.github.io/app100/app100/apps/XXX-app-name/`

## 今後の道のり

- **現在**: 7個完成 (7%)
- **短期目標**: 10個 (10%) - カテゴリー別フィルター強化
- **中期目標**: 25個 (25%) - 検索機能改善
- **長期目標**: 50個 (50%) - PWA機能追加
- **最終目標**: 100個 (100%) - 達成記念サイト作成

## 間違いを防ぐチェックリスト

### 新アプリ追加時
- [ ] mainブランチで作業
- [ ] app100/apps/内にディレクトリ作成
- [ ] portfolio/script.jsのapps配列に追加
- [ ] liveUrlとgithubUrlが正しい
- [ ] git add . && git commit && git push origin main
- [ ] ブラウザで動作確認

### トラブル時
- [ ] ブラウザキャッシュクリア (Ctrl+F5)
- [ ] GitHub Actionsでデプロイ完了確認
- [ ] ファイルパスの確認
# 推奨コマンド一覧

## 開発・テスト・実行コマンド

### Webサーバー起動（ローカルテスト用）
```bash
# Python HTTP サーバー（推奨）
cd [app-directory]
python -m http.server 8080

# または特定のポート指定
python -m http.server 3000

# アクセス: http://localhost:8080
```

### ファイル操作（Windows）
```cmd
# ディレクトリ一覧
dir
dir /s        # サブディレクトリも含む

# ファイル検索
dir *.html /s
dir *.js /s

# ファイル内容表示
type filename.txt
more filename.txt
```

### Git操作
```bash
# 状態確認
git status
git log --oneline -10

# 変更追加・コミット
git add .
git commit -m "feat: add new feature"

# ブランチ操作
git branch
git checkout -b feature/new-app
git merge feature-branch
```

### プロジェクト操作
```bash
# 新しいアプリディレクトリ作成
mkdir 006-new-app
cd 006-new-app

# 基本ファイル作成
touch index.html script.js style.css README.md
```

## デバッグ・検証コマンド

### ブラウザ開発者ツール
- F12: 開発者ツール開封
- Console: JavaScriptエラー確認
- Elements: DOM構造確認
- Network: リソース読み込み確認

### HTMLバリデーション
- オンラインバリデーター使用推奨
- W3C Markup Validator

### レスポンシブテスト
- ブラウザのデバイスモード
- 実機テスト（スマートフォン・タブレット）

## プロジェクト管理

### ディレクトリ構造確認
```bash
# プロジェクト全体構造
tree /f     # Windows
tree        # Linux/Mac

# 特定ディレクトリのみ
dir app-name /s
```

### ファイルサイズ確認
```bash
# ファイルサイズ一覧
dir *.* /s  # Windows
ls -lah     # Linux/Mac
```

## 注意事項

### セキュリティ
- ローカル開発サーバーは本番使用不可
- 機密情報をコードに埋め込まない
- CORSエラー回避のためHTTPサーバー使用必須

### パフォーマンス
- ブラウザキャッシュクリアでテスト
- モバイル実機での動作確認必須
- ネットワーク遅延シミュレーション

### 互換性
- モダンブラウザ対応（Chrome, Firefox, Safari, Edge）
- IE11サポート不要
- Android 8+, iOS 12+対応想定
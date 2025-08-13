# App100 シンプルアプリ追加ツール

App100プロジェクトで新しいアプリをポートフォリオに簡単に追加するためのツールです。

## 🚀 使い方

### 基本的な使用方法

```bash
cd portfolio
node ../app100/tools/add-app-simple.js [ID] [タイトル] [説明] [カテゴリ]
```

### 引数

| 引数 | 説明 | 例 | 必須 |
|------|------|-----|------|
| ID | 3桁のアプリID | 008, 009, 010 | ✅ |
| タイトル | アプリの名前 | "時計学習アプリ" | ✅ |
| 説明 | アプリの説明文 | "時計の読み方を学ぶアプリ" | ✅ |
| カテゴリ | アプリのカテゴリ | education, game, utility | ❌ |

### 実行例

```bash
# 基本的な例
node ../app100/tools/add-app-simple.js 008 "時計学習アプリ" "4-6歳向けの時計の読み方を学ぶアプリ"

# カテゴリ指定の例
node ../app100/tools/add-app-simple.js 009 "じゃんけんゲーム" "コンピューターとじゃんけん勝負" game

# ツール系アプリの例
node ../app100/tools/add-app-simple.js 010 "色選択ツール" "カラーパレットから色を選ぶツール" utility
```

## 📁 実行後の手順

ツールの実行後、以下の手順でアプリを完成させてください：

### 1. アプリフォルダの作成
```bash
mkdir apps/008-clocklearningapp
```

### 2. 基本ファイルの作成
```bash
cd apps/008-clocklearningapp
touch index.html style.css script.js
```

### 3. index.htmlの基本構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>時計学習アプリ | 008 - App100</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>時計学習アプリ</h1>
        <!-- アプリのコンテンツ -->
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### 4. GitHubへのコミット
```bash
git add .
git commit -m "feat: add 008-clocklearningapp"
git push
```

## ⚙️ 自動生成される情報

ツールが自動で設定する項目：

- **完成日**: 実行日が自動設定
- **技術スタック**: HTML5, CSS3, JavaScript, レスポンシブ
- **機能**: レスポンシブデザイン, モバイル対応, 学習記録
- **URL**: ライブURL、GitHubURLが自動生成
- **フォルダ名**: 日本語タイトルから英語スラッグを自動生成

## 🔍 日本語フォルダ名変換

日本語のアプリ名は以下のように英語に変換されます：

| 日本語 | 英語 | 例 |
|--------|------|-----|
| 時計 | clock | 時計学習アプリ → clock-learning-app |
| 学習 | learning | |
| ゲーム | game | じゃんけんゲーム → janken-game |
| 数 | number | 数のお勉強 → number-learning |
| 動物 | animal | |
| 記憶 | memory | |
| 色 | color | |
| 形 | shape | |

## 📝 注意事項

### ✅ Do's
- アプリIDは連番で設定する（008, 009, 010...）
- タイトルと説明にはダブルクォート `"..."` を使用する
- カテゴリは `education`, `game`, `utility` のいずれかを使用
- 実行後はすぐにアプリフォルダを作成する

### ❌ Don'ts
- 既存のアプリIDを使用しない
- スペースが含まれる引数をクォートで囲まない
- portfolio/ ディレクトリ以外で実行しない
- script.js を手動で編集しない（ツールを使用する）

## 🛠️ トラブルシューティング

### エラー: "loadApps()メソッドまたはapps配列が見つかりません"

**原因**: script.js の構造が変更されている
**解決方法**: 
```bash
git checkout script.js  # 元の状態に戻す
```

### エラー: "No such file or directory"

**原因**: 間違ったディレクトリで実行している
**解決方法**: portfolio/ ディレクトリで実行する
```bash
cd portfolio
node ../app100/tools/add-app-simple.js ...
```

### フォルダ名が期待通りでない

**原因**: 日本語変換辞書にない単語が使用されている
**解決方法**: add-app-simple.js の `japanese` オブジェクトに追加するか、シンプルな英語タイトルを使用する

## 🎯 このツールの利点

- **⚡ 高速**: 30秒でポートフォリオに新アプリを追加
- **🔒 安全**: 既存データを壊さない設計
- **📱 完全対応**: 必要な全ての情報を自動生成
- **🚫 エラーフリー**: 手動編集によるミスを防止
- **🔄 繰り返し可能**: 何度でも安全に実行可能

---

**開発メモ**: このツールは App100 プロジェクトのアプリ開発効率を最大化するために作成されました。100個のアプリ開発に集中するため、ポートフォリオ更新作業を最小化しています。
# コーディング規約とスタイル

## JavaScript規約

### クラス設計
- ES6+ クラス構文を使用
- クラス名はPascalCase（例: `OrekunaQuiz`, `AnimalFoodMatchingGame`）
- メソッド名はcamelCase
- プライベートメンバはthis.プロパティで管理

### 変数・関数命名
- 変数名: camelCase（例: `currentQuestion`, `isDrawing`）
- 定数: UPPER_SNAKE_CASE（使用頻度少）
- DOM要素: 末尾にEl付けることもある（例: `totalGamesEl`）

### イベントハンドリング
- `addEventListener`を使用
- アロー関数でthisバインディングを適切に管理
- タッチイベントとマウスイベント両対応

### データ管理
- JSON形式でのデータ埋め込み（外部ファイルではなくコード内）
- LocalStorageによる永続化
- オブジェクト指向的なデータカプセル化

## HTML規約

### 構造
- セマンティックHTML5要素を使用
- class名は kebab-case（例: `game-screen`, `hint-box`）
- id名は camelCase（例: `drawingCanvas`, `hintText`）

### アクセシビリティ
- 適切なlang属性
- meta viewport設定
- 大きなタッチターゲット

## CSS規約

### 命名規則
- BEM風の命名（完全なBEMではない）
- class名は kebab-case
- セレクタは可能な限りclass使用

### レスポンシブデザイン
- モバイルファースト
- max-width: 480pxでのメディアクエリ
- flexboxレイアウト多用

### カラーパレット
- 子供向けの優しいパステルカラー
- グラデーション多用
- 視認性重視の高コントラスト

### アニメーション
- CSS3 keyframes
- transition効果
- hover/active状態への配慮

## ファイル構成規約

### 各アプリの標準構成
```
xxx-app-name/
├── index.html          # メインHTML
├── script.js           # メインロジック
├── style.css           # スタイル
├── README.md           # アプリの説明
└── data/               # データファイル（必要に応じて）
    ├── *.json          # 問題データ等
    └── assets/         # 画像・音声等
```

## 開発方針
- Vanilla JavaScriptでフレームワーク非依存
- 外部ライブラリ最小限
- 軽量・高速動作
- オフライン動作可能
- 子供の使いやすさ最優先
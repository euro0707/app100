# TimeTree毎朝通知システム

毎朝6時にTimeTreeの予定をLINEで自動通知するシステム

## 🎯 機能

- **毎朝6時に自動通知** - 今日の予定一覧をLINEに送信
- **予定なしも通知** - 予定がない日も「今日は予定なし」の通知
- **1日1回のデータ取得** - TimeTree-Exporterで安全にデータ取得
- **設定変更可能** - 通知時間は設定ファイルで簡単変更

## 📋 セットアップ手順

### 1. 必要な準備
- Python 3.9以上
- TimeTreeアカウント
- LINE Notifyトークン

### 2. LINE Notifyトークン取得
1. [LINE Notify](https://notify-bot.line.me/)にアクセス
2. 「ログイン」→「マイページ」→「トークンを発行する」
3. トークン名を入力（例：「TimeTree通知」）
4. 通知先を選択（例：「1:1でLINE Notifyから通知を受け取る」）
5. 発行されたトークンをコピー

### 3. 環境変数設定
`.env`ファイルを作成：
```env
# TimeTree認証情報
TIMETREE_EMAIL=your-email@example.com
TIMETREE_PASSWORD=your-secure-password

# LINE Notify設定
LINE_NOTIFY_TOKEN=your-line-notify-token
```

### 4. インストール・実行
```bash
# 依存関係インストール
pip install -e .

# 手動テスト実行
python -m timetree_notifier.main --mode manual

# デーモンモード開始（毎朝6時に自動実行）
python -m timetree_notifier.main --mode daemon
```

# 🗡️ Day5: Linux Quest - 魔法の巻物（スクリプト作成）

---

## 📖 ストーリー：自動化の奥義を極める

5日目を迎えた今、あなたは基本的なコマンドを習得し、権限システムも理解した。  
今日は、これまでの知識を組み合わせて「自動化の魔法」を学ぶ時だ。

賢者（Claude）が古い巻物を広げながら語る：

> 「勇者よ、見よ。この巻物に書かれているのは『自動化の呪文』だ。  
> 同じ作業を何度も繰り返すのは愚かなこと。真の賢者は、コンピューターに  
> 作業をさせる方法を知っている。今日は君も魔法使いになる日だ。」

---

## 🎯 今日のクエスト目標
**「シェルスクリプトを作成し、変数・条件分岐・繰り返しを使いこなす」**

---

## 🧙‍♂️ 基礎知識：スクリプトという魔法

### スクリプトとは？
- 複数のコマンドを自動実行するプログラム
- **繰り返し作業の自動化**に威力を発揮
- システム管理者の必須スキル
- **時間の節約**と**エラーの削減**を実現

### シェルスクリプトの力
1. **バックアップの自動化**
2. **ログファイルの整理**
3. **システム監視**
4. **開発環境のセットアップ**
5. **データ処理の自動化**

---

## ⚔️ 実践クエスト

### Step 1: 最初の魔法の巻物を作成

```bash
cd my_linux_adventure
nano hello_script.sh
```

以下を入力：

```bash
#!/bin/bash
# これは私の最初のスクリプトです

echo "=== 冒険者の挨拶 ==="
echo "こんにちは、$USER さん！"
echo "今日は $(date) です"
echo "現在のディレクトリ: $(pwd)"
echo "=== 挨拶終了 ==="
```

**重要な要素：**
- `#!/bin/bash`：シェバン（どのプログラムで実行するかを指定）
- `#`：コメント行
- `$USER`：環境変数（現在のユーザー名）
- `$(command)`：コマンド置換（コマンドの結果を取得）

### Step 2: スクリプトを実行可能にして実行

```bash
chmod 755 hello_script.sh
./hello_script.sh
```

### Step 3: 変数を使いこなす

```bash
nano variables_demo.sh
```

以下を入力：

```bash
#!/bin/bash

# 変数の定義
NAME="Linux冒険者"
LEVEL=5
HEALTH=100

# 変数の使用
echo "名前: $NAME"
echo "レベル: $LEVEL"
echo "HP: $HEALTH"

# 計算
NEW_HEALTH=$((HEALTH - 20))
echo "ダメージを受けた後のHP: $NEW_HEALTH"

# ユーザー入力
echo "あなたの好きなコマンドは何ですか？"
read FAVORITE_COMMAND
echo "あなたの好きなコマンドは $FAVORITE_COMMAND ですね！"
```

### Step 4: 条件分岐（if文）

```bash
nano condition_demo.sh
```

以下を入力：

```bash
#!/bin/bash

echo "あなたのLinux経験年数を入力してください："
read EXPERIENCE

if [ $EXPERIENCE -lt 1 ]; then
    echo "初心者ですね！このクエストがぴったりです。"
elif [ $EXPERIENCE -lt 3 ]; then
    echo "中級者ですね！さらなるスキルアップを目指しましょう。"
else
    echo "上級者ですね！他の人にも教えてあげてください。"
fi

# ファイル存在チェック
if [ -f "adventure_log.txt" ]; then
    echo "冒険記録が見つかりました！"
    echo "最新の記録："
    tail -3 adventure_log.txt
else
    echo "冒険記録が見つかりません。新しく作成しましょう。"
    touch adventure_log.txt
fi
```

### Step 5: 繰り返し処理（for文）

```bash
nano loop_demo.sh
```

以下を入力：

```bash
#!/bin/bash

echo "=== カウントダウン開始！ ==="
for i in 5 4 3 2 1; do
    echo "$i..."
    sleep 1
done
echo "発射！🚀"

echo ""
echo "=== ファイル一覧 ==="
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "ファイル: $file (サイズ: $(wc -c < "$file") bytes)"
    fi
done

echo ""
echo "=== 1から10まで ==="
for ((i=1; i<=10; i++)); do
    echo "数字: $i"
done
```

### Step 6: 実用的なスクリプト作成

```bash
nano backup_script.sh
```

以下を入力：

```bash
#!/bin/bash

# バックアップ用スクリプト
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
SOURCE_DIR="."

echo "=== 冒険記録のバックアップを開始 ==="
echo "バックアップ先: $BACKUP_DIR"

# バックアップディレクトリ作成
mkdir "$BACKUP_DIR"

# テキストファイルをバックアップ
for file in *.txt; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "✅ $file をバックアップしました"
    fi
done

# シェルスクリプトもバックアップ
for file in *.sh; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "✅ $file をバックアップしました"
    fi
done

echo "=== バックアップ完了 ==="
echo "バックアップされたファイル数: $(ls -1 "$BACKUP_DIR" | wc -l)"
ls -la "$BACKUP_DIR"
```

### Step 7: スクリプトの実行とテスト

```bash
chmod 755 *.sh

echo "=== 各スクリプトを実行 ==="
./variables_demo.sh
echo ""
./condition_demo.sh
echo ""
./loop_demo.sh
echo ""
./backup_script.sh
```

### Step 8: 関数を使った高度なスクリプト

```bash
nano advanced_script.sh
```

以下を入力：

```bash
#!/bin/bash

# 関数の定義
show_system_info() {
    echo "=== システム情報 ==="
    echo "ユーザー: $USER"
    echo "ホスト名: $(hostname)"
    echo "現在時刻: $(date)"
    echo "稼働時間: $(uptime)"
    echo "===================="
}

create_project_structure() {
    local project_name=$1
    echo "プロジェクト '$project_name' を作成中..."
    
    mkdir -p "$project_name"/{src,docs,tests,config}
    touch "$project_name"/README.md
    touch "$project_name"/src/main.sh
    touch "$project_name"/docs/guide.md
    
    echo "✅ プロジェクト構造を作成しました："
    tree "$project_name" 2>/dev/null || ls -la "$project_name"
}

# メイン処理
show_system_info

echo "新しいプロジェクトを作成しますか？ (y/n)"
read CREATE_PROJECT

if [ "$CREATE_PROJECT" = "y" ]; then
    echo "プロジェクト名を入力してください："
    read PROJECT_NAME
    create_project_structure "$PROJECT_NAME"
fi
```

---

## 💡 今日学んだ魔法の言葉（コマンド・構文）

| 要素 | 意味 | 効果 |
|------|------|------|
| `#!/bin/bash` | シェバン | スクリプトの実行環境を指定 |
| `$VAR` | 変数参照 | 変数の値を取得 |
| `$(command)` | コマンド置換 | コマンドの実行結果を取得 |
| `read` | 入力受付 | ユーザーからの入力を受け取る |
| `if [ 条件 ]` | 条件分岐 | 条件に応じて処理を分岐 |
| `for` | 繰り返し | 指定した回数・リストで処理を繰り返し |
| `function` | 関数 | 再利用可能な処理のまとまり |

---

## 🔧 スクリプト作成のベストプラクティス

### 1. 可読性を重視
```bash
#!/bin/bash
# スクリプトの目的を明記
# 作成者: あなたの名前
# 作成日: 2024-XX-XX

# 変数は大文字で定義
CONFIG_FILE="/path/to/config"
LOG_FILE="/var/log/script.log"
```

### 2. エラーハンドリング
```bash
# エラーで停止
set -e

# ファイル存在チェック
if [ ! -f "$CONFIG_FILE" ]; then
    echo "エラー: 設定ファイルが見つかりません"
    exit 1
fi
```

### 3. デバッグ機能
```bash
# デバッグモード
set -x  # コマンドを表示しながら実行
set +x  # デバッグモード終了
```

---

## 🏆 今日の成果確認

以下をすべて実行できたらDay5クリア！

- [ ] シェバン付きのスクリプトファイルを作成した
- [ ] 変数を定義・使用した
- [ ] ユーザー入力を `read` で受け取った
- [ ] if文で条件分岐を作成した
- [ ] for文で繰り返し処理を作成した
- [ ] 関数を定義・呼び出しした
- [ ] 実用的なバックアップスクリプトを作成した

---

## 🔮 賢者からの一言

> 「見事だ！君は今日、単なるコマンド使いから『自動化の魔法使い』へと進化した。  
> スクリプトは君の分身となり、眠っている間も働いてくれる。  
> これこそが『稼げる技術』の真髄だ。企業が求めているのは、  
> このような自動化を実現できる人材なのだから。」

---

## 📚 明日への予告

**Day6 テーマ：「情報の流れを制す - パイプとリダイレクトの奥義」**

- パイプ（|）でコマンドを連結
- リダイレクト（>, >>, <）の活用
- grepとの組み合わせ技
- ログ解析の実践
- データ処理の自動化

---

## 🎯 実践チャレンジ

余裕があれば挑戦してみよう：

1. システム監視スクリプト（CPU使用率、メモリ使用量を表示）
2. ファイル整理スクリプト（拡張子別にディレクトリを作成・移動）
3. 日記作成スクリプト（日付付きでテキストファイルを自動作成）
4. メニューシステム（選択肢を表示して対応する処理を実行）

---

### 💪 モチベーション・メッセージ

**「自動化こそが現代のゴールドラッシュだ。君が今日書いたスクリプトは、  
将来の君の時間を何倍にも増やしてくれる『時間増幅装置』なのだ。  
DevOpsエンジニア、システム管理者、SREエンジニア...  
みんな君と同じスクリプトの力で世界を動かしている。」**

**Day5 完了！明日はデータの流れを自在に操る技を学ぼう。** 🌊
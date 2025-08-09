# 🗡️ Day6: Linux Quest - 情報の流れを制す（パイプとリダイレクト）

---

## 📖 ストーリー：水流の如く、データを操る

6日目。冒険も終盤に差し掛かった。あなたは多くの技を身につけ、自動化の魔法も習得した。  
今日は最も重要で、最も美しい技術の一つを学ぶ。「情報の流れ」を自在に操る術だ。

賢者（Claude）が水晶玉を通して流れる光を見せながら語る：

> 「勇者よ、見よ。この光の流れを。Linuxの世界では、情報もこのように流れる。  
> 一つのコマンドから別のコマンドへ、ファイルから処理へ、結果から保存へ...  
> この流れを制する者こそが、真のLinuxマスターと呼ばれるのだ。」

---

## 🎯 今日のクエスト目標
**「パイプとリダイレクトでデータの流れを自在に操り、複雑な処理を組み合わせる」**

---

## 🧙‍♂️ 基礎知識：データの流れという概念

### 3つの標準ストリーム
1. **標準入力（stdin）**：キーボードからの入力
2. **標準出力（stdout）**：画面への出力
3. **標準エラー（stderr）**：エラーメッセージの出力

### パイプとリダイレクトの力
- **パイプ（|）**：コマンドの出力を次のコマンドの入力に
- **リダイレクト（>, >>）**：出力をファイルに保存
- **入力リダイレクト（<）**：ファイルから入力を読み取り

---

## ⚔️ 実践クエスト

### Step 1: サンプルデータの準備

```bash
cd my_linux_adventure

# アクセスログのサンプルを作成
cat > access.log << 'EOF'
192.168.1.10 - - [28/Jul/2024:10:30:15] "GET /index.html" 200 1234
192.168.1.11 - - [28/Jul/2024:10:31:22] "GET /about.html" 200 5678
192.168.1.10 - - [28/Jul/2024:10:32:45] "POST /login" 404 0
192.168.1.12 - - [28/Jul/2024:10:33:12] "GET /products.html" 200 9876
192.168.1.10 - - [28/Jul/2024:10:34:33] "GET /index.html" 200 1234
192.168.1.13 - - [28/Jul/2024:10:35:44] "GET /contact.html" 500 0
192.168.1.11 - - [28/Jul/2024:10:36:55] "GET /about.html" 200 5678
EOF

# ユーザーリストのサンプルを作成
cat > users.txt << 'EOF'
alice:admin:25
bob:user:30
charlie:admin:28
diana:user:35
eve:moderator:22
frank:user:40
EOF
```

### Step 2: 基本的なパイプ操作

```bash
# ファイル内容を表示して行数をカウント
cat access.log | wc -l

# 特定のIPアドレスでフィルタリング
cat access.log | grep "192.168.1.10"

# ユーザー一覧を表示してソート
cat users.txt | sort

# 年齢順（数値）でソート
cat users.txt | sort -t: -k3 -n
```

**解説：**
- `wc -l`：行数をカウント
- `grep`：パターンに一致する行を抽出
- `sort`：ソート
- `sort -t: -k3 -n`：区切り文字「:」で3列目を数値ソート

### Step 3: 複数パイプの組み合わせ

```bash
# 管理者ユーザーの年齢の平均を計算
cat users.txt | grep "admin" | cut -d: -f3 | awk '{sum+=$1} END {print "平均年齢:", sum/NR}'

# アクセスログから200番台のレスポンスだけ抽出、IPアドレス別にカウント
cat access.log | grep " 2[0-9][0-9] " | cut -d' ' -f1 | sort | uniq -c

# 最もアクセスの多いページTOP3
cat access.log | grep -o '"GET [^"]*"' | cut -d' ' -f2 | sort | uniq -c | sort -nr | head -3
```

**解説：**
- `cut -d: -f3`：区切り文字「:」で3列目を抽出
- `awk`：パターン処理言語
- `uniq -c`：重複行をカウント
- `sort -nr`：数値で逆順ソート
- `head -3`：最初の3行

### Step 4: リダイレクトの基本

```bash
# 結果をファイルに保存
cat access.log | grep "192.168.1.10" > ip_10_access.txt
echo "分析完了: $(date)" >> ip_10_access.txt

# エラーもファイルに保存
ls non_existent_file 2> error.log

# 正常出力とエラーを別々のファイルに
ls *.txt *.xyz > output.log 2> error.log

# 正常出力とエラーを一つのファイルに
ls *.txt *.xyz > all_output.log 2>&1
```

### Step 5: 高度なパイプテクニック

```bash
# システム監視レポートの作成
echo "=== システム監視レポート ===" > system_report.txt
echo "作成日時: $(date)" >> system_report.txt
echo "" >> system_report.txt

echo "=== ディスク使用量 ===" >> system_report.txt
df -h | head -5 >> system_report.txt
echo "" >> system_report.txt

echo "=== メモリ使用量 ===" >> system_report.txt
free -h >> system_report.txt
echo "" >> system_report.txt

echo "=== プロセス数 ===" >> system_report.txt
ps aux | wc -l | awk '{print "総プロセス数:", $1}' >> system_report.txt
```

### Step 6: 実用的なログ解析

```bash
# アクセスログ解析スクリプト
cat > log_analyzer.sh << 'EOF'
#!/bin/bash

LOG_FILE="access.log"
REPORT_FILE="access_report_$(date +%Y%m%d_%H%M%S).txt"

echo "=== アクセスログ解析レポート ===" > $REPORT_FILE
echo "解析日時: $(date)" >> $REPORT_FILE
echo "対象ファイル: $LOG_FILE" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "=== 基本統計 ===" >> $REPORT_FILE
echo "総アクセス数: $(cat $LOG_FILE | wc -l)" >> $REPORT_FILE
echo "ユニークIP数: $(cat $LOG_FILE | cut -d' ' -f1 | sort | uniq | wc -l)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "=== ステータスコード別集計 ===" >> $REPORT_FILE
cat $LOG_FILE | grep -o ' [0-9][0-9][0-9] ' | sort | uniq -c | sort -nr >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "=== IPアドレス別アクセス数 TOP5 ===" >> $REPORT_FILE
cat $LOG_FILE | cut -d' ' -f1 | sort | uniq -c | sort -nr | head -5 >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "=== 最も多くアクセスされたページ TOP5 ===" >> $REPORT_FILE
cat $LOG_FILE | grep -o '"GET [^"]*"' | cut -d' ' -f2 | sort | uniq -c | sort -nr | head -5 >> $REPORT_FILE

echo "レポートが $REPORT_FILE に生成されました。"
EOF

chmod 755 log_analyzer.sh
./log_analyzer.sh
```

### Step 7: データの変換と加工

```bash
# CSVファイルの作成と加工
cat > sales.csv << 'EOF'
日付,商品,売上,担当者
2024-07-01,商品A,10000,田中
2024-07-01,商品B,15000,佐藤
2024-07-02,商品A,12000,田中
2024-07-02,商品C,8000,鈴木
2024-07-03,商品B,18000,佐藤
EOF

# 担当者別売上集計
echo "=== 担当者別売上集計 ==="
cat sales.csv | grep -v "日付" | cut -d, -f3,4 | sort -k2 | \
while IFS=, read amount person; do
    echo "$person: $amount"
done | awk -F: '
{
    person[$1] += $2
}
END {
    for (p in person) {
        print p ": " person[p]
    }
}' | sort -k2 -nr
```

### Step 8: リアルタイム監視

```bash
# ログの末尾をリアルタイム監視
tail -f access.log | while read line; do
    echo "[$(date)] $line"
done &

# 新しいログエントリを追加（別のターミナルで）
echo '192.168.1.14 - - [28/Jul/2024:10:40:00] "GET /new-page.html" 200 3456' >> access.log
```

---

## 💡 今日学んだ魔法の言葉（コマンド・記号）

| 要素 | 意味 | 効果 |
|------|------|------|
| `|` | パイプ | コマンドの出力を次のコマンドの入力に |
| `>` | 出力リダイレクト | 出力をファイルに保存（上書き） |
| `>>` | 追記リダイレクト | 出力をファイルに追記 |
| `<` | 入力リダイレクト | ファイルから入力を読み取り |
| `2>` | エラーリダイレクト | エラー出力をファイルに保存 |
| `2>&1` | エラー統合 | エラー出力を標準出力に統合 |
| `cut` | 列抽出 | 特定の列を抽出 |
| `uniq -c` | 重複カウント | 重複行をカウント |
| `sort -nr` | 数値逆順ソート | 数値で降順ソート |

---

## 🌊 パイプライン設計の思考法

### 1. データの流れを可視化
```
入力データ → フィルタリング → 変換 → 集計 → 出力
```

### 2. 段階的な処理設計
```bash
# ステップ1: 生データを確認
cat data.txt

# ステップ2: 必要な行だけ抽出
cat data.txt | grep "条件"

# ステップ3: 必要な列だけ取得
cat data.txt | grep "条件" | cut -d',' -f2

# ステップ4: ソートして重複除去
cat data.txt | grep "条件" | cut -d',' -f2 | sort | uniq

# ステップ5: 結果をファイルに保存
cat data.txt | grep "条件" | cut -d',' -f2 | sort | uniq > result.txt
```

---

## 🔧 実用的なワンライナー集

```bash
# プロセス監視
ps aux | sort -k3 -nr | head -10  # CPU使用率トップ10

# ディスク使用量
du -sh */ | sort -hr | head -10   # ディレクトリサイズトップ10

# ログ解析
cat /var/log/syslog | grep ERROR | tail -10  # 最近のエラー10件

# ネットワーク監視
netstat -tuln | grep LISTEN       # リスニングポート一覧

# ファイル検索
find . -name "*.log" -mtime -7 | xargs ls -la  # 7日以内のログファイル
```

---

## 🏆 今日の成果確認

以下をすべて実行できたらDay6クリア！

- [ ] パイプ（|）で複数のコマンドを連結した
- [ ] リダイレクト（>, >>）でファイルに出力保存した
- [ ] grep、cut、sort、uniq を組み合わせて使った
- [ ] 複雑なパイプラインでデータ解析を行った
- [ ] ログ解析スクリプトを作成・実行した
- [ ] エラーリダイレクト（2>）を使った
- [ ] awk を使って高度な処理を行った

---

## 🔮 賢者からの一言

> 「圧倒的だ！君は今日、Linuxの最も美しい側面を体験した。  
> パイプとリダイレクトは単なる技術ではない。それは『思考の道具』だ。  
> 複雑な問題を小さな部品に分解し、それらを組み合わせて解決する...  
> これこそがLinuxマスターの思考法であり、企業が最も価値を置くスキルなのだ。」

---

## 📚 明日への予告

**Day7 テーマ：「最終試練と卒業 - Linux世界の歩き方」**

- これまでの技術の総復習
- 実践的な総合演習
- 次のステップへの道筋
- Linux学習の継続方法
- 最終プロジェクトの完成

---

## 🎯 実践チャレンジ

余裕があれば挑戦してみよう：

1. Webサーバーログの完全解析システム
2. システムリソース監視ダッシュボード（テキスト版）
3. 自動バックアップ＆圧縮システム
4. マルチファイル検索・置換ツール

---

### 💪 モチベーション・メッセージ

**「データの流れを制する者が、デジタル時代を制する。  
今日君が身につけた技術は、データサイエンティスト、SRE、DevOpsエンジニアの  
日常業務そのものだ。パイプ一つで企業の課題を解決できる。  
君は今、プロフェッショナルの領域に足を踏み入れた。」**

**Day6 完了！明日はついに最終試練...Linux Questの集大成だ！** ⚔️
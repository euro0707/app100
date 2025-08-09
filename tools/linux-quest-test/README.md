# 🗡️ Linux Quest - 稼げる武器を手に入れる7日間の冒険

**過去にHTMLで挫折した30-50代向け**の実践的なLinux学習プラットフォーム

![Linux Quest](https://img.shields.io/badge/Linux-Quest-brightgreen?style=for-the-badge&logo=linux)
![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)
![Days](https://img.shields.io/badge/Days-7-blue?style=for-the-badge)

## 🎯 概要

Linux Questは、コマンドライン操作を **RPG風の冒険** として学べる革新的な学習プラットフォームです。
過去にプログラミング学習で挫折した経験がある方でも、**ゲーム感覚で楽しく** Linuxの基礎を習得できます。

### 🌟 特徴

- **🎮 インタラクティブなミニゲーム**: 各日程ごとに専用の仮想ターミナル環境
- **📊 進捗管理システム**: localStorage活用で学習状況を自動保存
- **🧙‍♂️ RPG風ストーリー**: 賢者のガイダンスによる没入感のある学習体験
- **🎓 修了証明書**: 完走時に自動生成される成果証明
- **📱 レスポンシブ対応**: PC・タブレット・スマートフォンで利用可能

## 📚 学習カリキュラム

| Day | テーマ | 習得コマンド | 内容 |
|-----|--------|-------------|------|
| **Day1** | 新たな旅路の始まり | `echo`, `pwd`, `ls` | ターミナル基本操作 |
| **Day2** | デジタル世界の探検術 | `mkdir`, `cd`, `touch`, `cat` | ディレクトリ・ファイル操作 |
| **Day3** | 古き書物の解読術 | `less`, `head`, `tail`, `nano`, `grep` | ファイル閲覧・編集 |
| **Day4** | 守護の印章 | `chmod`, `ls -l` | パーミッション管理 |
| **Day5** | 魔法の巻物 | 変数, 条件分岐, ループ, 関数 | シェルスクリプト基礎 |
| **Day6** | 情報の流れを制す | `\|`, `>`, `>>`, パイプライン | パイプ・リダイレクト |
| **Day7** | 最終試練 | システム管理ツール開発 | 総合演習 |

## 🚀 使用方法

### クイックスタート

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/yourusername/linux-quest.git
   cd linux-quest
   ```

2. **ブラウザで開く**
   - `index.html` をダブルクリック、または
   - ローカルサーバーで起動: `python -m http.server 8000`

3. **冒険を開始**
   - オープニング画面でキャラクター設定
   - メインハブから各Dayのクエストに挑戦
   - 7日間完了で修了証獲得！

### 推奨環境

- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **画面解像度**: 1024x768以上推奨
- **JavaScript**: 有効化必須

## 🏗️ プロジェクト構造

```
linux-quest/
├── index.html              # メインハブページ
├── style.css               # 統合スタイルシート
├── script.js               # メイン管理システム
├── README.md               # このファイル
├── day1-minigame/          # Day1: ターミナル基本操作
├── day2-minigame/          # Day2: ディレクトリ・ファイル操作
├── day3-minigame/          # Day3: ファイル閲覧・編集
├── day4-minigame/          # Day4: 権限管理
├── day5-minigame/          # Day5: シェルスクリプト基礎
├── day6-minigame/          # Day6: パイプ・リダイレクト
├── day7-minigame/          # Day7: システム管理ツール
├── day1.md ~ day7.md       # 各日の詳細学習資料
└── project_sow.md          # プロジェクト仕様書
```

## 🛠️ 技術仕様

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox/Grid レイアウト、アニメーション
- **Vanilla JavaScript**: ES6+、モジュラー設計

### 主要機能
- **仮想ファイルシステム**: ブラウザ内でのLinux環境シミュレーション
- **コマンドライン処理エンジン**: リアルタイムコマンド解析・実行
- **進捗管理システム**: localStorage活用の永続化
- **テーマシステム**: 各日程に応じたカラーテーマ

## 🎯 対象者

### 主要ターゲット
- **30-50代の学習者**で過去にプログラミング学習で挫折経験がある方
- HTMLやプログラミングに興味はあるが、敷居が高いと感じている方
- **転職・キャリアアップ**を目指す方
- **AI時代**に対応できる技術スキルを身につけたい方

### 習得後の活用
- **システム管理者**: 年収400-600万円
- **DevOpsエンジニア**: 年収600-1000万円
- **SREエンジニア**: 年収700-1200万円
- **クラウドアーキテクト**: 年収800-1500万円

## 📈 学習効果

### Before（学習前）
- ❌ 黒い画面（ターミナル）に恐怖心
- ❌ コマンドライン操作が分からない
- ❌ Linuxは難しいという固定観念

### After（学習後）
- ✅ ターミナルでの基本操作をマスター
- ✅ ファイル・ディレクトリ操作が自在
- ✅ シェルスクリプトで作業自動化
- ✅ システム管理の基礎知識
- ✅ **稼げる技術**の基盤を習得

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

### 貢献方法
1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 改善アイデア
- 新しいDay（上級編）の追加
- 多言語対応
- モバイル専用UI
- 音声ガイダンス
- SNS連携機能

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🙏 謝辞

- **Claude AI**: プロジェクト開発支援
- **Linux コミュニティ**: インスピレーションと技術情報
- **すべての学習者**: フィードバックと貴重な意見

## 📞 サポート・連絡先

- **Issues**: [GitHub Issues](https://github.com/yourusername/linux-quest/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/linux-quest/discussions)

---

### 🌟 「過去の挫折は、今の成功への踏み台だ」

**Linux Quest で新たな冒険を始めよう！**

[![スター](https://img.shields.io/github/stars/yourusername/linux-quest?style=social)](https://github.com/yourusername/linux-quest/stargazers)
[![フォーク](https://img.shields.io/github/forks/yourusername/linux-quest?style=social)](https://github.com/yourusername/linux-quest/network/members)
[![ウォッチ](https://img.shields.io/github/watchers/yourusername/linux-quest?style=social)](https://github.com/yourusername/linux-quest/watchers)
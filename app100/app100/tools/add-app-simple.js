#!/usr/bin/env node

/**
 * App100 - 超シンプルアプリ追加ツール
 * 既存のscript.jsのloadApps()メソッド内のapps配列に新しいアプリを追加
 */

const fs = require('fs');
const path = require('path');

function addAppToPortfolio(id, title, description, category = 'education') {
    const scriptPath = path.resolve(__dirname, '../../portfolio/script.js');
    
    console.log('📱 新しいアプリをポートフォリオに追加中...');
    console.log(`   ID: ${id}, タイトル: ${title}`);
    
    try {
        // script.jsを読み込み
        let content = fs.readFileSync(scriptPath, 'utf8');
        
        // フォルダ名生成
        const folderName = `${id}-${slugify(title)}`;
        const today = new Date().toISOString().split('T')[0];
        
        // 新しいアプリオブジェクトを文字列として作成
        const newApp = `            {
                id: '${id}',
                title: '${title}',
                description: '${description}',
                category: '${category}',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'レスポンシブ'],
                liveUrl: 'https://euro0707.github.io/app100/apps/${folderName}/',
                githubUrl: 'https://github.com/euro0707/app100/tree/main/app100/apps/${folderName}',
                completedDate: '${today}',
                features: ['レスポンシブデザイン', 'モバイル対応', '学習記録'],
                image: null,
                status: 'completed'
            }`;
        
        // loadApps()メソッド内のapps配列の終了位置（]; の直前）を見つけて挿入
        const loadAppsStart = content.indexOf('loadApps() {');
        const appsArrayStart = content.indexOf('this.apps = [', loadAppsStart);
        const appsArrayEnd = content.indexOf('        ];', appsArrayStart);
        
        if (loadAppsStart === -1 || appsArrayStart === -1 || appsArrayEnd === -1) {
            throw new Error('loadApps()メソッドまたはapps配列が見つかりません');
        }
        
        // 配列の最後に新しいアプリを追加
        const beforeEnd = content.substring(0, appsArrayEnd);
        const afterEnd = content.substring(appsArrayEnd);
        
        // 既存アプリの後にカンマと新しいアプリを追加
        const updatedContent = beforeEnd + ',\n' + newApp + '\n' + afterEnd;
        
        // ファイルに書き戻し
        fs.writeFileSync(scriptPath, updatedContent, 'utf8');
        
        console.log('✅ ポートフォリオの更新完了！');
        console.log(`📂 次にアプリフォルダを作成: apps/${folderName}/`);
        console.log(`🌐 ライブURL: https://euro0707.github.io/app100/apps/${folderName}/`);
        
    } catch (error) {
        console.error('❌ エラー:', error.message);
        process.exit(1);
    }
}

function slugify(text) {
    if (!text) return 'app';
    
    // 日本語の場合はローマ字変換の代わりにシンプルな変換
    const japanese = {
        '時計': 'clock', '学習': 'learning', 'アプリ': 'app',
        'タイマー': 'timer', 'ゲーム': 'game', 'クイズ': 'quiz',
        '数': 'number', '動物': 'animal', '記憶': 'memory',
        '色': 'color', '形': 'shape', '乗り物': 'vehicle',
        'パズル': 'puzzle', 'おえかき': 'drawing', '算数': 'math',
        'ドア': 'door', 'めいろ': 'maze'
    };
    
    // 日本語を英語に変換
    let result = text;
    for (const [jp, en] of Object.entries(japanese)) {
        result = result.replace(new RegExp(jp, 'g'), en);
    }
    
    // 残った日本語文字を除去してslugify
    return result
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 非英数字を除去
        .replace(/[\s_-]+/g, '-') // スペースをハイフンに
        .replace(/^-+|-+$/g, '') // 前後のハイフンを除去
        .substring(0, 30) || 'app'; // 空になった場合は'app'
}

// コマンドライン実行
const args = process.argv.slice(2);

if (args.length < 3) {
    console.log(`
📱 App100 - 超シンプルアプリ追加ツール

使用方法:
  node tools/add-app-simple.js [ID] [タイトル] [説明] [カテゴリ]

例:
  node tools/add-app-simple.js 008 "時計アプリ" "時計の読み方を学ぶ" education
    `);
    process.exit(0);
}

const [id, title, description, category] = args;
addAppToPortfolio(id, title, description, category);
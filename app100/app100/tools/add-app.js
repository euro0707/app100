#!/usr/bin/env node

/**
 * App100 - シンプルアプリ追加ツール
 * 使用方法: node tools/add-app.js [ID] [タイトル] [説明] [カテゴリ]
 * 例: node tools/add-app.js 008 "タイマーアプリ" "集中力を高める学習用タイマー" education
 */

const fs = require('fs');
const path = require('path');

class SimpleAppAdder {
    constructor() {
        this.portfolioScriptPath = path.resolve(__dirname, '../../portfolio/script.js');
        this.appsDir = path.join(__dirname, '../apps');
    }
    
    async addApp(appData) {
        try {
            console.log('📱 新しいアプリをポートフォリオに追加中...');
            console.log(`   ID: ${appData.id}`);
            console.log(`   タイトル: ${appData.title}`);
            
            // 1. script.js を読み込み
            let scriptContent = fs.readFileSync(this.portfolioScriptPath, 'utf8');
            
            // 2. 新しいアプリデータを作成
            const newAppEntry = this.generateAppEntry(appData);
            
            // 3. 既存のapps配列に追加
            scriptContent = this.insertAppIntoScript(scriptContent, newAppEntry);
            
            // 4. ファイルに書き戻し
            fs.writeFileSync(this.portfolioScriptPath, scriptContent, 'utf8');
            
            console.log('✅ ポートフォリオの更新完了！');
            console.log(`📂 アプリフォルダを作成してください: apps/${appData.id}-${this.slugify(appData.title)}/`);
            console.log(`🌐 ライブURL: https://euro0707.github.io/app100/apps/${appData.id}-${this.slugify(appData.title)}/`);
            
        } catch (error) {
            console.error('❌ エラーが発生しました:', error.message);
            process.exit(1);
        }
    }
    
    generateAppEntry(appData) {
        const folderName = `${appData.id}-${this.slugify(appData.title)}`;
        const today = new Date().toISOString().split('T')[0];
        
        // 技術スタックの推定
        const defaultTechnologies = ['HTML5', 'CSS3', 'JavaScript'];
        const technologies = appData.technologies || defaultTechnologies;
        
        // 機能の推定（簡単なもの）
        const defaultFeatures = ['レスポンシブデザイン', 'モバイル対応'];
        const features = appData.features || defaultFeatures;
        
        return {
            id: appData.id,
            title: appData.title,
            description: appData.description,
            category: appData.category || 'education',
            technologies: technologies,
            liveUrl: `https://euro0707.github.io/app100/apps/${folderName}/`,
            githubUrl: `https://github.com/euro0707/app100/tree/main/app100/apps/${folderName}`,
            completedDate: today,
            features: features,
            image: null,
            status: 'completed'
        };
    }
    
    insertAppIntoScript(scriptContent, newApp) {
        // apps配列の最後に新しいアプリを追加
        const appsArrayStart = scriptContent.indexOf('this.apps = [');
        const appsArrayEnd = scriptContent.indexOf('];', appsArrayStart);
        
        if (appsArrayStart === -1 || appsArrayEnd === -1) {
            throw new Error('apps配列が見つかりません');
        }
        
        // 最後のアプリエントリの後に新しいエントリを挿入
        const beforeArray = scriptContent.substring(0, appsArrayEnd);
        const afterArray = scriptContent.substring(appsArrayEnd);
        
        // 新しいアプリのJSON文字列を生成（きれいな形式で）
        const newAppJSON = this.formatAppJSON(newApp);
        
        // 配列の最後に追加（カンマを追加）
        const updatedContent = beforeArray + ',\n' + newAppJSON + afterArray;
        
        return updatedContent;
    }
    
    formatAppJSON(app) {
        return `            {
                id: '${app.id}',
                title: '${app.title}',
                description: '${app.description}',
                category: '${app.category}',
                technologies: ${JSON.stringify(app.technologies)},
                liveUrl: '${app.liveUrl}',
                githubUrl: '${app.githubUrl}',
                completedDate: '${app.completedDate}',
                features: ${JSON.stringify(app.features)},
                image: ${app.image},
                status: '${app.status}'
            }`;
    }
    
    slugify(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    showUsage() {
        console.log(`
📱 App100 - シンプルアプリ追加ツール

使用方法:
  node tools/add-app.js [ID] [タイトル] [説明] [カテゴリ]

引数:
  ID       - アプリID（3桁の数字、例: 008）
  タイトル - アプリの名前
  説明     - アプリの説明文
  カテゴリ - education, game, utility のいずれか（省略可、デフォルト: education）

例:
  node tools/add-app.js 008 "タイマーアプリ" "集中力を高める学習用タイマー" education
  node tools/add-app.js 009 "じゃんけんゲーム" "コンピューターとじゃんけん勝負" game

注意:
  - 引数にスペースが含まれる場合は必ず "..." で囲んでください
  - アプリIDは既存のものと重複しないようにしてください
  - このツールは portfolio/script.js を直接編集します
        `);
    }
}

// コマンドライン実行
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 3 || args[0] === '--help' || args[0] === '-h') {
        new SimpleAppAdder().showUsage();
        process.exit(0);
    }
    
    const [id, title, description, category] = args;
    
    // 簡単なバリデーション
    if (!/^\d{3}$/.test(id)) {
        console.error('❌ アプリIDは3桁の数字である必要があります（例: 008）');
        process.exit(1);
    }
    
    if (!title || !description) {
        console.error('❌ タイトルと説明は必須です');
        process.exit(1);
    }
    
    const appData = {
        id: id,
        title: title,
        description: description,
        category: category || 'education'
    };
    
    const adder = new SimpleAppAdder();
    adder.addApp(appData);
}

module.exports = SimpleAppAdder;
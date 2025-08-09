#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Day4-7のミニゲームにメインハブに戻るボタンを追加するスクリプト
"""

import os
import re

# メインハブに戻るボタンの関数
RETURN_BUTTON_FUNCTION = '''
    showReturnButton() {
        const returnButton = document.createElement('button');
        returnButton.textContent = '🏠 メインハブに戻る';
        returnButton.style.cssText = `
            background: linear-gradient(45deg, #ff6b35, #ffd700);
            border: none;
            padding: 15px 30px;
            font-size: 1.2em;
            font-weight: bold;
            color: #000;
            border-radius: 25px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
            animation: pulse 2s infinite;
        `;
        returnButton.onclick = () => {
            window.location.href = '../index.html?completed={day}';
        };
        
        document.body.appendChild(returnButton);
    }
'''

def add_return_button_to_day(day_num):
    script_path = f'day{day_num}-minigame/script.js'
    
    if not os.path.exists(script_path):
        print(f"⚠️ {script_path} が見つかりません")
        return False
    
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # showVictoryMessage関数内のupdateHintの後に、ボタン表示と進捗通知を追加
    hint_pattern = r"(\s+this\.updateHint\([^)]*\);)"
    replacement = r'''\1
        
        // メインハブに戻るボタンを表示
        this.showReturnButton();
        
        // 進捗を親ウィンドウに通知
        if (window.parent && window.parent.LinuxQuest) {
            window.parent.LinuxQuest.markDayCompleted(''' + str(day_num) + r''');
        }'''
    
    # updateHintの後に追加
    content = re.sub(hint_pattern, replacement, content)
    
    # showReturnButton関数をupdateSageMessage関数の前に追加
    sage_pattern = r'(\s+}\s+updateSageMessage\(message\)\s*\{)'
    button_function = RETURN_BUTTON_FUNCTION.format(day=day_num)
    content = re.sub(sage_pattern, r'    }' + button_function + r'\1', content)
    
    # ファイルに書き戻し
    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Day{day_num} にメインハブに戻るボタンを追加しました")
    return True

def main():
    print("🔧 Day4-7のミニゲームにメインハブに戻るボタンを追加中...")
    
    for day in [4, 5, 6, 7]:
        success = add_return_button_to_day(day)
        if not success:
            print(f"❌ Day{day} の修正に失敗しました")
        
    print("🎉 すべての修正が完了しました！")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cursor自动化工具（改进版）：打开开发者工具并执行cursor_auto_resume.js脚本
"""

import pyautogui
import time
import os
import sys
import pyperclip
import keyboard

# 确保脚本运行安全
pyautogui.PAUSE = 0.5  # 操作之间暂停0.5秒
pyautogui.FAILSAFE = True  # 启用安全机制，移动鼠标到屏幕左上角将中断脚本

def main():
    print("\n======= Cursor自动化工具(改进版)启动中 =======")
    print("此工具将执行以下步骤：")
    print("1. 读取cursor_auto_resume.js文件内容")
    print("2. 复制到剪贴板")
    print("3. 打开开发者工具 (Ctrl+Shift+I)")
    print("4. 切换到控制台")
    print("5. 点击控制台区域")
    print("6. 粘贴脚本内容并执行")
    print("=====================================\n")
    
    # 1. 读取cursor_auto_resume.js文件内容
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        js_file_path = os.path.join(script_dir, "cursor_auto_resume.js")
        
        print(f"正在读取文件: {js_file_path}")
        with open(js_file_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # 将JS内容复制到剪贴板
        pyperclip.copy(js_content)
        print("√ 已将脚本内容复制到剪贴板")
        
        # 显示文件的前30个字符，确认内容已复制
        preview = js_content[:30].replace('\n', ' ')
        print(f"  预览: {preview}...")
    except Exception as e:
        print(f"✗ 无法读取cursor_auto_resume.js文件: {str(e)}")
        return

    # 2. 等待用户聚焦到Cursor窗口
    print("\n请确保Cursor已打开，并在1秒内点击Cursor窗口使其处于活动状态...")
    for i in range(1, 0, -1):
        print(f"倒计时: {i}秒...")
        time.sleep(0.5)

    print("\n开始执行自动化操作...")

    try:
        # 3. 打开开发者工具 (Ctrl+Shift+I)
        print("\n第1步: 正在打开开发者工具 (Ctrl+Shift+I)...")
        print(">> 按下组合键: Ctrl+Shift+I")
        
        # 方法1: 使用pyautogui
        pyautogui.hotkey('ctrl', 'shift', 'i')
        
        time.sleep(0.5)
        
        print("   等待1秒，确保开发者工具完全打开...")
        time.sleep(1)  # 增加延迟，等待开发者工具打开
        
        # 4. 切换到Console选项卡
        print("\n第2步: 正在切换到控制台...")
        
        # 多种方法尝试切换到Console
        print(">> 方法1: 按下Esc键两次，确保Console面板可见")
        pyautogui.press('escape', presses=2, interval=0.3)
        time.sleep(0.5)
        
        # 5. 点击控制台区域
        print("\n第3步: 正在点击控制台区域...")
        # 获取屏幕中心位置（假设开发者工具在整个屏幕的底部）
        screen_width, screen_height = pyautogui.size()
        # 点击屏幕下方区域（可能需要根据实际情况调整坐标）
        console_x = screen_width // 2
        console_y = int(screen_height * 0.7)  # 屏幕高度的70%位置
        
        print(f">> 点击坐标: ({console_x}, {console_y})")
        pyautogui.click(console_x, console_y)
        time.sleep(0.5)
        
        # 6. 粘贴脚本内容
        print("\n第4步: 正在粘贴脚本内容...")
        
        # 尝试多种粘贴方法
        print(">> 方法1: 按下Ctrl+V粘贴")
        pyautogui.hotkey('ctrl', 'v')
        time.sleep(0.5)
        
        # 7. 按回车执行
        print("\n第5步: 按回车执行脚本...")
        print(">> 按下Enter键")
        pyautogui.press('enter')
        time.sleep(0.5)
      
        print("\n✓ 操作完成！脚本已执行。")
        
        # 8. 按Alt+F4关闭开发者工具
        print("\n第6步: 关闭开发者工具...")
        print(">> 按下Alt+F4")
        time.sleep(0.5)  # 等待0.5秒，确保脚本已执行
        pyautogui.hotkey('alt', 'f4')  # 按下Alt+F4关闭当前窗口
        
    except Exception as e:
        print(f"\n✗ 执行过程中出错: {str(e)}")

if __name__ == "__main__":
    print("===== Cursor自动化工具(改进版) =====")
    print("此脚本将自动打开Cursor开发者工具，并执行cursor_auto_resume.js")
    print("按Enter键开始执行，按Ctrl+C取消")
    try:
        input("\n按Enter键继续...")
        main()
    except KeyboardInterrupt:
        print("\n操作已取消")
    except Exception as e:
        print(f"程序出错: {str(e)}")
    
    print("\n请查看Cursor是否打开了开发者工具并执行了脚本。")
    print("\n如果仍未执行成功，请尝试手动方法：")
    print("1. 在Cursor中按Ctrl+Shift+I打开开发者工具")
    print("2. 点击Console选项卡")
    print("3. 粘贴剪贴板中的代码并按回车执行")
    
    # 提示用户脚本将自动关闭
    print("\n脚本将在1秒后自动关闭...")
    time.sleep(0.5)
    # 此处不再等待用户输入，脚本会自动退出
    # 不需要 input("按Enter键退出...") 
# Cursor Auto Resume Tool

This project contains two scripts to automatically resume interrupted conversations with Cursor AI assistant.

## File Description

### 1. cursor_auto_resume.js

A browser script that automatically detects and clicks "Resume", "Try again" and other recovery buttons in Cursor.

**Features:**
- Only searches the right 30% area of the page for efficiency
- 5-second cooldown between clicks to avoid excessive clicking
- Supports detecting various interruption messages:
  - "stop the agent after 25 tool calls"
  - "Connection failed"
  - "internet connection or VPN"
  - "Calling MCP tool" etc.
- Supports multiple button types: `<a>`, `<span>`, `<button>` etc.
- Auto checks every 7 seconds

**How it works:**
The script checks specific conditions in Cursor's right chat area (default 30%):
- "Resume" button when hitting 25-tool-call limit
- "Try again" button caused by VPN issues
- "Run tool" button when calling MCP services
This eliminates the need to frequently check if Agent is working (but may consume quota faster due to no 25-call limit)

### 2. cursor_automation.py

A Python automation script that performs:
1. Reads cursor_auto_resume.js content
2. Copies to clipboard
3. Opens Cursor's DevTools (Ctrl+Shift+I)
4. Switches to Console tab
5. Pastes and executes the script

**Features:**
- Uses pyautogui for automation
- Includes FAILSAFE mechanism
- Provides detailed operation prompts
- Supports manual execution instructions

## Usage

### Automatic Execution
1. Ensure Python and dependencies are installed (pyautogui, pyperclip)
2. Run cursor_automation.py
3. Follow the prompts

**Notes:**
1. The "Toggle Developer Tools" (Ctrl+Shift+I) shortcut needs to be set up first:
   - F1 → Developer → Toggle Developer Tools (rightmost settings key binding)
   - Right-click to change when expression → Delete existing (shows as - after Enter) as shown in DevTools.jpg

### Manual Execution
1. Open Cursor
2. Click Help → Toggle Developer Tools
3. Switch to Console tab
4. Paste cursor_auto_resume.js content
5. Press Enter

## Customization & Reuse
- Script supports customizing execution conditions and check area
- Can be adapted for similar apps like Trae

## Dependencies
```bash
pip install pyautogui pyperclip keyboard
```

## Reference
https://github.com/thelastbackspace/cursor-auto-resume
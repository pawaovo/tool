// 优化版 Cursor Auto Resume Script - 仅在右侧区域查找
(function() {
    console.log('Cursor Auto Resume: 已启动（优化版 - 仅右侧区域）');
    
    // 跟踪上次点击时间，避免重复点击
    let lastClickTime = 0;
    
    // 主函数：查找并点击恢复链接
    function clickResumeLink() {
        // 防止频繁点击（5秒冷却时间）
        const now = Date.now();
        if (now - lastClickTime < 5000) return;
        
        // 获取页面宽度，用于确定右侧区域
        const pageWidth = window.innerWidth;
        const rightSideThreshold = pageWidth * 0.7; // 页面右侧30%的区域
        
        // 获取所有可能包含目标文本的元素
        const elements = document.querySelectorAll('body *');
        for (const el of elements) {
            if (!el || !el.textContent) continue;
            
            // 获取元素位置，只处理右侧区域的元素
            const rect = el.getBoundingClientRect();
            if (rect.left < rightSideThreshold) continue;
            
            // 检查元素是否包含限制文本（分段检测）或特定提示信息
            if (el.textContent.includes('stop the agent after 25 tool calls') || 
                el.textContent.includes('Note: we default stop') ||
                el.textContent.includes('Connection failed') ||
                el.textContent.includes('internet connection or VPN') ||
                el.textContent.includes('Calling MCP tool') ||
                el.textContent.includes('File is being') ||
                el.textContent.includes('Reject Ctrl')) {
                
                // 查找恢复链接和按钮
                const links = el.querySelectorAll('a, span, button, [role="link"], [role="button"], [data-link]');
                for (const link of links) {
                    const linkText = link.textContent.trim();
                    if (linkText === 'resume the conversation' ||
                        linkText === 'Resume' ||
                        linkText === 'Try again' ||
                        linkText === 'Run tool'||
                        linkText === 'Accept') {
                        console.log('点击按钮：' + linkText);
                        link.click();
                        lastClickTime = now;
                        return;
                    }
                }
                
                // 向上查找父元素，以防按钮在相邻元素中
                let parent = el.parentElement;
                for (let i = 0; i < 3 && parent; i++) { // 向上最多查找3层
                    // 检查父元素是否仍在右侧区域
                    const parentRect = parent.getBoundingClientRect();
                    if (parentRect.left < rightSideThreshold) {
                        parent = parent.parentElement;
                        continue;
                    }
                    
                    const parentLinks = parent.querySelectorAll('a, span, button, [role="link"], [role="button"], [data-link]');
                    for (const link of parentLinks) {
                        const linkText = link.textContent.trim();
                        if (linkText === 'resume the conversation' ||
                            linkText === 'Resume' ||
                            linkText === 'Try again' ||
                            linkText === 'Run tool'||
                            linkText === 'Accept') {
                            console.log('点击父元素中的按钮：' + linkText);
                            link.click();
                            lastClickTime = now;
                            return;
                        }
                    }
                    parent = parent.parentElement;
                }
                
                // 查找相邻元素中的按钮（仍然限制在右侧区域）
                if (el.nextElementSibling) {
                    const siblingRect = el.nextElementSibling.getBoundingClientRect();
                    if (siblingRect.left >= rightSideThreshold) {
                        const siblingButtons = el.nextElementSibling.querySelectorAll('a, span, button, [role="link"], [role="button"], [data-link]');
                        for (const btn of siblingButtons) {
                            const btnText = btn.textContent.trim();
                            if (btnText === 'Try again' || 
                                btnText === 'Resume' || 
                                btnText === 'resume the conversation' ||
                                btnText === 'Run tool'||
                                btnText === 'Accept') {
                                console.log('点击相邻元素中的按钮：' + btnText);
                                btn.click();
                                lastClickTime = now;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // 每7秒运行一次
    setInterval(clickResumeLink, 7000);
    
    // 立即运行一次
    clickResumeLink();
    
    console.log('自动恢复功能已启用：冷却时间5秒，仅在页面右侧30%区域查找链接');
})();        
/**
 * 当通过 Web 应用 URL 访问时执行此函数。
 * 它会生成并返回 RSS 订阅源。
 */
function doGet(e) {
    // 获取自定义邮件数量参数
    var maxEmails = e && e.parameter && e.parameter.max ? parseInt(e.parameter.max) : null;
  
    // 调用核心函数生成 RSS XML 字符串，传入可选的自定义邮件数量
    var rssXml = generateRssFeed(maxEmails);
  
    // 使用 ContentService 将 XML 字符串作为 XML 输出
    return ContentService.createTextOutput(rssXml)
      .setMimeType(ContentService.MimeType.RSS);
  }
  
  /**
   * 获取 Gmail 邮件并生成 RSS 2.0 XML 字符串。
   *
   * @param {number} [customMaxEmails] - 可选参数，自定义要获取的最大邮件数量
   * @returns {string} 格式化的RSS XML字符串
   */
  function generateRssFeed(customMaxEmails) {
    // --- 配置部分 ---
    var now = new Date();
  
    var feedTitle = "我的 Gmail 精简摘要 RSS"; // RSS Feed 的标题
    var feedLink = ScriptApp.getService().getUrl(); // RSS Feed 的链接 (使用 Web App URL)
    var feedDescription = "来自我 Gmail 收件箱的精简邮件摘要"; // RSS Feed 的描述
    var maxEmails = customMaxEmails || 20; // 使用自定义数量或默认20
    var summaryLength = 150; // 摘要正文的最大长度
  
    var gmailSearchQuery = 'in:inbox is:unread'; // 您可以根据需要修改
  
    // --- 获取邮件 ---
    var threads = GmailApp.search(gmailSearchQuery, 0, maxEmails);
  
    // --- 构建标准RSS XML ---
    var xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n';
    // 移除了 xmlns:content 命名空间，因为不再使用 content:encoded
    xmlOutput += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
    xmlOutput += '  <channel>\n';
    xmlOutput += '    <title>' + encodeXML(feedTitle) + '</title>\n';
    xmlOutput += '    <link>' + encodeXML(feedLink) + '</link>\n';
    xmlOutput += '    <description>' + encodeXML(feedDescription) + '</description>\n';
    xmlOutput += '    <atom:link href="' + encodeXML(feedLink) + '" rel="self" type="application/rss+xml" />\n';
  
    var formattedBuildDate = Utilities.formatDate(now, "GMT", "EEE, dd MMM yyyy HH:mm:ss zzz");
    xmlOutput += '    <lastBuildDate>' + formattedBuildDate + '</lastBuildDate>\n';
    xmlOutput += '    <generator>Gmail to RSS Summarizer</generator>\n';
    xmlOutput += '    <language>zh-CN</language>\n';
  
    // --- 处理每封邮件并创建 <item> 元素 ---
    for (var i = 0; i < threads.length; i++) {
      var thread = threads[i];
      var messages = thread.getMessages();
      var message = messages[messages.length - 1];
  
      var msgSubject = message.getSubject() || "[无主题]";
      var msgFromRaw = message.getFrom(); // 示例: "John Doe" <john.doe@example.com> 或 john.doe@example.com
      var msgDate = message.getDate();
      var msgId = message.getId();
      
      // 提取发件人姓名和地址
      var fromName = msgFromRaw;
      var fromEmail = "";
      var match = msgFromRaw.match(/(.*)<(.*)>/);
      if (match) {
        fromName = match[1].replace(/"/g, '').trim(); // 移除引号并去除首尾空格
        fromEmail = match[2].trim();
      } else {
        // 如果没有明确的姓名部分，尝试将整个作为邮箱地址（或姓名，如果不是标准邮箱格式）
        if (msgFromRaw.includes('@')) {
          fromEmail = msgFromRaw.trim();
          fromName = fromEmail.split('@')[0]; // 简单的从邮箱提取名字的方式
        } else {
          fromName = msgFromRaw.trim(); // 可能只是一个名字
        }
      }
      if (!fromName && fromEmail) { // 如果提取后名字为空但邮箱存在，则用邮箱前缀作名字
          fromName = fromEmail.split('@')[0];
      }
  
  
      // 获取邮件的纯文本内容
      var msgPlainTextBody = message.getPlainBody();
      
      // 清理纯文本邮件正文
      var cleanSummaryText = cleanEmailContent(msgPlainTextBody);
      
      // 创建精简摘要
      var msgSnippet = extractImportantContent(cleanSummaryText, summaryLength);
  
      var msgLink = "https://mail.google.com/mail/u/0/#inbox/" + thread.getId();
      var pubDate = Utilities.formatDate(msgDate, "GMT", "EEE, dd MMM yyyy HH:mm:ss zzz");
  
      // 构建RSS条目的描述 (使用HTML以获得更好的格式控制)
      // 参考Gmail样式：发件人粗体，邮件地址颜色稍浅，然后是摘要
      var itemDescriptionHTML = '<![CDATA[' +
        '<div style="font-family: Arial, sans-serif; font-size: 14px;">' +
        '  <strong style="color: #202124;">' + encodeXML(fromName) + '</strong>' +
        (fromEmail ? ' <span style="color: #5f6368; font-size: 0.9em;">&lt;' + encodeXML(fromEmail) + '&gt;</span>' : '') +
        '  <div style="margin-top: 4px; color: #5f6368; font-size: 0.95em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
             encodeXML(msgSnippet) +
        '  </div>' +
        '</div>' +
        ']]>';
  
      xmlOutput += '    <item>\n';
      xmlOutput += '      <title>' + encodeXML(msgSubject) + '</title>\n'; // 主题仍然是主要标题
      xmlOutput += '      <link>' + encodeXML(msgLink) + '</link>\n';
      xmlOutput += '      <description>' + itemDescriptionHTML + '</description>\n'; // 主要内容放在这里
      // 不再使用 <content:encoded>
      xmlOutput += '      <pubDate>' + pubDate + '</pubDate>\n';
      xmlOutput += '      <author>' + encodeXML(msgFromRaw) + '</author>\n'; // author 标签通常放原始发件人字符串
      xmlOutput += '      <guid isPermaLink="false">' + encodeXML(msgId) + '</guid>\n';
      xmlOutput += '    </item>\n';
    }
  
    if (threads.length === 0) {
      xmlOutput += '    <item>\n';
      xmlOutput += '      <title>没有新邮件</title>\n';
      xmlOutput += '      <description>目前没有符合条件的邮件。</description>\n';
      xmlOutput += '      <pubDate>' + formattedBuildDate + '</pubDate>\n';
      xmlOutput += '      <guid isPermaLink="false">no-new-emails-' + Date.now() + '</guid>\n';
      xmlOutput += '    </item>\n';
    }
  
    xmlOutput += '  </channel>\n';
    xmlOutput += '</rss>';
  
    return xmlOutput;
  }
  
  /**
   * 清理邮件纯文本内容，移除不必要的部分 (用于生成摘要)
   */
  function cleanEmailContent(body) {
    if (!body) return "";
    body = body.replace(/(\r\n|\r|\n){2,}/g, '\n'); // 将多个换行符合并为一个
    var signatureIndex = body.search(/^--+\s*$/m);
    if (signatureIndex > 0) {
      body = body.substring(0, signatureIndex).trim();
    }
    var footerPatterns = [
      /---[\s\S]*?访问话题.*?$/im, /\n-+\s*转发.*?$/im, /\n.*?退订.*?电子邮件.*?$/im,
      /\n.*?要回复.*?请点击.*?$/im, /\nDisclaimer:[\s\S]*?$/im, /\nConfidentiality Notice:[\s\S]*?$/im,
      /\n.*?如果您.*?收到这封邮件.*?请.*?$/im, /\n.*?This email.*?intended.*?$/im
    ];
    for (var i = 0; i < footerPatterns.length; i++) {
      body = body.replace(footerPatterns[i], '');
    }
    body = body.replace(/\n{2,}/g, '\n'); // 再次清理多余空行
    body = body.replace(/\s+/g, ' '); // 将多个连续空白（包括换行）替换为单个空格，使摘要更紧凑
    return body.trim();
  }
  
  /**
   * 从纯文本中提取邮件中的重要内容或生成摘要
   */
  function extractImportantContent(body, maxLength) {
    if (!body) return "";
    body = body.replace(/^(您好|hello|hi|dear|嗨|亲爱的)[,!:：\s]*/i, ''); // 移除简单问候语，不移除其后的换行
    
    // 直接截取处理后的文本
    var snippet = body.substring(0, maxLength);
    if (body.length > maxLength) {
      snippet += "...";
    }
    return snippet;
  }
  
  /**
   * 编码XML特殊字符
   * @param {string} string - 需要编码的字符串
   * @returns {string} 编码后的字符串
   */
  function encodeXML(string) {
    if (string === null || typeof string === 'undefined') return "";
    string = String(string); 
    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  /**
   * 测试函数，帮助调试
   */
  function testRss() {
    try {
      var xmlOutput = generateRssFeed();
      console.log(xmlOutput); // 直接在 Apps Script 编辑器日志中查看完整输出
      if (!xmlOutput.trim().startsWith('<?xml')) {
        console.warn("警告: XML声明不在开头!");
      }
      console.log("RSS生成成功! 请检查日志中的输出。");
    } catch (e) {
      console.error("生成RSS时出错: " + e.toString() + " 在行 " + e.lineNumber + " 堆栈: " + e.stack);
    }
  }
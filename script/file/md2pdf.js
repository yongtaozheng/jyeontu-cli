const htmlPdf = require('html-pdf-node');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require("@jyeontu/j-inquirer");
const PDFLib = require('pdf-lib');

class MarkdownToPdfConverter {
    constructor(obj) {
        this.action = obj.action;
        this.mdFilePath = obj.mdFilePath;
        this.mdDir = obj.mdDir;
        this.pdfDir = obj.pdfFilePath;
    }

    async init() {
        console.log('🚀 初始化Markdown转PDF转换器...');
        await fs.ensureDir(this.pdfDir);
        console.log('✅ 转换器已初始化');
    }

    async convertMdToPdf(mdFilePath) {
        const fileName = path.basename(mdFilePath, '.md');
        const pdfFilePath = path.join(this.pdfDir, `${fileName}.pdf`);
        
        try {
            const content = await fs.readFile(mdFilePath, 'utf-8');
            
            if (content.length > 500000) {
                console.log(`📄 文件较大，将分段处理`);
                await this.convertLargeFile(content, fileName, pdfFilePath);
            } else {
                await this.convertSmallFile(content, fileName, pdfFilePath);
            }
            
            console.log(`✅ 转换完成: ${fileName}.pdf`);
            
        } catch (error) {
            console.error(`❌ 转换失败 ${fileName}:`, error.message);
        }
    }

    async convertSmallFile(content, fileName, pdfFilePath) {
        const htmlContent = this.generateHTML(content, fileName);
        const tempHtmlPath = path.join(__dirname, 'temp_md.html');
        await fs.writeFile(tempHtmlPath, htmlContent, 'utf-8');
        
        try {
            const options = {
                format: 'A4',
                margin: {
                    top: '2cm',
                    right: '2cm',
                    bottom: '2cm',
                    left: '2cm'
                },
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">' + fileName + '</div>',
                footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">第 <span class="pageNumber"></span> 页，共 <span class="totalPages"></span> 页</div>',
                timeout: 120000
            };
            
            const file = { url: `file://${tempHtmlPath}` };
            const buffer = await htmlPdf.generatePdf(file, options);
            await fs.writeFile(pdfFilePath, buffer);
            
        } finally {
            // await fs.remove(tempHtmlPath);
        }
    }

    generateHTML(content, title) {
        const htmlContent = this.markdownToHtml(content);

        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!-- MathJax 配置 -->
    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['\\\\(', '\\\\)']],
                displayMath: [['\\\\[', '\\\\]']],
                processEscapes: true,
                processEnvironments: true,
                packages: ['base', 'ams', 'noerrors', 'noundefined']
            },
            options: {
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process',
                enableMenu: false,
                menuOptions: {
                    settings: {
                        texHints: true,
                        semantics: false,
                        zoom: 'NoZoom'
                    }
                }
            },
            startup: {
                pageReady: () => {
                    return MathJax.startup.defaultPageReady().then(() => {
                        console.log('MathJax is loaded');
                    });
                }
            },
            loader: {
                load: ['[tex]/ams', '[tex]/noerrors', '[tex]/noundefined']
            }
        };
    </script>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        body {
            font-family: 'Microsoft YaHei', 'SimSun', 'SimHei', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: white;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.25em; }
        h4 { font-size: 1em; }
        h5 { font-size: 0.875em; }
        h6 { font-size: 0.85em; }
        p {
            margin: 0.8em 0;
            line-height: 1.8;
        }
        /* 行内代码样式 */
        code {
            background-color: #f1f3f4;
            color: #d73a49;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Courier New', monospace;
            font-size: 0.85em;
            border: 1px solid #e1e4e8;
            white-space: nowrap;
        }
        
        /* 代码块样式 */
        pre {
            background-color: #f6f8fa;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 16px;
            margin: 16px 0;
            overflow-x: auto;
            position: relative;
        }
        
        /* 代码块内的代码样式 */
        pre code {
            background-color: transparent;
            color: #24292e;
            padding: 0;
            border: none;
            border-radius: 0;
            font-size: 0.9em;
            line-height: 1.45;
            white-space: pre;
            word-wrap: normal;
            display: block;
        }
        
        /* 语法高亮样式 */
        .hljs-keyword { color: #d73a49; }
        .hljs-string { color: #032f62; }
        .hljs-comment { color: #6a737d; font-style: italic; }
        .hljs-function { color: #6f42c1; }
        .hljs-number { color: #005cc5; }
        .hljs-operator { color: #d73a49; }
        .hljs-variable { color: #24292e; }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 1.5em 0;
            padding: 16px 20px;
            color: #6a737d;
            background-color: #f6f8fa;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        blockquote::before {
            content: '"';
            font-size: 3em;
            color: #3498db;
            position: absolute;
            left: 10px;
            top: -10px;
            font-family: serif;
            opacity: 0.3;
            z-index: 0;
        }
        
        blockquote p {
            margin: 0.8em 0;
            line-height: 1.6;
            position: relative;
            z-index: 1;
            text-align: justify;
            white-space: pre-line; /* 保持换行 */
            min-height: 1.2em; /* 确保空段落有最小高度 */
        }
        
        blockquote p:first-child {
            margin-top: 0;
        }
        
        blockquote p:last-child {
            margin-bottom: 0;
        }
        
        /* 空段落样式 */
        blockquote p:empty,
        blockquote p:blank {
            min-height: 1.2em;
            margin: 0.4em 0;
        }
        
        blockquote br {
            display: block;
            content: "";
            margin: 0.3em 0;
        }
        
        blockquote strong {
            color: #24292f;
            font-weight: 600;
            font-style: normal;
        }
        
        blockquote code {
            background-color: #e1e4e8;
            color: #d73a49;
            font-style: normal;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        blockquote em {
            font-style: italic;
        }
        
        /* 引用块内的列表样式 */
        blockquote ul, blockquote ol {
            margin: 0.5em 0;
            padding-left: 1.5em;
        }
        
        blockquote li {
            margin: 0.2em 0;
            line-height: 1.4;
        }
        
        blockquote ul {
            list-style-type: disc;
        }
        
        blockquote ol {
            list-style-type: decimal;
        }
        
        blockquote ul ul {
            list-style-type: circle;
        }
        
        blockquote ol ol {
            list-style-type: lower-alpha;
        }
        ul, ol {
            margin: 0.8em 0;
            padding-left: 2em;
        }
        
        ul ul, ol ol, ul ol, ol ul {
            margin: 0.5em 0;
            padding-left: 1.5em;
        }
        
        li {
            margin: 0.3em 0;
            line-height: 1.6;
        }
        
        li li {
            margin: 0.2em 0;
        }
        
        /* 列表样式 */
        ul {
            list-style-type: disc;
        }
        
        ul ul {
            list-style-type: circle;
        }
        
        ul ul ul {
            list-style-type: square;
        }
        
        ol {
            list-style-type: decimal;
        }
        
        ol ol {
            list-style-type: lower-alpha;
        }
        
        ol ol ol {
            list-style-type: lower-roman;
        }
        
        /* 表格样式 */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
            font-size: 0.9em;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            overflow: hidden;
        }
        
        thead {
            background-color: #f6f8fa;
        }
        
        tbody tr:nth-child(even) {
            background-color: #f6f8fa;
        }
        
        tbody tr:hover {
            background-color: #f0f0f0;
        }
        
        th, td {
            border: 1px solid #d0d7de;
            padding: 12px 16px;
            text-align: left;
            vertical-align: top;
            word-wrap: break-word;
        }
        
        th {
            font-weight: 600;
            color: #24292f;
            background-color: #f6f8fa;
        }
        
        /* 图片样式 */
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 16px auto;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        @page {
            size: A4;
            margin: 2cm;
        }
        
        /* 数学公式样式 */
        .math-inline {
            display: inline;
        }
        
        .math-block {
            text-align: center;
            margin: 1em 0;
            padding: 0.5em 0;
        }
        
        /* MathJax 样式优化 */
        .MathJax {
            font-size: 1em;
        }
        
        .MathJax_Display {
            margin: 1em 0;
        }
    </style>
</head>
<body>
    <div class="title">${title}</div>
    ${htmlContent}
</body>
</html>`;
    }

    markdownToHtml(markdown) {
        let html = markdown;
        
        // 第一步：处理代码块（必须在所有其他处理之前）
        html = this.processCodeBlocks(html);
        
        // 第二步：处理标题
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // 第三步：处理行内代码
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 第四步：处理数学公式
        html = this.processMathFormulas(html);
        
        // 第五步：处理粗体和斜体
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 第六步：处理链接和图片
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');
        
        // 第七步：处理列表
        html = this.processLists(html);
        
        // 第八步：处理引用块
        html = this.processBlockquotes(html);
        
        // 第九步：处理分割线
        html = html.replace(/^---$/gim, '<hr>');
        
        // 第十步：处理表格
        html = this.processTables(html);
        
        // 第十一步：处理段落
        html = this.processParagraphs(html);
        
        return html;
    }
    
    processCodeBlocks(html) {
        // 使用占位符保护代码块内容
        const codeBlocks = [];
        let blockIndex = 0;
        
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            const placeholder = `__CODE_BLOCK_${blockIndex}__`;
            codeBlocks[blockIndex] = { language, code: code.trim() };
            blockIndex++;
            return placeholder;
        });
        
        // 处理其他内容...
        // 这里暂时返回，后续会重新插入代码块
        
        // 重新插入代码块
        codeBlocks.forEach((block, index) => {
            const placeholder = `__CODE_BLOCK_${index}__`;
            const codeHtml = `<pre><code class="language-${block.language}">${block.code}</code></pre>`;
            html = html.replace(placeholder, codeHtml);
        });
        
        return html;
    }
    
    processTables(html) {
        return html.replace(/(\|.*\|[\r\n]+)+/g, (match) => {
            const lines = match.trim().split('\n');
            if (lines.length < 2) return match;
            
            let tableHtml = '<table>\n';
            
            lines.forEach((line, index) => {
                const cells = line.split('|').filter(cell => cell.trim() !== '');
                if (cells.length === 0) return;
                
                if (index === 0) {
                    // 表头
                    tableHtml += '<thead>\n<tr>\n';
                    cells.forEach(cell => {
                        tableHtml += `<th>${cell.trim()}</th>\n`;
                    });
                    tableHtml += '</tr>\n</thead>\n';
                } else if (index === 1) {
                    // 分隔行，跳过
                    return;
                } else {
                    // 数据行
                    if (index === 2) tableHtml += '<tbody>\n';
                    tableHtml += '<tr>\n';
                    cells.forEach(cell => {
                        tableHtml += `<td>${cell.trim()}</td>\n`;
                    });
                    tableHtml += '</tr>\n';
                }
            });
            
            tableHtml += '</tbody>\n</table>';
            return tableHtml;
        });
    }
    
    processParagraphs(html) {
        // 处理段落
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/^(.+)$/gm, '<p>$1</p>');
        
        // 清理多余的段落标签
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>.*<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ol>.*<\/ol>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
        html = html.replace(/<p>(<table>.*<\/table>)<\/p>/g, '$1');
        html = html.replace(/<p>(<li>.*<\/li>)<\/p>/g, '$1');
        
        return html;
    }
    
    processLists(html) {
        // 处理无序列表
        html = this.processUnorderedLists(html);
        // 处理有序列表
        html = this.processOrderedLists(html);
        return html;
    }
    
    processUnorderedLists(html) {
        const lines = html.split('\n');
        const result = [];
        let inList = false;
        let listItems = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const listMatch = line.match(/^(\s*)[*\-+] (.+)$/);
            
            if (listMatch) {
                const indent = listMatch[1].length;
                const content = listMatch[2];
                
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                
                listItems.push({ indent, content });
            } else {
                if (inList) {
                    result.push(this.buildNestedList(listItems, 'ul'));
                    listItems = [];
                    inList = false;
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push(this.buildNestedList(listItems, 'ul'));
        }
        
        return result.join('\n');
    }
    
    processOrderedLists(html) {
        const lines = html.split('\n');
        const result = [];
        let inList = false;
        let listItems = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const listMatch = line.match(/^(\s*)\d+\. (.+)$/);
            
            if (listMatch) {
                const indent = listMatch[1].length;
                const content = listMatch[2];
                
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                
                listItems.push({ indent, content });
            } else {
                if (inList) {
                    result.push(this.buildNestedList(listItems, 'ol'));
                    listItems = [];
                    inList = false;
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push(this.buildNestedList(listItems, 'ol'));
        }
        
        return result.join('\n');
    }
    
    buildNestedList(items, listType) {
        if (items.length === 0) return '';
        
        const result = [];
        let currentLevel = 0;
        let currentList = [];
        
        for (const item of items) {
            const level = Math.floor(item.indent / 2);
            
            if (level > currentLevel) {
                // 开始新的嵌套列表
                currentList.push('<li>' + item.content);
                currentList.push(`<${listType}>`);
                currentLevel = level;
            } else if (level < currentLevel) {
                // 结束嵌套列表
                while (currentLevel > level) {
                    currentList.push(`</${listType}>`);
                    currentList.push('</li>');
                    currentLevel--;
                }
                currentList.push('<li>' + item.content + '</li>');
            } else {
                // 同级列表项
                currentList.push('<li>' + item.content + '</li>');
            }
        }
        
        // 关闭所有未关闭的列表
        while (currentLevel >= 0) {
            currentList.push(`</${listType}>`);
            if (currentLevel > 0) {
                currentList.push('</li>');
            }
            currentLevel--;
        }
        
        return `<${listType}>` + currentList.join('') + `</${listType}>`;
    }
    
    processBlockquotes(html) {
        const lines = html.split('\n');
        const result = [];
        let inBlockquote = false;
        let blockquoteLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // 检查是否是引用行（包括空行）
            if (line.trim() === '' && inBlockquote) {
                // 空行，继续引用块
                blockquoteLines.push('');
            } else if (line.trim().startsWith('>')) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines = [];
                }
                // 移除开头的 ">" 并添加到引用行数组
                const content = line.replace(/^>\s*/, '');
                blockquoteLines.push(content);
            } else {
                // 如果不是引用行，结束当前的引用块
                if (inBlockquote) {
                    const blockquoteContent = this.processBlockquoteContent(blockquoteLines.join('\n'));
                    result.push(`<blockquote>${blockquoteContent}</blockquote>`);
                    blockquoteLines = [];
                    inBlockquote = false;
                }
                result.push(line);
            }
        }
        
        // 处理文件末尾的引用块
        if (inBlockquote) {
            // 去掉结尾的空行
            while (blockquoteLines.length > 0 && blockquoteLines[blockquoteLines.length - 1].trim() === '') {
                blockquoteLines.pop();
            }
            const blockquoteContent = this.processBlockquoteContent(blockquoteLines.join('\n'));
            result.push(`<blockquote>${blockquoteContent}</blockquote>`);
        }
        
        return result.join('\n');
    }
    
    processBlockquoteContent(content) {
        // 处理引用块内的markdown语法
        let processedContent = content;
        
        // 处理行内代码（必须在粗体斜体之前）
        processedContent = processedContent.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理粗体和斜体
        processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedContent = processedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 处理链接
        processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // 处理引用块内的列表
        processedContent = this.processBlockquoteLists(processedContent);
        
        // 处理段落 - 修复版本，包含空行
        const lines = processedContent.split('\n');
        const paragraphs = [];
        let currentParagraph = [];
        
        for (const line of lines) {
            if (line.trim() === '') {
                // 空行表示段落分隔
                if (currentParagraph.length > 0) {
                    paragraphs.push(currentParagraph.join('\n')); // 保持换行
                    currentParagraph = [];
                }
                // 添加空段落，保持背景色
                paragraphs.push('');
            } else {
                // 非空行添加到当前段落
                currentParagraph.push(line);
            }
        }
        
        // 处理最后一个段落
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join('\n')); // 保持换行
        }
        
        // 去掉结尾的空段落
        while (paragraphs.length > 0 && paragraphs[paragraphs.length - 1] === '') {
            paragraphs.pop();
        }
        
        // 包装成段落标签，保持换行，空段落也包装
        processedContent = paragraphs.map(p => {
            if (p === '') {
                return '<p>&nbsp;</p>'; // 空段落使用空格保持背景色
            }
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        }).join('');
        
        return processedContent;
    }
    
    processBlockquoteLists(content) {
        // 处理引用块内的无序列表
        content = content.replace(/(^|\n)- (.+?)(?=\n(?!- )|$)/gms, (match, before, item) => {
            return `${before}<li>${item}</li>`;
        });
        
        // 处理引用块内的有序列表
        content = content.replace(/(^|\n)\d+\. (.+?)(?=\n(?!\d+\. )|$)/gms, (match, before, item) => {
            return `${before}<li>${item}</li>`;
        });
        
        // 包装列表项
        content = content.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        return content;
    }
    
    processMathFormulas(html) {
        // 处理块级数学公式 $$...$$（必须在行内公式之前）
        html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">\\[$1\\]</div>');
        
        // 处理行内数学公式 $...$（排除已经在块级公式中的内容）
        html = html.replace(/(?<!\\\[)(?<!\\\()\$([^\$\n]+?)\$/g, '<span class="math-inline">\\($1\\)</span>');
        
        return html;
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    async convertAll() {
        try {
            await this.init();

            if (this.action == "单文件转换") {
                const fileName = path.basename(this.mdFilePath, '.md');
                console.log(`📖 正在转换: ${fileName}`);
                await this.convertMdToPdf(this.mdFilePath);
                return;
            }

            // 获取所有md文件
            const files = await fs.readdir(this.mdDir);
            const mdFiles = files.filter(file => file.toLowerCase().endsWith('.md'));
            
            if (mdFiles.length === 0) {
                console.log('📁 md目录中没有找到任何.md文件');
                return;
            }
            
            console.log(`📚 找到 ${mdFiles.length} 个md文件，开始转换...`);
            
            // 逐个转换文件
            for (let i = 0; i < mdFiles.length; i++) {
                console.log(`📖 正在转换第 ${i + 1}/${mdFiles.length} 个文件: ${mdFiles[i]}`);
                const file = mdFiles[i];
                const mdFilePath = path.join(this.mdDir, file);
                await this.convertMdToPdf(mdFilePath);
            }
            
            console.log('🎉 所有文件转换完成！');
            
        } catch (error) {
            console.error('❌ 转换过程中发生错误:', error);
        }
    }
}

const baseDir = process.cwd();
const getConfig = async () => {
  const actionType = await new inquirer([
    {
      type: "list",
      message: "请选择要进行的操作：",
      name: "action",
      choices: ["单文件转换", "批量转换"],
    },
  ]).prompt();
  const options = [];
  if (actionType.action == "单文件转换") {
    options.push({
      type: "file",
      message: "请选择需要转换的markdown文件：",
      name: "mdFilePath",
      dirname: baseDir,
      pathType: "absolute",
    })
  }else{
    options.push({
      type: "folder",
      message: "请选择需要批量转换的目录：",
      name: "mdDir",
      dirname: baseDir,
      pathType: "absolute",
    })
  }
  options.push({
    type: "folder",
    message: "请选择输出的pdf目录：",
    name: "pdfFilePath",
    dirname: baseDir,
    pathType: "absolute",
  })
  const answers = await new inquirer(options).prompt();
  return {
    ...actionType,
    ...answers
  }
}

const md2pdf = async () => {
  const res = await getConfig();
  console.log(res);
  const converter = new MarkdownToPdfConverter(res);
  await converter.convertAll();
}

module.exports = md2pdf;

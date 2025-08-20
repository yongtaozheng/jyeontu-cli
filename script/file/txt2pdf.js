const htmlPdf = require('html-pdf-node');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require("@jyeontu/j-inquirer");
const PDFLib = require('pdf-lib');

class TxtToPdfConverter {
    constructor(obj) {
        this.action = obj.action;
        this.txtFilePath = obj.txtFilePath;
        this.txtDir = obj.txtDir;
        this.pdfDir = obj.pdfFilePath;
    }

    async init() {
        console.log('🚀 初始化PDF转换器...');
        
        // 确保PDF目录存在
        await fs.ensureDir(this.pdfDir);
        
        console.log('✅ 转换器已初始化');
    }

    async convertTxtToPdf(txtFilePath) {
        const fileName = path.basename(txtFilePath, '.txt');
        const pdfFilePath = path.join(this.pdfDir, `${fileName}.pdf`);
        
        // console.log(`📖 正在转换: ${fileName}`);
        
        try {
            // 读取txt文件内容
            const content = await fs.readFile(txtFilePath, 'utf-8');
            
            // 检查文件大小，如果太大则分段处理
            if (content.length > 500000) { // 50万字符
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
        // 生成HTML内容
        const htmlContent = this.generateHTML(content, fileName);
        
        // 创建临时HTML文件
        const tempHtmlPath = path.join(__dirname, 'temp.html');
        await fs.writeFile(tempHtmlPath, htmlContent, 'utf-8');
        
        try {
            // 配置PDF选项
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
                timeout: 120000 // 增加超时时间到2分钟
            };
            
            // 生成PDF
            const file = { url: `file://${tempHtmlPath}` };
            const buffer = await htmlPdf.generatePdf(file, options);
            
            // 保存PDF文件
            await fs.writeFile(pdfFilePath, buffer);
            
        } finally {
            // 删除临时HTML文件
            await fs.remove(tempHtmlPath);
        }
    }

    async convertLargeFile(content, fileName, pdfFilePath) {
        // 将大文件分段处理
        const segments = this.splitContent(content, 300000); // 每段30万字符
        
        // 检查是否已经存在分割的PDF文件
        const existingParts = [];
        for (let i = 0; i < segments.length; i++) {
            const partFileName = pdfFilePath.replace('.pdf', `_part${i + 1}.pdf`);
            if (await fs.pathExists(partFileName)) {
                existingParts.push(partFileName);
            }
        }
        
        // 如果所有分割文件都存在，直接合并
        if (existingParts.length === segments.length) {
            console.log(`📄 发现已存在的分割文件，直接合并: ${fileName}`);
            await this.mergeExistingParts(existingParts, pdfFilePath, fileName);
            return;
        }
        
        // 否则重新生成分割文件
        const pdfBuffers = [];
        
        for (let i = 0; i < segments.length; i++) {
            console.log(`📄 处理第 ${i + 1}/${segments.length} 段`);
            
            const segmentTitle = segments.length > 1 ? `${fileName} (第${i + 1}部分)` : fileName;
            const htmlContent = this.generateHTML(segments[i], segmentTitle);
            
            // 创建临时HTML文件
            const tempHtmlPath = path.join(__dirname, `temp_${i}.html`);
            await fs.writeFile(tempHtmlPath, htmlContent, 'utf-8');
            existingParts.push(tempHtmlPath);
            
            try {
                // 配置PDF选项
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
                    headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">' + segmentTitle + '</div>',
                    footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">第 <span class="pageNumber"></span> 页，共 <span class="totalPages"></span> 页</div>',
                    timeout: 180000 // 3分钟超时
                };
                
                // 生成PDF
                const file = { url: `file://${tempHtmlPath}` };
                const buffer = await htmlPdf.generatePdf(file, options);
                pdfBuffers.push(buffer);
                
            } finally {
                // 删除临时HTML文件
                await fs.remove(tempHtmlPath);
            }
        }
        
        // 合并PDF文件
        if (pdfBuffers.length === 1) {
            await fs.writeFile(pdfFilePath, pdfBuffers[0]);
        } else {
            console.log(`📄 合并分割文件`);
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (const pdfBuffer of pdfBuffers) {
                const partPdf = await PDFLib.PDFDocument.load(pdfBuffer);
                const copiedPages = await mergedPdf.copyPages(partPdf, partPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            await fs.writeFile(pdfFilePath, mergedPdfBytes);
            console.log(`✅ 大文件合并完成`);
        }
    }

    async mergeExistingParts(partFiles, outputPath, fileName) {
        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            
            for (const partFile of partFiles) {
                const partBuffer = await fs.readFile(partFile);
                const partPdf = await PDFLib.PDFDocument.load(partBuffer);
                const copiedPages = await mergedPdf.copyPages(partPdf, partPdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            
            const mergedPdfBytes = await mergedPdf.save();
            await fs.writeFile(outputPath, mergedPdfBytes);
            
            console.log(`✅ 合并完成: ${fileName}.pdf`);
            
            // 删除分割文件
            for (const partFile of partFiles) {
                await fs.remove(partFile);
                console.log(`🗑️ 已删除分割文件: ${path.basename(partFile)}`);
            }
            
        } catch (error) {
            console.error(`❌ 合并PDF文件失败: ${error.message}`);
            throw error;
        }
    }

    splitContent(content, maxLength) {
        const segments = [];
        const lines = content.split('\n');
        let currentSegment = '';
        
        for (const line of lines) {
            if ((currentSegment + line + '\n').length > maxLength && currentSegment.length > 0) {
                segments.push(currentSegment.trim());
                currentSegment = line + '\n';
            } else {
                currentSegment += line + '\n';
            }
        }
        
        if (currentSegment.trim().length > 0) {
            segments.push(currentSegment.trim());
        }
        
        return segments;
    }

    generateHTML(content, title) {
        // 处理文本内容，将换行符转换为HTML段落
        const paragraphs = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => `<p style="margin: 0.5em 0; line-height: 1.6;">${this.escapeHtml(line)}</p>`)
            .join('');

        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
        p {
            text-indent: 2em;
            margin: 0.5em 0;
            line-height: 1.8;
        }
        @page {
            size: A4;
            margin: 2cm;
        }
    </style>
</head>
<body>
    <div class="title">${title}</div>
    ${paragraphs}
</body>
</html>`;
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
                const fileName = path.basename(this.txtFilePath, '.txt');
                console.log(`📖 正在转换: ${fileName}`);
                await this.convertTxtToPdf(this.txtFilePath);
                return;
            }

            
            // 获取所有txt文件
            const files = await fs.readdir(this.txtDir);
            const txtFiles = files.filter(file => file.toLowerCase().endsWith('.txt'));
            
            if (txtFiles.length === 0) {
                console.log('📁 txt目录中没有找到任何.txt文件');
                return;
            }
            
            console.log(`📚 找到 ${txtFiles.length} 个txt文件，开始转换...`);
            
            // 逐个转换文件
            for (let i = 0; i < txtFiles.length; i++) {
                console.log(`📖 正在转换第 ${i + 1}/${txtFiles.length} 个文件: ${txtFiles[i]}`);
                const file = txtFiles[i];
                const txtFilePath = path.join(this.txtDir, file);
                await this.convertTxtToPdf(txtFilePath);
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
      message: "请选择需要转换的txt文件：",
      name: "txtFilePath",
      dirname: baseDir,
      pathType: "absolute",
    })
  }else{
    options.push({
      type: "folder",
      message: "请选择需要批量转换的目录：",
      name: "txtDir",
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

const txt2pdf = async () => {
  const res = await getConfig();
  console.log(res);
  const converter = new TxtToPdfConverter(res);
  await converter.convertAll();

}

module.exports = txt2pdf

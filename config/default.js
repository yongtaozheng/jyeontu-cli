module.exports = {
  // 默认配置
  defaults: {
    gitRemote: 'origin',
    devBranch: 'develop',
    outputDir: 'output',
    tempDir: 'temp'
  },
  
  // 文件类型配置
  fileTypes: {
    images: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    documents: ['txt', 'pdf', 'doc', 'docx'],
    code: ['js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss']
  },
  
  // 进度条配置
  progressBar: {
    duration: 100,
    block: "█",
    showNumber: true,
    color: "blue"
  },
  
  // 模板仓库配置
  templates: {
    repository: "https://gitee.com/zheng_yongtao/jyeontu-templates.git",
    chromeExtension: "https://gitee.com/zheng_yongtao/vue-chrome-extension-quickstart.git"
  },
  
  // 超时配置
  timeouts: {
    pdfGeneration: 120000, // 2分钟
    imageDownload: 30000,  // 30秒
    gitOperation: 60000    // 1分钟
  }
};

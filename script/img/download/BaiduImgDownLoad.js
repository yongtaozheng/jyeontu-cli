const axios = require("axios");
const fs = require("fs");
const ProgressBar = require("@jyeontu/progress-bar");
const progressBarConfig = {
  duration: 100,
  current: 0,
  block: "█",
  showNumber: true,
  tip: { 0: "下载中……", 100: "已完成" },
  color: "white",
};
const progressBar = new ProgressBar(progressBarConfig);

class BaiduImgDownLoad {
  constructor(config) {
    this.config = config;
    this.config.num = 0;
  }
  progressBarRun(num) {
    const { startPage, endPage } = this.config;
    const all = (endPage - startPage + 1) * 30;
    if (num !== undefined) this.config.num = num;
    else this.config.num++;
    progressBar.run(Math.floor((this.config.num / all) * 100));
  }
  async getSearchResults() {
    this.progressBarRun(0);
    const { searchQuery, startPage, endPage } = this.config;
    for (let i = startPage; i <= endPage; i++) {
      let page = i;
      this.config.page = (page - 1) * 30 + 1;
      const searchUrl = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&query=${encodeURIComponent(
        searchQuery
      )}&word=${encodeURIComponent(searchQuery)}&pn=${page}`;
      try {
        const response = await axios.get(searchUrl);
        const imageData = response.data;
        // 在这里处理API返回的图片数据
        this.processImageData(imageData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  async processImageData(imageData) {
    const { searchQuery, page } = this.config;
    const imageLinks = [];
    // 解析图片数据并提取图片链接
    for (const result of imageData.data) {
      if (result.middleURL) {
        imageLinks.push(result.middleURL);
      }
    }
    // 下载图片
    for (let i = 0; i < imageLinks.length; i++) {
      const imageUrl = imageLinks[i];
      const filename = `${searchQuery}_${Number(page) + i}.jpg`;
      await this.downloadImage(imageUrl, filename);
      //   console.log(`Downloaded: ${filename}`);
      this.progressBarRun();
    }
  }
  async downloadImage(imageUrl, filename) {
    const { outputFolder } = this.config;
    const imagePath = `${outputFolder}/${filename}`;
    const writer = fs.createWriteStream(imagePath);
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
}

module.exports = BaiduImgDownLoad;

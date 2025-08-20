const ProgressBar = require("@jyeontu/progress-bar");

// 公共进度条配置
const progressBarConfig = {
  duration: 100,
  current: 0,
  block: "█",
  showNumber: true,
  tip: { 0: "请稍等……", 100: "已完成" },
  color: "blue",
};

// 创建进度条实例
const createProgressBar = (config = {}) => {
  return new ProgressBar({ ...progressBarConfig, ...config });
};

// 错误处理工具
const handleError = (error, context = '') => {
  console.error(`❌ ${context}错误:`, error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
};

// 文件类型检查
const IMG_TYPES = ["jpg", "png", "jpeg", "gif", "webp"];
const checkImgType = (file) => {
  const tmp = file.split(".");
  return IMG_TYPES.includes(tmp[tmp.length - 1].toLowerCase());
};

// 路径处理工具
const normalizePath = (path) => {
  return path.replace(/\\/g, '/');
};

// 版本号处理
const getVersionPlusNum = (version) => {
  try {
    version = version.split(".");
    let num = 1,
      ind = version.length - 1;
    while (num > 0 && ind >= 0) {
      let tmp = Number(version[ind]) + num;
      version[ind] = tmp % 10;
      num = Math.floor(tmp / 10);
      ind--;
    }
    return version.join(".");
  } catch (err) {
    return version;
  }
};

module.exports = {
  createProgressBar,
  handleError,
  checkImgType,
  normalizePath,
  getVersionPlusNum,
  IMG_TYPES
};

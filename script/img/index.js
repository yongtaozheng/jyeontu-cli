const inquirer = require("@jyeontu/j-inquirer");
const operateMap = {
  图片批量添加水印: require("./watermark/index"),
  百度图片批量下载: require("./download/index"),
  自定义背景二维码生成: require("./qrCode/index"),
  调整图片尺寸: require("./resize/index"),
};
const img = async () => {
  const options = [
    {
      type: "list",
      message: "请选择要进行的操作：",
      name: "action",
      choices: Object.keys(operateMap), //, "更新版本号"
    },
  ];
  const answers = await new inquirer(options).prompt();
  operateMap[answers.action]();
};

module.exports = img;

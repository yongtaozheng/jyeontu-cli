const inquirer = require("@jyeontu/j-inquirer");
const BaiduImgDownLoad = require("./BaiduImgDownLoad");
const baseDir = process.cwd();
const options = [
  {
    type: "input",
    message: "请输入图片关键字",
    name: "searchQuery",
    default: "",
  },
  {
    type: "input",
    message: "请输入开始页码(每页30条)",
    name: "startPage",
    default: "1",
  },
  {
    type: "input",
    message: "请输入结束页码",
    name: "endPage",
    default: "1",
  },
  {
    type: "folder",
    message: "请选择图片存放目录",
    name: "outputFolder",
    default: "",
    dirname: baseDir,
  },
];
async function ask(options) {
  const answers = await new inquirer(options).prompt();
  return answers;
}
const imgDownLoad = async () => {
  // 用户交互
  const answers = await ask(options);
  new BaiduImgDownLoad(answers).getSearchResults();
};
module.exports = imgDownLoad;

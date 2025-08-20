const inquirer = require("@jyeontu/j-inquirer");
const operateMap = {
  行数统计: require("./fileLineCount"),
  扫描大文件: require("./scanBigFile"),
  图片分组: require("./fileGrouping"),
  txt转pdf: require("./txt2pdf"),

};
const file = async () => {
  const options = [
    {
      type: "list",
      message: "请选择要进行的操作：",
      name: "action",
      choices: ["行数统计", "扫描大文件", "图片分组","txt转pdf"], //, "更新版本号"

    },
  ];
  const answers = await new inquirer(options).prompt();
  operateMap[answers.action]();
};

module.exports = file;

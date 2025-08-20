const inquirer = require("@jyeontu/j-inquirer");
const operateMap = {
  更新模板文件: require("./updateTemplate"),
  更新版本号: require("./updateVersion"),
};

const update = async () => {
  const options = [
    {
      type: "list",
      message: "请选择要进行的操作：",
      name: "action",
      choices: ["更新模板文件"], //, "更新版本号"
    },
  ];
  const answers = await new inquirer(options).prompt();
  operateMap[answers.action]();
};

module.exports = update;

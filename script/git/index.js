const inquirer = require("@jyeontu/j-inquirer");

const operateMap = {
  批量删除分支: require("./deleteBranch"),
  获取当天用户提交行数: require("./commitLineCount"),
  暴力rebase: require("./rebase"),
};
const git = async () => {
  const options = [
    {
      type: "list",
      message: "请选择要进行的操作：",
      name: "action",
      choices: Object.keys(operateMap),
    },
  ];
  const answers = await new inquirer(options).prompt();
  operateMap[answers.action]();
};

module.exports = git;

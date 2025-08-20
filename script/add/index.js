const fs = require("fs");
const path = require("path");
const inquirer = require("@jyeontu/j-inquirer");
const updateTemplate = require("../update/updateTemplate");

const fileFolder = path.join(__dirname + "/template");
const baseDir = process.cwd();
const options = [
  {
    type: "file",
    message: "请选择要添加的文件：",
    name: "chooseFile",
    dirname: fileFolder,
  },
  {
    type: "folder",
    message: "请选择创建位置：",
    name: "folderName",
    default: "",
    dirname: baseDir,
  },
  {
    type: "input",
    message: "请输入文件名：",
    name: "fileName",
    default: "",
  },
];

function copyFile(sourceFile, targetFile) {
  if (fs.existsSync(targetFile)) {
    console.log(targetFile + "已存在");
    return;
  }
  fs.copyFileSync(sourceFile, targetFile);
  console.log("已添加文件：", targetFile);
}

const add = async () => {
  //选择是否更新模板
  const updateOption = [
    {
      type: "list",
      message: "是否需要拉取最新模板",
      name: "confirm",
      choices: ["是", "否"],
      default: "否",
    },
  ];
  const answers = await new inquirer(updateOption).prompt();
  if (answers.confirm === "是") {
    updateTemplate();
  }
  // 提示用户输入模块名称
  new inquirer(options).prompt().then((answers) => {
    copyFile(answers.chooseFile, answers.folderName + "\\" + answers.fileName);
  });
};

module.exports = add;

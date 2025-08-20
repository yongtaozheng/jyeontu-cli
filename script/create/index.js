const fs = require("fs-extra");
const path = require("path");
const inquirer = require("@jyeontu/j-inquirer");
const updateTemplate = require("../update/updateTemplate");
const child_process = require("child_process");

const list = fs.readdirSync(__dirname + "/template");
const baseDir = process.cwd();
const options = [
  {
    type: "list",
    message: "请选择创建模版：",
    name: "moduleName",
    choices: list,
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
    message: "请输入目录名：",
    name: "createEname",
    default: "",
  },
];

function copyDirectory(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  const files = fs.readdirSync(sourceDir);
  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function createModule(answers) {
  const { moduleName, folderName, createEname, createName } = answers;
  const sourceDir = `${__dirname}/template/${moduleName}`;
  const targetDir = folderName;
  //目录创建
  console.log("正在新建模块目录");
  const createModulePath = `${targetDir}/${createEname}`;
  if (fs.existsSync(createModulePath)) {
    console.log("目录已存在：" + createModulePath + ",请重新选择");
    return;
  }
  fs.mkdirSync(createModulePath);
  console.log("模块目录创建成功");
  if (moduleName === "Chrome插件模板") {
    creatChromeExtension(createModulePath, createEname);
  } else {
    //模板复制
    console.log("正在复制模块模板文件");
    copyDirectory(sourceDir, createModulePath);
    console.log("模块模板文件已复制");
    console.log("模板已生成");
  }
}
async function creatChromeExtension(createModulePath, createEname) {
  const options = {
    cwd: createModulePath,
  };
  child_process.execSync(
    "git clone https://gitee.com/zheng_yongtao/vue-chrome-extension-quickstart.git",
    options
  );
  const removeList = [".git", "LICENSE"];
  for (const file of removeList) {
    fs.removeSync(
      createModulePath + "/vue-chrome-extension-quickstart/" + file
    );
  }
  fs.copySync(
    createModulePath + "/vue-chrome-extension-quickstart",
    createModulePath
  );
  fs.removeSync(createModulePath + "/vue-chrome-extension-quickstart");
  await fileReName(createModulePath, createEname);
}
async function fileReName(createModulePath, createEname) {
  if (fs.statSync(createModulePath).isDirectory()) {
    const list = fs.readdirSync(createModulePath);
    for (const item of list) {
      await fileReName(createModulePath + "/" + item, createEname);
    }
  } else {
    const content = fs.readFileSync(createModulePath, "utf8");
    fs.writeFileSync(
      createModulePath,
      content.replace(/createEname/g, createEname)
    );
  }
}
const create = async () => {
  updateTemplate();
  new inquirer(options).prompt().then((answers) => {
    createModule(answers);
  });
};

module.exports = create;

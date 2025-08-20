const child_process = require("child_process");
const inquirer = require("@jyeontu/j-inquirer");
const fs = require("fs");
const path = require("path");

const trimReg = /(\ +)|([ ])|\*/g;
const rowReg = /([\r\n])/g;
const options = [
  {
    type: "folder",
    message: "请选择根目录",
    name: "rootFolder",
    choices: ["更新模板文件", "更新版本号"],
  },
];
function isDirectory(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (error) {
    // 处理错误，例如文件不存在或无法访问
    console.error(error);
    return false;
  }
}
function getVersion(filePath) {
  let json = fs.readFileSync(filePath, "utf-8");
  const version = json.match(/['"]*version['"]*: ['"](\d*\.\d*\.\d*)['"],/) || [
    "",
    "获取不到版本号",
  ];
  return version[1];
}
function getPackage(dir, packageMap = {}, deep = 0) {
  const dirList = fs
    .readdirSync(dir)
    .filter((name) => !["node_modules"].includes(name));
  for (const name of dirList) {
    const fullPath = (dir + "/" + name).replaceAll("//", "/");
    if (["package.json", "mt.config.js"].includes(name)) {
      packageMap[fullPath] = getVersion(fullPath);
    }
    if (deep > 8) return;
    if (isDirectory(fullPath)) {
      getPackage(fullPath, packageMap, deep + 1);
    }
  }
}
function getVersionPlusNum(version) {
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
}
function confirmUpdate(tableData) {
  for (const data of tableData) {
    const content = fs.readFileSync(data.文件路径, "utf-8");
    const version = data.版本号.split(" -> ");
    const regStr = `['"]*version['"]*: ['"](${version[0]})['"],`;
    const reg = new RegExp(regStr);
    const matchContent = content.match(reg);
    fs.writeFileSync(
      data.文件路径,
      content.replace(
        matchContent[0],
        matchContent[0].replace(version[0], version[1])
      )
    );
  }
  console.log("当前版本号：");
  console.table(
    tableData.map((item) => {
      return {
        文件路径: item.文件路径,
        版本号: item.版本号.split(" -> ")[1],
      };
    })
  );
}
function updateInfoConsole(packageMap) {
  const tableData = [];
  for (const key in packageMap) {
    tableData.push({
      文件路径: key,
      版本号: `${packageMap[key]} -> ${getVersionPlusNum(packageMap[key])}`,
    });
  }
  console.table(
    tableData,
    ["文件路径", "版本号"],
    ["border: 1px solid #fff; padding: 5px;"]
  );
  return tableData;
}
function getCurrentBranch() {
  const command = "git symbolic-ref --short HEAD";
  const currentBranch = child_process
    .execSync(command)
    .toString()
    .replace(trimReg, "")
    .replace(rowReg, "");
  return currentBranch;
}
async function commitAndPush(tableData) {
  const currentBranch = getCurrentBranch();
  const answers = await new inquirer([
    {
      type: "input",
      message: "请输入远程仓库remote（默认为origin）：",
      name: "gitRemote",
      default: "origin",
    },
  ]).prompt();
  const fileList = tableData.map((item) => path.join(__dirname, item.文件路径));
  console.log("正在推送……");
  child_process.execSync(`git add ${fileList.join(" ")}`);
  child_process.execSync("git commit -m 更新版本号");
  child_process.execSync(`git push ${answers.gitRemote} ${currentBranch}`);
  console.log(`已推送到 ${answers.gitRemote}/${currentBranch}`);
}
const versionUpdate = () => {
  // 提示用户输入模块名称
  new inquirer(options).prompt().then(async (answers) => {
    const packageMap = {};
    getPackage(answers.rootFolder, packageMap, 0);
    const tableData = updateInfoConsole(packageMap);
    const isConfirm = await new inquirer([
      {
        type: "confirm",
        message: "确定修改以上版本号？(默认为y)",
        name: "confirm",
        default: "y",
      },
    ]).prompt();
    if (isConfirm.confirm) {
      return;
    }
    confirmUpdate(tableData);
    const isCommit = await new inquirer([
      {
        type: "confirm",
        message: "是否提交并推送到远程？(默认为y)",
        name: "confirm",
        default: "y",
      },
    ]).prompt();
    if (!isCommit.confirm) {
      return;
    }
    commitAndPush(tableData);
  });
};
module.exports = versionUpdate;

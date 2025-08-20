const child_process = require("child_process");
const inquirer = require("@jyeontu/j-inquirer");
const fs = require("fs-extra");
const path = require("path");
const BASEPATH = process.cwd();
const command = `git config --global core.quotepath false`;
child_process.execSync(command);

const XIEGANG = "@-斜杠-@";
let RESETHASH = "";

function getLastLogList(num = 30) {
  const command = `git log --pretty=format:"%H %an %ai %s" --date=iso8601 -${num}`;
  const res = child_process.execSync(command).toString();
  const list = [];
  const logList = [...new Set(res.trim().split("\n"))];
  logList.forEach((item) => {
    const arr = item.split(" ");
    list.push({
      hash: arr.shift(),
      author: arr.shift(),
      time: arr.shift() + " " + arr.shift(),
      msg: arr.shift() && arr.join(" "),
    });
  });
  return list;
}

async function doInquirer(options) {
  const answers = await new inquirer(options).prompt();
  return answers;
}
async function ask() {
  const logList = getLastLogList(31);
  const options = [
    {
      type: "list",
      message: "请选择要开始合并的记录",
      name: "chooseItem",
      choices: logList
        .map((item, index) => {
          return `${index + 1}、${item.msg} ${item.time}<${item.author}>`;
        })
        .slice(0, 30),
    },
  ];
  const res = await doInquirer(options);
  const { chooseItem } = res;
  const index = chooseItem.split("、")[0];
  RESETHASH = logList[index].hash;
  return logList.slice(0, index);
}
async function getChangeFileListByHash(hash) {
  const command = `git log -1 --name-only --pretty=format:"" ${hash}`;
  const res = child_process.execSync(command).toString();
  return res.split("\n");
}
async function getChangeFileList(list) {
  const fileSet = new Set();
  for (const item of list) {
    const fileList = await getChangeFileListByHash(item.hash);
    fileList.forEach((i) =>
      fileSet.add(decodeURIComponent(i).replace(/"/g, ""))
    );
  }
  return [...fileSet].filter((item) => item);
}
async function copyFile2Tmp(list) {
  fs.emptyDirSync(path.join(__dirname, "../../tmp/"));
  const gitRootDir = await getGitRootDir();
  for (const item of list) {
    fs.copyFileSync(
      path.join(gitRootDir, item),
      path.join(__dirname, "../../tmp/" + item.replace(/\//g, XIEGANG))
    );
  }
}
async function getGitRootDir(filePath = BASEPATH) {
  while (filePath) {
    if (fs.existsSync(path.join(filePath, ".git"))) {
      return filePath;
    }
    filePath = filePath.split("\\");
    filePath.pop();
    filePath = filePath.join("\\");
  }
  return "";
}
async function gitReset(info, hash = RESETHASH) {
  const command = `git reset --soft ${RESETHASH}`;
  await child_process.execSync(command);
  const options = [
    {
      type: "input",
      message: "请输入新的提交信息",
      name: "msg",
      default: info.msg,
    },
  ];
  const res = await doInquirer(options);
  const { msg } = res;
  await child_process.execSync(`git add .`);
  await child_process.execSync(`git commit -m ${msg}`);
}
async function run() {
  const infoList = await ask();
  //   const list = await getChangeFileList(infoList);
  //   await copyFile2Tmp(list);
  gitReset(infoList[infoList.length - 1]);
}
module.exports = run;

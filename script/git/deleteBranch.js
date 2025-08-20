const child_process = require("child_process");
const inquirer = require("@jyeontu/j-inquirer");
const ProgressBar = require("@jyeontu/progress-bar");
const progressBarConfig = {
  duration: 100,
  current: 0,
  block: "█",
  showNumber: true,
  tip: { 0: "请稍等……", 100: "已完成" },
  color: "blue",
};
const progressBar = new ProgressBar(progressBarConfig);
const branchListOptions = [
  {
    type: "list",
    message: "请选择要操作的分支来源：",
    name: "branchType",
    choices: ["本地分支", "远程分支", "本地+远程"],
  },
  {
    type: "input",
    message: "请输入远程仓库名（默认为origin）：",
    name: "gitRemote",
    default: "origin",
  },
  {
    type: "input",
    message: "请输入生产分支名（默认为develop）：",
    name: "devBranch",
    default: "develop",
  },
];
const gitInfoObj = {
  allBranch: [],
  gitRemote: "origin",
  devBranch: "develop",
  mergedList: [],
};
const trimReg = /(\ +)|([ ])|\*/g;
const rowReg = /([\r\n])/g;

function getMergedList() {
  const command = `git branch --merged ${gitInfoObj.devBranch || "develop"}`;
  const mergedList = child_process
    .execSync(command)
    .toString()
    .replace(trimReg, "")
    .replace(rowReg, "、");
  gitInfoObj.mergedList = mergedList.split("、").filter((item) => item !== "");
}
function getLocalBranchList() {
  const command = "git branch";
  const currentBranch = getCurrentBranch();
  let branch = child_process
    .execSync(command)
    .toString()
    .replace(trimReg, "")
    .replace(rowReg, "、");
  branch = branch
    .split("、")
    .filter(
      (item) => item !== "" && !item.includes("->") && item !== currentBranch
    );
  return branch;
}
function getRemoteList(gitRemote) {
  const command = `git ls-remote --heads ${gitRemote}`;
  let branchList = child_process
    .execSync(command)
    .toString()
    .replace(trimReg, "")
    .replace(rowReg, "、");
  branchList = branchList
    .split("、")
    .filter((item) => item.includes("refs/heads/"))
    .map((branch) => {
      return gitRemote + "/" + branch.split("refs/heads/")[1];
    });
  return branchList;
}
function getGitBranchList(branchType, gitRemote) {
  getMergedList();
  let branch = getLocalBranchList().concat(getRemoteList(gitRemote));
  gitInfoObj.allBranch = branch;
  if (branchType === "本地分支")
    return branch.filter((item) => !item.includes("/"));
  if (branchType === "远程分支")
    return branch.filter((item) => item.includes("/"));
  return branch;
}

async function doInquirer(options) {
  const answers = await new inquirer(options).prompt();
  return answers;
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
function getBranchLastCommitTime(branchName) {
  try {
    const command = `git show -s --format=%ci ${branchName}`;
    const result = child_process.execSync(command).toString();
    const date = result.split(" ");
    return date[0] + " " + date[1];
  } catch (err) {
    return "未获取到时间";
  }
}
function isMergedCheck(branch) {
  try {
    const command = `git branch --contains ${branch}`;
    const result = child_process
      .execSync(command)
      .toString()
      .replace(trimReg, "")
      .replace(rowReg, "、");
    const mergedList = result.split("、");
    return mergedList.includes(gitInfoObj.devBranch)
      ? `已合并到${gitInfoObj.devBranch}`
      : "";
  } catch (err) {
    return "未获取到合并状态";
  }
}
function getBranchListLastCommitTime(branchList) {
  let list = [];
  progressBar.run(0);
  branchList.forEach((branch, index) => {
    list.push({
      name: branch,
      time: getBranchLastCommitTime(branch),
      isMerged: isMergedCheck(branch),
    });
    progressBar.run(Math.floor(((index + 1) / branchList.length) * 100));
  });
  console.log();
  list = list.sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
  return list;
}
async function getDeleteBranch(branchList) {
  let options = [
    {
      type: "checkbox",
      message: `请选择要删除的分支(${branchList.length})：`,
      name: "branchList",
      choices: branchList.map((item) => {
        return `${item.name}（${item.time}） ${item.isMerged}`;
      }),
    },
  ];
  let answers = await doInquirer(options);
  let deleteBranchList = answers.branchList.map((item) => {
    return item.split("（")[0];
  });
  deleteBranchList = await getAsyncDeleteList(deleteBranchList);
  console.log("已选择分支：", deleteBranchList);
  options = [
    {
      type: "list",
      message: "确定删除以上分支：",
      name: "text",
      choices: ["取消", "确定"],
    },
  ];
  answers = await doInquirer(options);
  if (answers.text === "取消") return;
  return deleteBranchList;
}
async function getAsyncDeleteList(branchList) {
  const { branchType, allBranch, gitRemote } = gitInfoObj;
  let message = "";
  if (branchType === "本地分支") {
    message = "是否同步删除远程仓库同名分支？";
  } else if (branchType === "远程分支") {
    message = "是否同步删除本地仓库同名分支？";
  } else {
    return branchList;
  }
  let options = [
    {
      type: "list",
      message: message,
      name: "confirm",
      choices: ["是", "否"],
    },
  ];
  const answers = await doInquirer(options);
  const confirm = answers.confirm;
  if (confirm === "否")
    return branchList.map((item) => {
      return item.split("（")[0];
    });
  const newList = [];
  branchList.forEach((branch) => {
    branch = branch.split("（")[0];
    newList.push(branch);
    if (branchType === "本地分支") {
      branch = gitRemote + "/" + branch;
    } else {
      branch = branch.split("/")[1];
    }
    if (allBranch.includes(branch)) newList.push(branch);
  });
  return newList;
}
async function doDeleteBranch(branchList) {
  const deleteBranchList = await getDeleteBranch(branchList);
  if (!deleteBranchList) return;
  console.log("正在删除分支");
  progressBar.run(0);
  deleteBranchList.forEach((branch, index) => {
    let command = `git branch -D ${branch}`;
    if (branch.includes("/")) {
      const tmp = branch.split("/");
      command = `git push ${tmp[0]} :${tmp[1]}`;
    }
    child_process.execSync(command);
    progressBar.run(Math.floor(((index + 1) / deleteBranchList.length) * 100));
  });
  console.log("");
  console.log("已删除分支：" + deleteBranchList);
}
const gitDeleteBranch = async () => {
  const res = await doInquirer(branchListOptions);
  const { branchType, gitRemote, devBranch } = res;
  gitInfoObj.gitRemote = gitRemote || "origin";
  gitInfoObj.devBranch = devBranch || "develop";
  gitInfoObj.branchType = branchType;
  console.log("正在获取分支列表……");
  const branchList = getGitBranchList(branchType, gitRemote || "origin");
  if (branchList.length === 0) {
    console.log("本地分支列表为空");
    return;
  }
  console.log("正在获取各分支详细信息……");
  const branchListWithEditTime = getBranchListLastCommitTime(branchList);
  doDeleteBranch(branchListWithEditTime);
};
module.exports = gitDeleteBranch;

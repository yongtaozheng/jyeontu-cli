const child_process = require("child_process");

function getUserList() {
  const command = `git log --format='%aN'`;
  const res = child_process.execSync(command).toString().replaceAll("'", "");
  const usersList = [...new Set(res.trim().split("\n"))];
  return usersList;
}
function getCommitRecord(username) {
  const command = `git log --author="${username}" --since="midnight" --until=23:59:59 --pretty=tformat: --numstat`;
  const res = child_process.execSync(command).toString();

  // 将输出按行分割成数组
  const lines = res.trim().split("\n");
  let addedLines = 0;
  let removedLines = 0;

  // 遍历每行输出，提取新增和删除行数
  lines.forEach((line) => {
    const [added, removed] = line.split("\t");
    if (!isNaN(added)) {
      addedLines += parseInt(added) || 0;
    }
    if (!isNaN(removed)) {
      removedLines += parseInt(removed) || 0;
    }
  });

  return {
    作者: username,
    添加行数: addedLines,
    删除行数: removedLines,
    总修改行数: parseInt(addedLines) + parseInt(removedLines),
  };
}

const commitLineCount = () => {
  const userList = getUserList();
  const commitRecord = [];
  userList.forEach((user) => {
    commitRecord.push(getCommitRecord(user));
  });
  console.table(
    commitRecord.sort((a, b) => b.总修改行数 - a.总修改行数),
    ["作者", "添加行数", "删除行数", "总修改行数"],
    ["border: 1px solid #fff; padding: 5px;"]
  );
};

module.exports = commitLineCount;

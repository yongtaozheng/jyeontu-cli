const inquirer = require("@jyeontu/j-inquirer");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const numMap = {};
const maxLineMap = {};

function countLines(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");
  let validLines = 0;

  for (const line of lines) {
    // 排除空行和以双斜杠开头的行
    if (line.trim() !== "" && !line.trim().startsWith("//")) {
      validLines++;
    }
  }

  return validLines;
}

function checkEndWith(file, fileTypeList) {
  for (const fileType of fileTypeList) {
    if (file.endsWith("." + fileType)) return true;
  }
  return false;
}
function countCodeLines(dirPath, config) {
  const { fileType, ignoreName, maxLine } = config;
  let totalLines = 0;
  function traverseDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory() && !ignoreName.includes(file)) {
        traverseDirectory(filePath);
      } else if (stats.isFile() && checkEndWith(file, fileType)) {
        const lines = countLines(filePath);
        if (lines > maxLine) {
          maxLineMap[filePath] = lines;
        }
        const type = file.split(".")[file.split(".").length - 1];
        numMap[type] = (numMap[type] || 0) + lines;
        totalLines += lines;
      }
    });
  }

  traverseDirectory(dirPath);
  return totalLines;
}
const baseDir = process.cwd();
const fileLineCount = async () => {
  const {
    fileType = ["vue", "js", "ts", "css", "html"],
    ignoreName = ["node_modules", "dist"],
    maxLine = 1000,
  } = config.fileLineCount;
  const options = [
    {
      type: "folder",
      message: "请选择项目目录：",
      name: "folderName",
      default: "",
      dirname: baseDir,
    },
    {
      type: "input",
      message: `请输入需要统计的文件后缀（默认为${fileType.join("、")}）：`,
      name: "fileType",
      default: fileType.join("、"),
    },
    {
      type: "input",
      message: `请输入需要忽略的文件或目录（默认为${ignoreName.join("、")}）：`,
      name: "ignoreName",
      default: ignoreName.join("、"),
    },
    {
      type: "input",
      message: `请输入单文件行数阈值（默认为${maxLine}）：`,
      name: "maxLine",
      default: maxLine,
    },
  ];
  const answers = await new inquirer(options).prompt();
  for (const key in answers) {
    if (answers[key].includes("、")) answers[key] = answers[key].split("、");
  }
  const configData = config;
  configData.fileLineCount = answers;
  const jsonData = JSON.stringify(configData, null, 2); // 将对象转换为格式化的JSON字符串
  try {
    fs.writeFileSync(path.join(__dirname, "./config.json"), jsonData, "utf-8");
  } catch (err) {
    console.error("写入文件时发生错误:", err);
  }
  const projectPath = answers.folderName;
  const codeLines = countCodeLines(projectPath, answers);
  const data = [];
  for (const key in numMap) {
    data.push({
      文件类型: key,
      行数: numMap[key],
    });
  }
  data.push({
    文件类型: "总行数",
    行数: codeLines,
  });
  console.table(
    data.sort((a, b) => a.行数 - b.行数),
    ["文件类型", "行数"],
    ["border: 1px solid #fff; padding: 5px;"]
  );
  const overMaxLineData = [];
  for (const key in maxLineMap) {
    overMaxLineData.push({
      文件名: key,
      行数: maxLineMap[key],
    });
  }
  if (overMaxLineData.length == 0) {
    console.log(`暂无行数超出${answers.maxLine}的文件`);
  } else {
    console.log(`行数超出${answers.maxLine}的文件如下：`);
    console.table(
      overMaxLineData.sort((a, b) => a.行数 - b.行数),
      ["文件名", "行数"],
      ["border: 1px solid #fff; padding: 5px;"]
    );
  }
};
module.exports = fileLineCount;

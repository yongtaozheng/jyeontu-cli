const inquirer = require("@jyeontu/j-inquirer");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const maxFileMap = {};

// 指定要扫描的目录
function scanFiles(obj = {}) {
  const { directory, ignoreName = ["node_modules", "dist"], maxSize = 1 } = obj;
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && stats.size > 1024 * 1024 * maxSize) {
      maxFileMap[filePath] = `${(stats.size / (1024 * 1024)).toFixed(2)} M`;
    } else if (stats.isDirectory() && !ignoreName.includes(file)) {
      const tmp = JSON.parse(JSON.stringify(obj));
      tmp.directory = filePath;
      scanFiles(tmp); // 递归扫描子目录
    }
  });
}
const baseDir = process.cwd();
const scanBigFile = async () => {
  const { ignoreName = ["node_modules", "dist"], maxSize = 1 } =
    config.scanBigFile;
  const options = [
    {
      type: "folder",
      message: "请选择项目目录：",
      name: "directory",
      default: "",
      dirname: baseDir,
    },
    {
      type: "input",
      message: `请输入需要忽略的文件或目录（默认为${ignoreName.join("、")}）：`,
      name: "ignoreName",
      default: ignoreName.join("、"),
    },
    {
      type: "input",
      message: `请输入文件大小阈值（默认为${maxSize}M）：`,
      name: "maxSize",
      default: maxSize,
    },
  ];
  const answers = await new inquirer(options).prompt();
  for (const key in answers) {
    if (answers[key].includes("、")) answers[key] = answers[key].split("、");
  }
  const configData = config;
  configData.scanBigFile = answers;
  const jsonData = JSON.stringify(configData, null, 2); // 将对象转换为格式化的JSON字符串
  try {
    fs.writeFileSync(path.join(__dirname, "./config.json"), jsonData, "utf-8");
  } catch (err) {
    console.error("写入文件时发生错误:", err);
  }
  scanFiles(answers);
  const overMaxLineData = [];
  for (const key in maxFileMap) {
    overMaxLineData.push({
      文件名: key,
      大小: maxFileMap[key],
    });
  }
  if (overMaxLineData.length == 0) {
    console.log(`暂无大小超出${answers.maxSize}M的文件`);
  } else {
    console.log(`大小超出${answers.maxSize}M的文件如下：`);
    console.table(
      overMaxLineData.toSorted((a, b) => a.大小 - b.大小),
      ["文件名", "大小"],
      ["border: 1px solid #fff; padding: 5px;"]
    );
  }
};
module.exports = scanBigFile;

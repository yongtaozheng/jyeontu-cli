const JInquirer = require("@jyeontu/j-inquirer");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
class GetFileTree {
  constructor(config) {
    this.config = config || {};
  }
  async init() {
    const options = this.getOptions();
    let j = new JInquirer(options);
    let res = await j.prompt();
    this.config = res;
    const configData = config;
    configData.getDirTree = res;
    const jsonData = JSON.stringify(configData, null, 2); // 将对象转换为格式化的JSON字符串
    try {
      fs.writeFileSync(
        path.join(__dirname, "./config.json"),
        jsonData,
        "utf-8"
      );
    } catch (err) {
      console.error("写入文件时发生错误:", err);
    }
    this.generateTree(res);
  }
  getOptions() {
    const baseDir = process.cwd();
    const getDirTreeConfig = config.getDirTree || {};
    const { basepath, generatePath } = getDirTreeConfig;
    if (!fs.existsSync(basepath)) getDirTreeConfig.basepath = "";
    if (!fs.existsSync(generatePath)) getDirTreeConfig.generatePath = "";
    return [
      {
        type: "folder",
        message: "请选择文件夹：",
        name: "basepath",
        default: "",
        pathType: "absolute",
        dirname: getDirTreeConfig.basepath || baseDir,
      },
      {
        type: "input",
        message: `请输入需要过滤的文件名（英文逗号隔开）：(${getDirTreeConfig.filterFile})`,
        name: "filterFile",
        notNull: false,
        default: getDirTreeConfig.filterFile || "",
      },
      {
        type: "input",
        message: `请输入需要遍历的层数：(${getDirTreeConfig.stopFloor})`,
        name: "stopFloor",
        notNull: false,
        default: getDirTreeConfig.stopFloor || "",
      },
      {
        type: "folder",
        message: "请选择生成文件存放位置：",
        name: "generatePath",
        default: "",
        pathType: "absolute",
        dirname: getDirTreeConfig.generatePath || baseDir,
      },
    ];
  }
  generateTree(config) {
    const { basepath, generatePath } = this.config;
    console.log("获取中，请稍后……");
    let dirTree = [];
    dirTree = this.processDir(basepath, dirTree);
    this.fileTree = "";

    console.log("生成中，请稍后……");
    this.consoleTree(dirTree);
    this.writeTree(generatePath + "/fileTree.txt", this.fileTree);
    console.log("生成结束,生成文件为：" + generatePath + "\\fileTree.txt");
  }
  getPartPath(dirPath) {
    const { basepath } = this.config;
    let base = basepath.split(/\/|\\/g);
    dirPath = dirPath.split(/\/|\\/g);
    while (base.length && dirPath.length && base[0] === dirPath[0]) {
      base.shift();
      dirPath.shift();
    }
    return dirPath.join("/");
  }
  isFilterPath(item) {
    let { filterFile } = this.config;
    filterFile = filterFile.split(",");
    for (let i = 0; i < filterFile.length; i++) {
      let reg = filterFile[i];
      if (item.match(reg) && item.match(reg)[0] === item) return true;
    }
    return false;
  }
  processDir(dirPath, dirTree = [], floor = 1) {
    const { stopFloor, isFullPath } = this.config;
    if (stopFloor && floor > stopFloor) return;
    let list = fs.readdirSync(dirPath);
    list = list.filter((item) => {
      return !this.isFilterPath(item);
    });
    list.forEach((itemPath) => {
      const fullPath = path.join(dirPath, itemPath);
      const fileStat = fs.statSync(fullPath);
      const isFile = fileStat.isFile();
      const dir = {
        name: isFullPath ? this.getPartPath(fullPath) : itemPath,
      };
      if (!isFile) {
        dir.children = this.processDir(fullPath, [], floor + 1);
      }
      dirTree.push(dir);
    });
    return dirTree;
  }
  consoleTree(tree, floor = 1, str = "", adder = "───", isLast = false) {
    str += adder;
    for (let i = 0; i < tree.length; i++) {
      if (floor === 1 && i === 0) {
        this.fileTree += "\n" + "┌" + str + tree[i].name;
      } else if (
        (isLast || floor === 1) &&
        i === tree.length - 1 &&
        !tree[i].children
      ) {
        this.fileTree += "\n" + "└" + str + tree[i].name;
      } else {
        this.fileTree += "\n" + "├" + str + tree[i].name;
      }
      if (tree[i].children)
        this.consoleTree(
          tree[i].children,
          floor + 1,
          str,
          adder,
          (isLast || floor === 1) && i === tree.length - 1
        );
    }
  }
  writeTree(filePath, content) {
    this.clearTxt(filePath);
    fs.writeFileSync(filePath, `${content}`);
    console.log(content);
  }
  clearTxt(filePath) {
    this.fileTree = "";
    fs.writeFileSync(filePath, "");
  }
}
module.exports = GetFileTree;

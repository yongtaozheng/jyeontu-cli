const packageJson = require("../../package.json");
const path = require("path");
const consoleExplain = () => {
  const data = [
    { 命令: "create", 说明: "根据模板快速新建模块", 示例: "jyeontu create" },
    { 命令: "git", 说明: "git批量操作", 示例: "jyeontu git" },
    { 命令: "add", 说明: "添加单文件模板", 示例: "jyeontu add" },
    { 命令: "update", 说明: "更新插件相关配置", 示例: "jyeontu update" },
    { 命令: "wifi", 说明: "获取WiFi配置", 示例: "jyeontu wifi" },
    { 命令: "img", 说明: "图片操作", 示例: "jyeontu img" },
    { 命令: "file", 说明: "文件操作", 示例: "jyeontu file" },
    { 命令: "tree", 说明: "生成目录树", 示例: "jyeontu tree" },
    { 命令: "cwd", 说明: "查看插件存放位置", 示例: "jyeontu cwd" },
    { 命令: "-h", 说明: "获取插件说明", 示例: "jyeontu -h" },
    { 命令: "-v", 说明: "获取插件版本号", 示例: "jyeontu -v" },
  ];
  console.table(
    data,
    ["命令", "说明", "示例"],
    ["border: 1px solid #fff; padding: 5px;"]
  );
};
const help = (args) => {
  if (args.length === 1) args.push("-h");
  const order = args[1].toLowerCase();
  switch (order) {
    case "-v":
    case "-version":
      console.log("当前版本为：" + packageJson.version);
      break;
    case "-h":
    case "-help":
    case "help":
      consoleExplain();
      break;
    case "cwd":
      console.log("插件存放位置:", path.join(__dirname, "../../"));
      break;
    default:
      console.log("没有找到当前命令, 可以输入jyeontu -h 获取命令说明");
      break;
  }
};

module.exports = help;

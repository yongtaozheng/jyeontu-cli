#!/usr/bin/env node
const args = process.argv.slice(2); // 获取命令中携带参数
const operateMap = {
  create: require("./script/create/index"),
  git: require("./script/git/index"),
  help: require("./script/help/index"),
  cwd: require("./script/help/index"),
  add: require("./script/add/index"),
  update: require("./script/update/index"),
  wifi: require("./script/wifi/index"),
  img: require("./script/img/index"),
  file: require("./script/file/index"),
  tree: require("./script/tree/index"),
};
const helpList = ["cwd"];
if (args.length < 1 || args[0].startsWith("-") || helpList.includes(args[0]))
  args.unshift("help");
if (args.length < 1 || !operateMap[args[0]]) {
  // 简单校验命令是否正确
  console.log("没有找到当前命令, 可以输入jyeontu -h 获取命令说明");
  return;
}
operateMap[args[0]](args);

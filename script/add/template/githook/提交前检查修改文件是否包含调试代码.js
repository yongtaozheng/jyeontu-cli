#!/usr/bin/env node
const child_process = require("child_process");
const fs = require("fs");
const command = "git status";
const trimReg = /(\ +)|([ ])|([\r\n]|(["]))/g;
let commitFile = child_process.execSync(command).toString();
commitFile = commitFile.split("\n");
const fileList = [];
for (let i = 5; i < commitFile.length; i++) {
  const name = commitFile[i].split(":")[1];
  if (!name) break;
  fileList.push(decodeURI(name.replace(trimReg, "")));
}
const editFiles = [];
fileList.forEach((file) => {
  const txt = fs.readFileSync(file, "utf8");
  if (txt.includes("debugger")) {
    editFiles.push(file);
    fs.writeFileSync(file, txt.replace(/(debugger);?(\s*\n)*/g, ""));
    const commandAdd = "git add " + file;
    child_process.execSync(commandAdd).toString();
  }
});
console.log("editFiles: ", editFiles);
console.log("已清除提交文件中的 debugger");
process.exit(0);
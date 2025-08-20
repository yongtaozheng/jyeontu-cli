const path = require("path");
const child_process = require("child_process");
const fs = require("fs-extra");

function gitClone(folderName) {
  fs.mkdirSync(folderName);
  const repository_url =
    "https://gitee.com/zheng_yongtao/jyeontu-templates.git";
  // 执行 Git clone 命令
  const command = `git clone ${repository_url} ${folderName}`;
  console.log(`正在获取最新模板，请稍等……`);
  child_process.execSync(command).toString();
}
function getTemplate(folderName) {
  if (fs.existsSync(folderName)) {
    fs.removeSync(folderName);
  }
  gitClone(folderName);
}
function updateFile(folder) {
  const folderName = folder + "/template";
  const dirList = fs.readdirSync(folderName);
  //整个目录进行替换
  const replaceDirLite = ["create"];
  dirList.forEach((dir) => {
    const createFolderPath = path.join(folderName, dir);
    const sourceDirList = fs.readdirSync(createFolderPath);
    sourceDirList.forEach((sourceDir) => {
      const sourceDirPath = path.join(createFolderPath, sourceDir);
      const targetDirPath = path.join(
        __dirname,
        "../" + dir + "/template/" + sourceDir
      );
      copyFileOrDolder(
        sourceDirPath,
        targetDirPath,
        replaceDirLite.includes(dir)
      );
    });
  });
}

function copyFileOrDolder(sourcePath, targetPath, replaceDirLite = false) {
  if (replaceDirLite && fs.existsSync(targetPath)) {
    fs.removeSync(targetPath);
  }
  fs.copySync(sourcePath, targetPath, { overwrite: true });
}

const updateTemplate = () => {
  const folderName = __dirname + "/jyeontu-templates-folder";
  //从gitlab拉取最新模板代码
  getTemplate(folderName);
  console.log(`正在更新模板文件……`);
  updateFile(folderName);
  fs.removeSync(folderName);
  console.log(`已更新`);
};
module.exports = updateTemplate;

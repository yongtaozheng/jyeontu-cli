const inquirer = require("@jyeontu/j-inquirer");
const ProgressBar = require("@jyeontu/progress-bar");
const addImgWaterMark = require("./addImgWaterMark");
const addTextWaterMark = require("./addTextWaterMark");
const fs = require("fs");
const path = require("path");
const baseDir = process.cwd();
const progressBarConfig = {
  duration: 100,
  current: 0,
  block: "█",
  showNumber: true,
  tip: { 0: "请稍等……", 100: "已完成" },
  color: "blue",
};
const progressBar = new ProgressBar(progressBarConfig);
const IMG_TYPE = ["jpg", "png", "jpeg"];
const options = [
  {
    type: "folder",
    message: "请选择需要添加水印的图片目录",
    name: "inputFolder",
    default: "",
    dirname: baseDir,
  },
];
const typeOptions = [
  {
    type: "list",
    name: "type",
    choices: ["图片水印", "文字水印"],
    message: "请选择添加水印类型",
  },
];
const imgWaterMarkOptions = [
  {
    type: "file",
    message: "请选择一张图片作为水印",
    name: "watermarkPath",
    default: "",
    dirname: baseDir,
  },
  {
    type: "list",
    message: "请选择水印位置",
    name: "watermarkPos",
    default: "center",
    choices: [
      "上左",
      "上中",
      "上右",
      "中左",
      "正中",
      "中右",
      "下左",
      "下中",
      "下右",
    ],
  },
];
const textWaterMarkOptions = [
  {
    type: "input",
    message: "请输入水印文字",
    name: "watermarkText",
    default: "",
  },
  {
    type: "list",
    message: "请选择水印位置",
    name: "watermarkPos",
    default: "center",
    choices: [
      "上左",
      "上中",
      "上右",
      "中左",
      "正中",
      "中右",
      "下左",
      "下中",
      "下右",
    ],
  },
];
async function ask(options) {
  const answers = await new inquirer(options).prompt();
  return answers;
}
function checkImgType(file) {
  const tmp = file.split(".");
  return IMG_TYPE.includes(tmp[tmp.length - 1].toLocaleLowerCase());
}
async function imgWaterMark(inputFolder, outputFolder) {
  const { watermarkPath, watermarkPos } = await ask(imgWaterMarkOptions);
  const imageFiles = fs
    .readdirSync(inputFolder)
    .filter((file) => checkImgType(file));
  progressBar.run(0);
  for (let index = 0; index < imageFiles.length; index++) {
    const file = imageFiles[index];
    await addImgWaterMark(
      watermarkPath,
      watermarkPos,
      path.join(inputFolder, file),
      path.join(outputFolder, file)
    );
    progressBar.run(Math.floor(((index + 1) / imageFiles.length) * 100));
  }
}
async function textWaterMark(inputFolder, outputFolder) {
  const { watermarkText, watermarkPos } = await ask(textWaterMarkOptions);
  const imageFiles = fs
    .readdirSync(inputFolder)
    .filter((file) => checkImgType(file));
  progressBar.run(0);
  for (let index = 0; index < imageFiles.length; index++) {
    const file = imageFiles[index];
    await addTextWaterMark(
      path.join(inputFolder, file),
      path.join(outputFolder, file),
      watermarkText,
      watermarkPos
    );
    progressBar.run(Math.floor(((index + 1) / imageFiles.length) * 100));
  }
}
const addWaterMark = async () => {
  // 用户交互
  const { inputFolder } = await ask(options);
  const outputFolder = path.join(inputFolder, "../waterMarkImgOut");
  const { type } = await ask(typeOptions);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
  switch (type) {
    case "文字水印":
      await textWaterMark(inputFolder, outputFolder);
      break;
    case "图片水印":
      await imgWaterMark(inputFolder, outputFolder);
      break;
  }
  console.log(`水印图片保存路径为: ${outputFolder}`);
};
module.exports = addWaterMark;

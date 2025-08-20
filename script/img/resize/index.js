const fs = require("fs-extra");
const Jimp = require("jimp");
const inquirer = require("@jyeontu/j-inquirer");
const ProgressBar = require("@jyeontu/progress-bar");
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

async function askForSingleOrBatch() {
  const options = [
    {
      type: "list",
      message: "选择文件夹还是单张图片",
      name: "imgType",
      default: "单张图片",
      choices: ["文件夹", "单张图片"],
    },
  ];
  const answers = await new inquirer(options).prompt();
  const { imgType } = answers;
  return imgType;
}
async function askForParams(imgType) {
  const options = [];
  if (imgType === "文件夹") {
    options.push({
      type: "folder",
      message: "请选择图片目录",
      name: "imgFolder",
      default: "",
      dirname: baseDir,
    });
  } else {
    options.push({
      type: "file",
      message: "请选择图片",
      name: "img",
      default: "",
      dirname: baseDir,
    });
  }
  options.push({
    type: "list",
    message: "调整类型",
    name: "adjustType",
    default: "按比例",
    choices: ["按比例", "自定义宽高"],
  });
  const answers = await new inquirer(options).prompt();
  return answers;
}

async function askForImgParams(adjustType) {
  const options = [];
  if (adjustType === "按比例") {
    options.push(
      {
        type: "list",
        message: "请选择基准边",
        name: "referenceEdge",
        default: "宽",
        choices: ["宽", "高"],
      },
      {
        type: "input",
        message: "请输入基准边长度",
        name: "referenceEdgeLength",
        default: "800",
        validate: function (input) {
          const isNumber = !isNaN(input) && !isNaN(parseFloat(input));
          if (isNumber) {
            return true; // 输入有效
          } else {
            return "请输入一个有效的数字"; // 输入无效
          }
        },
      }
    );
  } else {
    options.push(
      {
        type: "input",
        message: "请输入宽度",
        name: "width",
        default: "1280",
        validate: function (input) {
          const isNumber = !isNaN(input) && !isNaN(parseFloat(input));
          if (isNumber) {
            return true; // 输入有效
          } else {
            return "请输入一个有效的数字"; // 输入无效
          }
        },
      },
      {
        type: "input",
        message: "请输入高度",
        name: "height",
        default: "720",
        validate: function (input) {
          const isNumber = !isNaN(input) && !isNaN(parseFloat(input));
          if (isNumber) {
            return true; // 输入有效
          } else {
            return "请输入一个有效的数字"; // 输入无效
          }
        },
      }
    );
  }
  const answers = await new inquirer(options).prompt();
  return answers;
}
function getWidthAndHeight(bitmap, params) {
  let { width, height } = bitmap;
  if (params.adjustType === "按比例") {
    if (params.referenceEdge === "宽") {
      const rate = params.referenceEdgeLength / width;
      width = params.referenceEdgeLength;
      height = height * rate;
    } else {
      const rate = params.referenceEdgeLength / height;
      height = params.referenceEdgeLength;
      width = width * rate;
    }
  } else {
    width = params.width;
    height = params.height;
  }
  width -= 0;
  height -= 0;
  return { width, height };
}
async function getOutPutDir(img) {
  const pathName = img.split("\\");
  const name = pathName.pop();
  pathName.push("resizeImgOutPut");
  const outputPath = pathName.join("\\");
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  pathName.push(name);
  return pathName.join("\\");
}
async function resizeImg(params) {
  const outputPath = await getOutPutDir(params.img);
  const image = await Jimp.read(params.img);
  const { width, height } = getWidthAndHeight(image.bitmap, params);
  const newSizeImage = image.resize(width, height);
  newSizeImage.write(outputPath);
}
async function resizeDir(params) {
  const imgList = fs.readdirSync(params.imgFolder);
  progressBar.run(0);
  for (let i = 0; i < imgList.length; i++) {
    if (imgList[i].match(/\.(jpg|jpeg|png|bmp|tiff|gif)$/i)) {
      await resizeImg({
        ...params,
        img: params.imgFolder + "\\" + imgList[i],
      });
    }
    progressBar.run(Math.floor(((i + 1) / imgList.length) * 100));
  }
}
async function doResize(params) {
  if (params.imgType === "单张图片") {
    if (!params.img.match(/\.(jpg|jpeg|png|bmp|tiff|gif)$/i)) {
      console.log("请选择正确的图片文件");
      return;
    }
    await resizeImg(params);
  } else {
    await resizeDir(params);
  }
}
async function run() {
  const imgType = await askForSingleOrBatch();
  const params = await askForParams(imgType);
  const imgParams = await askForImgParams(params.adjustType);
  await doResize({
    imgType,
    ...params,
    ...imgParams,
  });
}
module.exports = run;

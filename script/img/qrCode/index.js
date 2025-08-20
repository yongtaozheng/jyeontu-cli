const QRCode = require("qrcode");
const fs = require("fs-extra");
const Jimp = require("jimp");
const inquirer = require("@jyeontu/j-inquirer");
const path = require("path");
const baseDir = process.cwd();

// 生成二维码
async function generateQRCode(data, size) {
  try {
    // 设置二维码的选项
    const options = {
      width: size,
      height: size,
      color: {
        dark: "#000000", // 二维码的深色部分
        light: "#ffffff", // 二维码的浅色部分（透明）
      },
    };

    // 使用 await 等待二维码生成
    const qrCodeBuffer = await QRCode.toBuffer(data, options);

    // 将 Base64 字符串转换为 Buffer
    const qrCodeBase64 = Buffer.from(qrCodeBuffer).toString("base64");

    // 保存二维码图片
    await fs.writeFile(`jyeontuTmpQrCode.png`, Buffer.from(qrCodeBuffer));
  } catch (error) {
    console.error("生成二维码时发生错误:", error);
  }
}

// 添加背景图片
async function addBackground(backgroundUrl, size, outputFolder, keepRate) {
  try {
    // 加载背景图片并调整尺寸
    const background = await Jimp.read(backgroundUrl);

    const width = keepRate === "是" ? background.bitmap.width : size;
    const height = keepRate === "是" ? background.bitmap.height : size;
    const minLen = Math.min(width, height);
    const rate = size / minLen;
    await background.resize(width * rate, height * rate); // 调整背景图片尺寸

    // 加载二维码图片
    const qrCode = await Jimp.read("jyeontuTmpQrCode.png");
    // 设置二维码的透明度，以便可以看到背景图片
    qrCode.opacity(0.5); // 0.5 表示 50% 的透明度
    const x = (width * rate - size) / 2,
      y = (height * rate - size) / 2;
    // 将二维码放置在背景图片上
    background.composite(qrCode, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
    });
    const outPath = path.join(outputFolder, "output.png");
    // 保存合成后的图片
    await background.write(outPath);
    console.log(`合成后的图片已保存为 ${outPath}`);
    fs.remove("jyeontuTmpQrCode.png");
  } catch (error) {
    console.error("添加背景时发生错误:", error);
  }
}

const options = [
  {
    type: "input",
    message: "请输入二维码链接",
    name: "qrCodeUrl",
    default: "",
  },
  {
    type: "input",
    message: "请输入二维码尺寸",
    name: "qrCodeSize",
    default: "256",
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
    type: "file",
    message: "请选择背景图片",
    name: "backGroundImg",
    default: "",
    dirname: baseDir,
  },
  {
    type: "list",
    message: "是否保持背景图片比例",
    name: "keepRate",
    default: "否",
    choices: ["是", "否"],
  },
  {
    type: "folder",
    message: "请选择图片存放目录",
    name: "outputFolder",
    default: "",
    dirname: baseDir,
  },
];
async function ask(options) {
  const answers = await new inquirer(options).prompt();
  return answers;
}
async function run() {
  const answers = await ask(options);
  const { qrCodeUrl, qrCodeSize, backGroundImg, outputFolder, keepRate } =
    answers;
  // 调用函数生成二维码并添加背景
  await generateQRCode(qrCodeUrl, Number(qrCodeSize));
  addBackground(backGroundImg, Number(qrCodeSize), outputFolder, keepRate);
}
module.exports = run;

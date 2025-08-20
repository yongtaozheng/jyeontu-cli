const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const textOptions = {
  text: "",
  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, // 水印文字水平对齐方式
  alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE, // 水印文字垂直对齐方式
  fontSize: 32, // 水印文字大小
  opacity: 1, // 水印文字透明度
};

function getPosition(img, waterMark, pos) {
  const imageWidth = img.width;
  const imageHeight = img.height;
  const watermarkWidth = waterMark.width;
  const watermarkHeight = waterMark.height;
  let x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
  let y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标

  switch (pos) {
    case "上左":
      x = 10; // 水印横坐标
      y = 10; // 水印纵坐标
      break;
    case "上中":
      x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
      y = 10; // 水印纵坐标
      break;
    case "上右":
      x = imageWidth - watermarkWidth - 20; // 水印横坐标
      y = 10; // 水印纵坐标
      break;
    case "中左":
      x = 10; // 水印横坐标
      y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标
      break;
    case "正中":
      x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
      y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标
      break;
    case "中右":
      x = imageWidth - watermarkWidth - 20; // 水印横坐标
      y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标
      break;
    case "下左":
      x = 10; // 水印横坐标
      y = imageHeight - watermarkHeight - 20; // 水印纵坐标
      break;
    case "下中":
      x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
      y = imageHeight - watermarkHeight - 20; // 水印纵坐标
      break;
    case "下右":
      x = imageWidth - watermarkWidth - 20; // 水印横坐标
      y = imageHeight - watermarkHeight - 20; // 水印纵坐标
      break;
  }
  return {
    x,
    y,
  };
}

async function addWaterMark(
  inputFilePath,
  outputFilePath,
  watermarkText,
  watermarkPos,
  textconfig = {}
) {
  textOptions.text = watermarkText;
  for (const k in textconfig) {
    textOptions[k] = textconfig[k];
  }
  // 读取图片并添加水印
  const image = await Jimp.read(inputFilePath);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

  // 获取图片和水印的宽度和高度
  const imageWidth = image.getWidth();
  const imageHeight = image.getHeight();
  const watermarkWidth = Jimp.measureText(font, watermarkText);
  const watermarkHeight = Jimp.measureTextHeight(
    font,
    watermarkText,
    watermarkWidth
  );

  // 计算水印放置的位置
  const { x, y } = getPosition(
    {
      height: imageHeight,
      width: imageWidth,
    },
    { height: watermarkHeight, width: watermarkWidth },
    watermarkPos
  );

  // 创建带有半透明背景的图层
  const background = new Jimp(
    watermarkWidth + 20,
    watermarkHeight + 20,
    0x00000030
  ); // 0x00000080 表示半透明黑色背景

  // 将水印文字绘制到带有半透明背景的图层上
  background.print(font, 10, 10, textOptions, watermarkWidth, watermarkHeight);

  // 将带有半透明背景的图层合成到原始图片上，并放置在中间位置
  image.composite(background, x, y, { mode: Jimp.BLEND_SOURCE_OVER });

  // 保存处理后的图片
  await image.writeAsync(outputFilePath);
}
module.exports = addWaterMark;
